"use server";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

export async function createFeedback({
  userId,
  interviewId,
  transcript,
  language = "en",
}: {
  userId: string;
  interviewId: string;
  transcript: Array<{ role: string; content: string }>;
  language?: string;
}) {
  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: feedbackSchema,
      prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out. Transcript: ${formattedTranscript} Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided: - **Communication Skills**: Clarity, articulation, structured responses. - **Technical Knowledge**: Understanding of key concepts for the role. - **Problem-Solving**: Ability to analyze problems and propose solutions. - **Cultural & Role Fit**: Alignment with company values and job role. - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.`,
      system: `You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Please provide feedback in ${language} language.`,
    });

    const feedbackData = {
      userId,
      interviewId,
      ...object,
      createdAt: new Date(),
    };

    const feedbackRef = await db.collection("feedback").add(feedbackData);
    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error creating feedback:", error);
    return { success: false, feedbackId: null };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews({
  userId,
}: {
  userId: string;
}): Promise<Interview[]> {
  try {
    const interviewsRef = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const interviews = interviewsRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    return interviews;
  } catch (error) {
    console.error("Error getting latest interviews:", error);
    return [];
  }
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[]> {
  try {
    const interviewsRef = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const interviews = interviewsRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    return interviews;
  } catch (error) {
    console.error("Error getting interviews:", error);
    return [];
  }
}
