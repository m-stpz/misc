// ============================================================
// DELETE MEETING — API handler
// ============================================================

import { AuthService } from '../../services/auth.service';
import { MeetingService } from '../../services/meeting.service';
import { hasPermission } from '../../permissions/acl.utils';
import { invalidArgument, notFound } from '../../utils/errors';

interface DeleteMeetingInput {
  organizationId: string;
  groupId: string;
  meetingId: string;
}

function validate(data: unknown): data is DeleteMeetingInput {
  const d = data as DeleteMeetingInput;
  return (
    !!d &&
    typeof d.organizationId === 'string' && d.organizationId.length > 0 &&
    typeof d.groupId === 'string' && d.groupId.length > 0 &&
    typeof d.meetingId === 'string' && d.meetingId.length > 0
  );
}

export async function deleteMeeting(data: unknown, authService: AuthService) {
  // --- Phase 1: Preflight ---
  if (!(await authService.isAuthenticated())) {
    throw authService.errorUnauthenticated;
  }

  if (!validate(data)) {
    throw invalidArgument(data);
  }

  // --- Fetch existing document ---
  const meetingService = null as unknown as MeetingService; // placeholder for DI

  const existing = await meetingService.getMeeting(
    data.organizationId,
    data.groupId,
    data.meetingId,
  );

  if (!existing) {
    throw notFound('Meeting');
  }

  // --- Phase 2: Authorize (must have 'delete' on the document ACL) ---
  const userId = authService.getUserId();
  if (!hasPermission(existing.acl, userId, 'delete')) {
    throw authService.errorPermissionDenied;
  }

  // --- Phase 3: Execute ---
  await meetingService.deleteMeeting(
    data.organizationId,
    data.groupId,
    data.meetingId,
  );

  return { success: true };
}
