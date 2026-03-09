// ============================================================
// API ROUTER — Single onCall entry point that routes to handlers
// ============================================================
// In the real codebase, there's ONE Firebase onCall function
// that receives an { action, data } payload and dispatches
// to the correct handler. This keeps function deployment simple.

import { AuthService, CallableContext } from '../services/auth.service';
import { createMeeting } from './api/create-meeting';
import { getMeeting } from './api/get-meeting';
import { updateMeeting } from './api/update-meeting';
import { deleteMeeting } from './api/delete-meeting';
import { HttpsError, internal } from '../utils/errors';
import { securityErrorLog } from '../utils/security-log';

/** The shape of every API request */
export interface ApiRequest {
  action: string;
  data: Record<string, unknown>;
}

/** Action registry — maps action names to handler functions */
const ACTION_HANDLERS: Record<string, (data: any, authService: AuthService) => Promise<unknown>> = {
  createMeeting,
  getMeeting,
  updateMeeting,
  deleteMeeting,
  // Add new actions here — this is the only place you register them
};

/**
 * Main API handler — called by Firebase onCall.
 *
 * In production this looks like:
 *   export const apiCall = onCall<ApiRequest>({ region, memory, secrets }, async (request) => {
 *     return apiHandling(request);
 *   });
 */
export async function apiHandling(request: { data: ApiRequest; context: CallableContext }) {
  const { action, data } = request.data;
  const authService = new AuthService(request.context);

  const handler = ACTION_HANDLERS[action];
  if (!handler) {
    throw new HttpsError('invalid-argument', `Unknown action: ${action}`);
  }

  try {
    return await handler(data, authService);
  } catch (e) {
    // If it's already a typed error, log and re-throw
    if (e instanceof HttpsError) {
      securityErrorLog(
        { userId: request.context.auth?.uid, action, ip: 'unknown' },
        e.message,
      );
      throw e;
    }

    // Unknown errors — log but NEVER expose internals to the client
    securityErrorLog(
      { userId: request.context.auth?.uid, action, ip: 'unknown' },
      'Unexpected server error',
    );
    throw internal();
  }
}
