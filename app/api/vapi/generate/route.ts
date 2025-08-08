import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  console.log("=== VAPI API CALL RECEIVED ===");
  console.log("Request URL:", request.url);
  console.log("Request method:", request.method);

  try {
    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const { type, role, level, techstack, amount, userid } = body;

    const missingFields = validateRequest(
      type,
      role,
      level,
      techstack,
      amount,
      userid
    );

    if (missingFields) {
      console.log("Validation failed:", missingFields);
      return Response.json(
        { success: false, error: missingFields },
        {
          status: 400,
        }
      );
    }

    console.log("Validation passed, proceeding with interview generation...");

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    console.log("Generated questions:", questions);

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

    console.log("Saving interview to Firestore:", interview);

    await db.collection("interviews").add(interview);

    console.log("Interview saved successfully");
    return Response.json(
      { success: true, message: "Interview created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/vapi/generate:", error);
    return Response.json(
      { success: false, error: error?.toString() },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log("=== VAPI API GET REQUEST RECEIVED ===");
  return Response.json(
    { success: true, data: "API is working!" },
    { status: 200 }
  );
}

function validateRequest(
  type: string,
  role: string,
  level: string,
  techstack: string,
  amount: number,
  userid: string
) {
  if (!type) {
    return "type is missing";
  }
  if (!role) {
    return "role is missing";
  }
  if (!level) {
    return "level is missing";
  }
  if (!techstack) {
    return "techstack is missing";
  }
  if (!amount) {
    return "amount is missing";
  }
  if (!userid) {
    return "userid is missing";
  }
}
