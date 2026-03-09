// ============================================================
// ERRORS — Typed error factory for Cloud Functions
// ============================================================
// NEVER expose raw stack traces or internal details to clients.
// These factories create structured errors with safe messages.

/** Mirrors Firebase's HttpsError codes */
export type ErrorCode =
  | 'invalid-argument'
  | 'permission-denied'
  | 'not-found'
  | 'already-exists'
  | 'internal'
  | 'unauthenticated';

export class HttpsError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'HttpsError';
  }
}

// --- Error factories (use these, don't construct HttpsError directly) ---

export const invalidArgument = (context?: unknown) =>
  new HttpsError('invalid-argument', 'Invalid or missing input data.');

export const permissionDenied = () =>
  new HttpsError('permission-denied', 'You do not have permission to perform this action.');

export const notFound = (entity: string) =>
  new HttpsError('not-found', `${entity} not found.`);

export const alreadyExists = (entity: string) =>
  new HttpsError('already-exists', `${entity} already exists.`);

export const unauthenticated = () =>
  new HttpsError('unauthenticated', 'You must be authenticated to perform this action.');

export const internal = () =>
  new HttpsError('internal', 'An unexpected error occurred.');
