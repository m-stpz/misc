// ============================================================
// CREATE MEETING — API handler
// ============================================================
// Every handler follows the same 3-phase pattern:
//   1. Preflight  — auth check + input validation
//   2. Authorize  — role/ACL check
//   3. Execute    — call the service layer

import { AuthService, GroupRole } from '../../services/auth.service';
import { MeetingService } from '../../services/meeting.service';
import { invalidArgument } from '../../utils/errors';
// In production: const meetingService = Container.get(MeetingService);

interface CreateMeetingInput {
  organizationId: string;
  groupId: string;
  title: string;
  description: string;
  date: string; // ISO string from the client
}

/** Input validation — pure function, no side effects */
function validate(data: unknown): data is CreateMeetingInput {
  const d = data as CreateMeetingInput;
  return (
    !!d &&
    typeof d.organizationId === 'string' && d.organizationId.length > 0 &&
    typeof d.groupId === 'string' && d.groupId.length > 0 &&
    typeof d.title === 'string' && d.title.length > 0 &&
    typeof d.description === 'string' &&
    typeof d.date === 'string' && !isNaN(Date.parse(d.date))
  );
}

export async function createMeeting(data: unknown, authService: AuthService) {
  // --- Phase 1: Preflight ---
  if (!(await authService.isAuthenticated())) {
    throw authService.errorUnauthenticated;
  }

  if (!validate(data)) {
    throw invalidArgument(data);
  }

  // --- Phase 2: Authorize ---
  // User must be at least an ASSISTANT in the group to create meetings
  const canCreate = await authService.hasAnyGroupRole(
    data.organizationId,
    data.groupId,
    [GroupRole.ADMIN, GroupRole.ASSISTANT],
  );
  if (!canCreate) {
    throw authService.errorPermissionDenied;
  }

  // --- Phase 3: Execute ---
  const userId = authService.getUserId();

  // In production: const meetingService = Container.get(MeetingService);
  const meetingService = null as unknown as MeetingService; // placeholder for DI

  const meeting = await meetingService.createMeeting(
    data.organizationId,
    data.groupId,
    userId,
    {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
    },
  );

  return { id: meeting.id };
}
