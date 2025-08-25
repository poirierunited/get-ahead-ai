import 'server-only';
import { db } from '@/firebase/admin';
import type { InterviewEntity } from '@/types/interview';

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
