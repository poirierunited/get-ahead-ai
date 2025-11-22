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
    logger.debug('Creating interview in Firestore', {
      category: LogCategory.DB_INSERT,
      userId: interview.userId,
      questionsCount: interview.questions?.length || 0,
    });

    const collectionRef = db.collection('interviews');
    const docRef = await collectionRef.add(interview);

    logger.info('Interview created successfully in Firestore', {
      category: LogCategory.DB_INSERT,
      userId: interview.userId,
      interviewId: docRef.id,
    });

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
    logger.debug('Querying interview by ID from Firestore', {
      category: LogCategory.DB_QUERY,
      interviewId: id,
    });

    const docRef = db.collection('interviews').doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      logger.debug('Interview not found in Firestore', {
        category: LogCategory.DB_QUERY,
        interviewId: id,
      });
      return null;
    }

    logger.debug('Interview retrieved successfully from Firestore', {
      category: LogCategory.DB_QUERY,
      interviewId: id,
    });

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
    logger.debug('Querying latest feedback from Firestore', {
      category: LogCategory.DB_QUERY,
      interviewId,
      userId,
    });

    const querySnapshot = await db
      .collection('feedback')
      .where('interviewId', '==', interviewId)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      logger.debug('No feedback found in Firestore', {
        category: LogCategory.DB_QUERY,
        interviewId,
        userId,
      });
      return null;
    }

    const feedbackDoc = querySnapshot.docs[0];
    logger.debug('Latest feedback retrieved successfully from Firestore', {
      category: LogCategory.DB_QUERY,
      interviewId,
      userId,
      feedbackId: feedbackDoc.id,
    });

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
    logger.debug('Querying all feedbacks from Firestore', {
      category: LogCategory.DB_QUERY,
      interviewId,
      userId,
    });

    const querySnapshot = await db
      .collection('feedback')
      .where('interviewId', '==', interviewId)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    if (querySnapshot.empty) {
      logger.debug('No feedbacks found in Firestore', {
        category: LogCategory.DB_QUERY,
        interviewId,
        userId,
      });
      return [];
    }

    const feedbacks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];

    logger.debug('All feedbacks retrieved successfully from Firestore', {
      category: LogCategory.DB_QUERY,
      interviewId,
      userId,
      count: feedbacks.length,
    });

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
    logger.debug('Querying latest interviews from Firestore', {
      category: LogCategory.DB_QUERY,
      userId,
      limit,
    });

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

    logger.debug('Latest interviews retrieved successfully from Firestore', {
      category: LogCategory.DB_QUERY,
      userId,
      count: interviews.length,
      limit,
    });

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
    logger.debug('Querying user interviews from Firestore', {
      category: LogCategory.DB_QUERY,
      userId,
    });

    const interviewsRef = await db
      .collection('interviews')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const interviews = interviewsRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (InterviewEntity & { id: string })[];

    logger.debug('User interviews retrieved successfully from Firestore', {
      category: LogCategory.DB_QUERY,
      userId,
      count: interviews.length,
    });

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
