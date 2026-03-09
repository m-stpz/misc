// ============================================================
// UPDATE MEETING — API handler
// ============================================================

import { AuthService } from '../../services/auth.service';
import { MeetingService } from '../../services/meeting.service';
import { hasPermission } from '../../permissions/acl.utils';
import { invalidArgument, notFound } from '../../utils/errors';

interface UpdateMeetingInput {
  organizationId: string;
  groupId: string;
  meetingId: string;
  title?: string;
  description?: string;
  date?: string;
}

function validate(data: unknown): data is UpdateMeetingInput {
  const d = data as UpdateMeetingInput;
  return (
    !!d &&
    typeof d.organizationId === 'string' && d.organizationId.length > 0 &&
    typeof d.groupId === 'string' && d.groupId.length > 0 &&
    typeof d.meetingId === 'string' && d.meetingId.length > 0 &&
    // At least one field to update
    (d.title !== undefined || d.description !== undefined || d.date !== undefined)
  );
}

export async function updateMeeting(data: unknown, authService: AuthService) {
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

  // --- Phase 2: Authorize (must have 'write' on the document ACL) ---
  const userId = authService.getUserId();
  if (!hasPermission(existing.acl, userId, 'write')) {
    throw authService.errorPermissionDenied;
  }

  // --- Phase 3: Execute ---
  await meetingService.updateMeeting(
    data.organizationId,
    data.groupId,
    data.meetingId,
    {
      title: data.title,
      description: data.description,
      date: data.date ? new Date(data.date) : undefined,
    },
  );

  return { success: true };
}
