import { NextResponse } from "next/server";
import { getLiveTelemetry } from "../../../../data/stadium";

export async function GET() {
  try {
    const telemetry = getLiveTelemetry();
    return NextResponse.json(telemetry, {
      headers: {
        'Cache-Control': 's-maxage=10, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error("Telemetry Error:", error);
    return NextResponse.json({ error: "Failed to fetch telemetry" }, { status: 500 });
  }
}
