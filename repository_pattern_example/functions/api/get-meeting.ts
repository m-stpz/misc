// ============================================================
// GET MEETING — API handler (Read)
// ============================================================

import { AuthService } from '../../services/auth.service';
import { MeetingService } from '../../services/meeting.service';
import { hasPermission } from '../../permissions/acl.utils';
import { invalidArgument, notFound } from '../../utils/errors';

interface GetMeetingInput {
  organizationId: string;
  groupId: string;
  meetingId: string;
}

function validate(data: unknown): data is GetMeetingInput {
  const d = data as GetMeetingInput;
  return (
    !!d &&
    typeof d.organizationId === 'string' && d.organizationId.length > 0 &&
    typeof d.groupId === 'string' && d.groupId.length > 0 &&
    typeof d.meetingId === 'string' && d.meetingId.length > 0
  );
}

export async function getMeeting(data: unknown, authService: AuthService) {
  // --- Phase 1: Preflight ---
  if (!(await authService.isAuthenticated())) {
    throw authService.errorUnauthenticated;
  }

  if (!validate(data)) {
    throw invalidArgument(data);
  }

  // --- Phase 3: Execute (fetch first, then check ACL) ---
  const meetingService = null as unknown as MeetingService; // placeholder for DI

  const meeting = await meetingService.getMeeting(
    data.organizationId,
    data.groupId,
    data.meetingId,
  );

  if (!meeting) {
    throw notFound('Meeting');
  }

  // --- Phase 2: Authorize (ACL-based, checked against the document) ---
  const userId = authService.getUserId();
  if (!hasPermission(meeting.acl, userId, 'read')) {
    throw authService.errorPermissionDenied;
  }

  return meeting;
}
