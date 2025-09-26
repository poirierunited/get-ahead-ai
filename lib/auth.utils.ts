/**
 * Authentication utility functions
 */

/**
 * Handles Firebase authentication errors and returns user-friendly messages
 * @param error - The Firebase error object
 * @param t - Translation function (optional, falls back to English)
 * @returns A user-friendly error message
 */
export function handleAuthError(
  error: any,
  t?: (key: string) => string
): string {
  if (error.code === 'auth/email-already-in-use') {
    return t?.('auth.emailAlreadyInUse') || 'This email is already in use';
  }

  if (error.code === 'auth/invalid-email') {
    return t?.('auth.invalidEmail') || 'Invalid email address';
  }

  if (error.code === 'auth/invalid-credential') {
    return t?.('auth.invalidEmailOrPassword') || 'Invalid email or password';
  }

  if (error.code === 'auth/weak-password') {
    return 'Password is too weak, it should be at least 6 characters long';
  }

  if (error.code === 'auth/user-not-found') {
    return 'User does not exist. Create an account.';
  }

  if (error.code === 'auth/wrong-password') {
    return 'Incorrect password';
  }

  if (error.code === 'auth/too-many-requests') {
    return 'Too many failed attempts. Please try again later.';
  }

  if (error.code === 'auth/network-request-failed') {
    return 'Network error. Please check your connection.';
  }

  if (error.code === 'auth/operation-not-allowed') {
    return 'Email/password accounts are not enabled';
  }

  if (error.code === 'auth/user-disabled') {
    return 'This account has been disabled';
  }

  if (error.code === 'auth/account-exists-with-different-credential') {
    return 'An account already exists with the same email but different sign-in credentials';
  }

  // Default error message
  return 'An error occurred. Please try again.';
}

/**
 * Validates email format
 * @param email - The email to validate
 * @returns True if email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * @param password - The password to validate
 * @returns An object with isValid boolean and message string
 */
export function validatePassword(password: string): {
  isValid: boolean;
  message: string;
} {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long',
    };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long' };
  }

  return { isValid: true, message: 'Password is valid' };
}

/**
 * Sanitizes user input for security
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
