// ============================================================
// MEETING SERVICE — Business logic layer
// ============================================================
// Services sit between functions and repositories.
// Repositories = data access. Services = business rules.
//
// Services handle:
//   - Orchestrating multiple repository calls
//   - Activity logging / audit trail
//   - Notifications
//   - Denormalization (updating derived data)
//   - Typesense search indexing

import { ID } from '../models/base.model';
import { Meeting, MeetingPathProperties } from '../models/meeting.model';
import { MeetingRepository } from '../repositories/meeting.repository';
import { buildCreatorACL, grantGroupRead } from '../permissions/acl.utils';

// In the real codebase, these come from Container.get(ServiceType)
// import { ActivityLogService } from './activity-log.service';
// import { NotificationAddService } from './notification-add.service';

export class MeetingService {
  constructor(
    private _meetingRepo: MeetingRepository,
    // private _activityLogService: ActivityLogService,
    // private _notificationService: NotificationAddService,
  ) {}

  private _pathProps(organizationId: ID, groupId: ID): MeetingPathProperties {
    return { organization: organizationId, group: groupId };
  }

  // --- CREATE ---

  async createMeeting(
    organizationId: ID,
    groupId: ID,
    userId: ID,
    input: { title: string; description: string; date: Date },
  ): Promise<Meeting> {
    const now = new Date();
    const meetingId = generateId(); // In production: Firestore auto-ID or uuid

    const meeting: Meeting = {
      id: meetingId,
      title: input.title,
      description: input.description,
      date: input.date,
      organizationId,
      groupId,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
      acl: grantGroupRead(buildCreatorACL(userId), groupId),
    };

    const props = { ...this._pathProps(organizationId, groupId), id: meetingId };
    await this._meetingRepo.create(props, meeting);

    // Side effects — these happen AFTER the main write
    // await this._activityLogService.log('meeting.created', userId, meetingId);
    // await this._notificationService.notifyGroup(groupId, 'New meeting created');

    return meeting;
  }

  // --- READ ---

  async getMeeting(organizationId: ID, groupId: ID, meetingId: ID): Promise<Meeting | null> {
    return this._meetingRepo.get({
      ...this._pathProps(organizationId, groupId),
      id: meetingId,
    });
  }

  async listMeetings(organizationId: ID, groupId: ID): Promise<Meeting[]> {
    return this._meetingRepo.find(this._pathProps(organizationId, groupId));
  }

  // --- UPDATE ---

  async updateMeeting(
    organizationId: ID,
    groupId: ID,
    meetingId: ID,
    updates: { title?: string; description?: string; date?: Date },
  ): Promise<void> {
    const props = { ...this._pathProps(organizationId, groupId), id: meetingId };

    await this._meetingRepo.update(props, {
      ...updates,
      updatedAt: new Date(),
    } as Partial<Meeting>);

    // await this._activityLogService.log('meeting.updated', userId, meetingId);
  }

  // --- DELETE ---

  async deleteMeeting(organizationId: ID, groupId: ID, meetingId: ID): Promise<void> {
    const props = { ...this._pathProps(organizationId, groupId), id: meetingId };
    await this._meetingRepo.delete(props);

    // await this._activityLogService.log('meeting.deleted', userId, meetingId);
  }
}

// --- Helper ---
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
