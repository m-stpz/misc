// ============================================================
// MEETING SERVICE (Frontend / Angular)
// ============================================================
// This is the Angular service that the component calls.
// It wraps Firebase callable functions — the frontend NEVER
// calls Firestore directly for writes. Reads can use the
// client SDK through Angular's Firestore module.

import { Injectable, inject } from '@angular/core';
// import { Functions, httpsCallable } from '@angular/fire/functions';

/** Simplified stand-in for Angular Fire's Functions */
type Functions = any;
function httpsCallable(fns: Functions, name: string) {
  return (data: unknown) => Promise.resolve({ data: {} });
}

export interface CreateMeetingInput {
  organizationId: string;
  groupId: string;
  title: string;
  description: string;
  date: string;
}

export interface UpdateMeetingInput {
  organizationId: string;
  groupId: string;
  meetingId: string;
  title?: string;
  description?: string;
  date?: string;
}

export interface DeleteMeetingInput {
  organizationId: string;
  groupId: string;
  meetingId: string;
}

@Injectable({ providedIn: 'root' })
export class MeetingFrontendService {
  // inject() instead of constructor injection — per project conventions
  private _functions = inject(Functions);

  /** All writes go through the single `apiCall` callable */
  private _api<T>(action: string, data: unknown): Promise<T> {
    const callable = httpsCallable(this._functions, 'apiCall');
    return callable({ action, data }).then((res: any) => res.data as T);
  }

  // --- CRUD operations map 1:1 to backend actions ---

  async create(input: CreateMeetingInput): Promise<{ id: string }> {
    return this._api('createMeeting', input);
  }

  async get(organizationId: string, groupId: string, meetingId: string) {
    return this._api('getMeeting', { organizationId, groupId, meetingId });
  }

  async update(input: UpdateMeetingInput): Promise<{ success: boolean }> {
    return this._api('updateMeeting', input);
  }

  async delete(input: DeleteMeetingInput): Promise<{ success: boolean }> {
    return this._api('deleteMeeting', input);
  }
}
