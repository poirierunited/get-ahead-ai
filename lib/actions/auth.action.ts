'use server';

import { auth, db } from '@/firebase/admin';
import { cookies } from 'next/headers';
import { AUTH_COOKIES, SESSION_DURATION, COOKIE_OPTIONS } from '@/constants';
import { handleAuthError } from '@/lib/auth.utils';
import { logger, LogCategory } from '@/lib/logger';

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set(AUTH_COOKIES.SESSION, sessionCookie, COOKIE_OPTIONS);
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection('users').doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: 'User already exists. Please sign in.',
      };

    // save user to db
    await db.collection('users').doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: 'Account created successfully. Please sign in.',
    };
  } catch (error: any) {
    logger.error('Error creating user', {
      category: LogCategory.AUTH_FAILURE,
      error: error.message,
      errorName: error.name,
      uid,
      email,
    });
    return {
      success: false,
      message: handleAuthError(error),
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: 'User does not exist. Create an account.',
      };

    await setSessionCookie(idToken);

    return {
      success: true,
      message: 'Signed in successfully.',
    };
  } catch (error: any) {
    logger.error('Sign in error', {
      category: LogCategory.AUTH_FAILURE,
      error: error.message,
      errorName: error.name,
      email,
    });
    return {
      success: false,
      message: handleAuthError(error),
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIES.SESSION);
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get(AUTH_COOKIES.SESSION)?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection('users')
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    logger.warn('Session verification failed', {
      category: LogCategory.AUTH_SESSION,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Invalid or expired session
    return null;
  }
}
