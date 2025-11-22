import 'server-only';
import { db } from '@/firebase/admin';
import type { InterviewEntity } from '@/types/interview';
import { logger, LogCategory } from '@/lib/logger';
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
  try {
    const collectionRef = db.collection('interviews');
    const docRef = await collectionRef.add(interview);
    return docRef.id;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to create interview in Firestore', {
        category: LogCategory.DB_ERROR,
        userId: interview.userId,
        error: error.message,
        errorName: error.name,
        stack: error.stack,
      });
    }
    throw error;
  }
}

/**
 * Fetch a single interview by its document ID.
 *
 * @param id - The document ID of the interview.
 * @returns The interview entity with its ID, or null if not found.
 */
export async function getInterviewById(
  id: string
): Promise<(InterviewEntity & { id: string }) | null> {
  try {
    const docRef = db.collection('interviews').doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      return null;
    }

    return { id: snap.id, ...(snap.data() as InterviewEntity) };
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to query interview by ID from Firestore', {
        category: LogCategory.DB_ERROR,
        interviewId: id,
        error: error.message,
        errorName: error.name,
        stack: error.stack,
      });
    }
    throw error;
  }
}

/**
 * Fetch the most recent feedback by interview ID and user ID.
 * Optimized for list/card views where only the latest feedback is needed.
 *
 * @param interviewId - The ID of the interview.
 * @param userId - The ID of the user.
 * @returns The most recent feedback entity or null if none exists.
 */
export async function getFeedbackByInterviewId(
  interviewId: string,
  userId: string
): Promise<Feedback | null> {
  try {
    const querySnapshot = await db
      .collection('feedback')
      .where('interviewId', '==', interviewId)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return null;
    }

    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to query latest feedback from Firestore', {
        category: LogCategory.DB_ERROR,
        interviewId,
        userId,
        error: error.message,
        errorName: error.name,
        stack: error.stack,
      });
    }
    throw error;
  }
}

/**
 * Fetch all feedbacks by interview ID and user ID, ordered by creation date (newest first).
 *
 * @param interviewId - The ID of the interview.
 * @param userId - The ID of the user.
 * @returns A list of feedback entities.
 */
export async function getAllFeedbacksByInterviewId(
  interviewId: string,
  userId: string
): Promise<Feedback[]> {
  try {
    const querySnapshot = await db
      .collection('feedback')
      .where('interviewId', '==', interviewId)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    if (querySnapshot.empty) {
      return [];
    }

    const feedbacks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];

    return feedbacks;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to query all feedbacks from Firestore', {
        category: LogCategory.DB_ERROR,
        interviewId,
        userId,
        error: error.message,
        errorName: error.name,
        stack: error.stack,
      });
    }
    throw error;
  }
}

/**
 * Fetch latest interviews excluding user's own interviews.
 * Only returns finalized interviews.
 *
 * @param userId - The ID of the current user (to exclude).
 * @param limit - The maximum number of interviews to return (default: 20).
 * @returns A list of interview entities with their IDs.
 */
export async function getLatestInterviews(
  userId: string,
  limit: number = 20
): Promise<(InterviewEntity & { id: string })[]> {
  try {
    const interviewsRef = await db
      .collection('interviews')
      .orderBy('createdAt', 'desc')
      .where('finalized', '==', true)
      .where('userId', '!=', userId)
      .limit(limit)
      .get();

    const interviews = interviewsRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (InterviewEntity & { id: string })[];

    return interviews;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to query latest interviews from Firestore', {
        category: LogCategory.DB_ERROR,
        userId,
        limit,
        error: error.message,
        errorName: error.name,
        stack: error.stack,
      });
    }
    throw error;
  }
}

/**
 * Fetch interviews by user ID.
 *
 * @param userId - The ID of the user.
 * @returns A list of interview entities belonging to the user.
 */
export async function getInterviewsByUserId(
  userId: string
): Promise<(InterviewEntity & { id: string })[]> {
  try {
    const interviewsRef = await db
      .collection('interviews')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const interviews = interviewsRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (InterviewEntity & { id: string })[];

    return interviews;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Failed to query user interviews from Firestore', {
        category: LogCategory.DB_ERROR,
        userId,
        error: error.message,
        errorName: error.name,
        stack: error.stack,
      });
    }
    throw error;
  }
}
