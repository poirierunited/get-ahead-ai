import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getMessages } from "next-intl/server";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const { role, level, techstack, type, amount, userid } =
      await request.json();

    // Get the locale from the URL path
    const pathname = request.nextUrl.pathname;
    const locale = pathname.split("/")[1]; // Extract locale from /[locale]/api/...

    // Get messages for the current locale
    const messages = await getMessages({ locale });

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: messages.api.generateInterview.prompt
        .replace("{role}", role)
        .replace("{level}", level)
        .replace("{techstack}", techstack)
        .replace("{type}", type)
        .replace("{amount}", amount),
      system: messages.api.generateInterview.systemPrompt.replace(
        "{language}",
        locale === "es" ? "Spanish" : "English"
      ),
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return NextResponse.json(
      {
        success: true,
        questions: interview.questions,
        interview: interview,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1];
  return NextResponse.json({
    message: "Endpoint working, language: " + locale,
  });
}
