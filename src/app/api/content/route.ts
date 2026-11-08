import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ALLOWED_FILES = ["poems", "offerings", "gifts", "site"] as const;
type AllowedFile = (typeof ALLOWED_FILES)[number];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as AllowedFile | null;

  if (!type || !ALLOWED_FILES.includes(type)) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "src", "data", `${type}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read data file", details: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body as { type: AllowedFile; data: unknown };

    if (!type || !ALLOWED_FILES.includes(type) || !data) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "src", "data", `${type}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({
      ok: true,
      message: `Saved ${type}.json successfully.`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "Could not write to disk (if hosted on a read-only serverless environment, use the Download JSON button).",
        details: String(err),
      },
      { status: 500 }
    );
  }
}

