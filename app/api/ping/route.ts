import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString();
    const url = request.url;

    return Response.json(
      {
        success: true,
        message: "API is running",
        timestamp,
        url,
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Ping endpoint error:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const timestamp = new Date().toISOString();

    return Response.json(
      {
        success: true,
        message: "POST request received",
        receivedData: body,
        timestamp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ping POST endpoint error:", error);
    return Response.json(
      {
        success: false,
        error: "Invalid request body",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }
}
