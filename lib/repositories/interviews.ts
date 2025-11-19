import 'server-only';
import { db } from '@/firebase/admin';
import type { InterviewEntity } from '@/types/interview';
// @ts-ignore - types are defined globally

/**
 * Persist an interview entity to Firestore.
 *
 * @param interview - Fully constructed interview entity to be stored
 * @returns The created document ID
 */
export async function createInterview(
  interview: InterviewEntity
): Promise<string> {
  const collectionRef = db.collection('interviews');
  const docRef = await collectionRef.add(interview);
  return docRef.id;
}

/**
 * Fetch a single interview by its document ID.
 */
export async function getInterviewById(
  id: string
): Promise<(InterviewEntity & { id: string }) | null> {
  const docRef = db.collection('interviews').doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return null;
  return { id: snap.id, ...(snap.data() as InterviewEntity) };
}

/**
 * Fetch the most recent feedback by interview ID and user ID.
 * Optimized for list/card views where only the latest feedback is needed.
 */
export async function getFeedbackByInterviewId(
  interviewId: string,
  userId: string
): Promise<Feedback | null> {
  const querySnapshot = await db
    .collection('feedback')
    .where('interviewId', '==', interviewId)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

/**
 * Fetch all feedbacks by interview ID and user ID, ordered by creation date (newest first).
 */
export async function getAllFeedbacksByInterviewId(
  interviewId: string,
  userId: string
): Promise<Feedback[]> {
  const querySnapshot = await db
    .collection('feedback')
    .where('interviewId', '==', interviewId)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  if (querySnapshot.empty) return [];

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Feedback[];
}

/**
 * Fetch latest interviews excluding user's own interviews.
 */
export async function getLatestInterviews(
  userId: string,
  limit: number = 20
): Promise<(InterviewEntity & { id: string })[]> {
  const interviewsRef = await db
    .collection('interviews')
    .orderBy('createdAt', 'desc')
    .where('finalized', '==', true)
    .where('userId', '!=', userId)
    .limit(limit)
    .get();

  return interviewsRef.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (InterviewEntity & { id: string })[];
}

/**
 * Fetch interviews by user ID.
 */
export async function getInterviewsByUserId(
  userId: string
): Promise<(InterviewEntity & { id: string })[]> {
  const interviewsRef = await db
    .collection('interviews')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return interviewsRef.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (InterviewEntity & { id: string })[];
}
