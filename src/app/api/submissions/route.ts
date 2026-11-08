import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import fs from "fs/promises";
import path from "path";
import { getSiteData } from "@/lib/content";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export interface SubmissionRecord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  subject: string;
  offering?: string;
  message: string;
  recipientEmail: string;
  status: "new" | "read" | "replied" | "archived";
  emailSent: boolean;
  createdAt: string;
  storageBackend?: "convex" | "local";
}

const LOCAL_SUBMISSIONS_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "submissions.json"
);

function getConvexClient(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  return new ConvexHttpClient(url);
}

async function readLocalSubmissions(): Promise<SubmissionRecord[]> {
  try {
    const raw = await fs.readFile(LOCAL_SUBMISSIONS_PATH, "utf-8");
    return JSON.parse(raw) as SubmissionRecord[];
  } catch {
    return [];
  }
}

async function writeLocalSubmissions(items: SubmissionRecord[]) {
  try {
    await fs.writeFile(
      LOCAL_SUBMISSIONS_PATH,
      JSON.stringify(items, null, 2),
      "utf-8"
    );
  } catch {
    // Ignore on read-only serverless filesystems when Convex is used
  }
}

async function sendEmailViaResend(payload: {
  name: string;
  email: string;
  phone?: string;
  category: string;
  subject: string;
  offering?: string;
  message: string;
  recipientEmail: string;
}): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return false;

  const fromAddress =
    process.env.RESEND_FROM_EMAIL ||
    "Clodagh Beresford Dunne Website <onboarding@resend.dev>";

  const htmlBody = `
    <div style="font-family: Georgia, serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #d6d3d1; background: #fafaf9; color: #1c1917;">
      <p style="font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9a7b38; margin: 0 0 6px 0; font-weight: bold;">
        New Website Booking / Enquiry — ${payload.category}
      </p>
      <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: normal;">
        ${payload.subject}
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; background: #ffffff; border: 1px solid #e7e5e4;">
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4; font-weight: bold; width: 130px;">From:</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4;">${payload.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4; font-weight: bold;">Reply Email:</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4;"><a href="mailto:${payload.email}">${payload.email}</a></td>
        </tr>
        ${
          payload.phone
            ? `<tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4; font-weight: bold;">Phone / WhatsApp:</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4;">${payload.phone}</td>
        </tr>`
            : ""
        }
        ${
          payload.offering
            ? `<tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4; font-weight: bold;">Selected Item:</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e7e5e4;">${payload.offering}</td>
        </tr>`
            : ""
        }
      </table>
      <div style="background: #ffffff; padding: 16px; border-left: 4px solid #9a7b38; white-space: pre-wrap; line-height: 1.6; font-size: 15px;">${payload.message}</div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [payload.recipientEmail],
        reply_to: payload.email,
        subject: `[Website ${payload.category}] ${payload.subject} — from ${payload.name}`,
        html: htmlBody,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  const auth = await isAdminAuthenticated();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const convex = getConvexClient();

  if (convex) {
    try {
      const items = (await convex.query(
        api.submissions.list,
        {}
      )) as SubmissionRecord[];
      return NextResponse.json({
        backend: "convex",
        configured: true,
        items,
      });
    } catch {
      // Fallback to local JSON if Convex functions aren't pushed yet
    }
  }

  const localItems = await readLocalSubmissions();
  return NextResponse.json({
    backend: "local",
    configured: Boolean(process.env.NEXT_PUBLIC_CONVEX_URL),
    items: localItems,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      category = "General Enquiry",
      subject,
      offering,
      message,
    } = body as {
      name: string;
      email: string;
      phone?: string;
      category?: string;
      subject: string;
      offering?: string;
      message: string;
    };

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please complete all required fields (name, email, subject, message)." },
        { status: 400 }
      );
    }

    const site = getSiteData();
    const recipientEmail = site.email || "clodaghberesford@yahoo.com";

    // 1. Send email notification if RESEND_API_KEY is set in Next.js or Convex
    let emailSent = await sendEmailViaResend({
      name,
      email,
      phone,
      category,
      subject,
      offering,
      message,
      recipientEmail,
    });

    // 2. Save to Convex if NEXT_PUBLIC_CONVEX_URL is configured
    const convex = getConvexClient();
    let savedToConvex = false;
    let recordId = `sub-${Date.now()}`;

    if (convex) {
      try {
        if (!emailSent) {
          const actionResult = (await convex.action(
            api.submissions.sendEmailNotification,
            {
              name,
              email,
              phone,
              category,
              subject,
              offering,
              message,
              recipientEmail,
            }
          )) as { sent?: boolean };
          if (actionResult?.sent) emailSent = true;
        }

        const convexId = await convex.mutation(api.submissions.create, {
          name,
          email,
          phone,
          category,
          subject,
          offering,
          message,
          recipientEmail,
          emailSent,
        });
        recordId = String(convexId);
        savedToConvex = true;
      } catch {
        // Fallback to local storage if Convex schema hasn't been deployed yet
      }
    }

    // 3. Also store in local submissions.json fallback so /admin always has a copy in dev
    if (!savedToConvex) {
      const existing = await readLocalSubmissions();
      const newRecord: SubmissionRecord = {
        _id: recordId,
        name,
        email,
        phone,
        category,
        subject,
        offering,
        message,
        recipientEmail,
        status: "new",
        emailSent,
        createdAt: new Date().toISOString(),
        storageBackend: "local",
      };
      await writeLocalSubmissions([newRecord, ...existing]);
    }

    return NextResponse.json({
      ok: true,
      id: recordId,
      backend: savedToConvex ? "convex" : "local",
      emailSent,
      recipientEmail,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to submit enquiry", details: String(err) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await isAdminAuthenticated();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body as {
      id: string;
      status: "new" | "read" | "replied" | "archived";
    };

    const convex = getConvexClient();
    if (convex && !id.startsWith("sub-")) {
      try {
        await convex.mutation(api.submissions.updateStatus, {
          id: id as Id<"submissions">,
          status,
        });
        return NextResponse.json({ ok: true, backend: "convex" });
      } catch {
        // Fall through to local
      }
    }

    const existing = await readLocalSubmissions();
    const updated = existing.map((item) =>
      item._id === id ? { ...item, status } : item
    );
    await writeLocalSubmissions(updated);
    return NextResponse.json({ ok: true, backend: "local" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update submission status", details: String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await isAdminAuthenticated();
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const convex = getConvexClient();
    if (convex && !id.startsWith("sub-")) {
      try {
        await convex.mutation(api.submissions.remove, {
          id: id as Id<"submissions">,
        });
        return NextResponse.json({ ok: true, backend: "convex" });
      } catch {
        // Fall through to local
      }
    }

    const existing = await readLocalSubmissions();
    const updated = existing.filter((item) => item._id !== id);
    await writeLocalSubmissions(updated);
    return NextResponse.json({ ok: true, backend: "local" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete submission", details: String(err) },
      { status: 500 }
    );
  }
}

