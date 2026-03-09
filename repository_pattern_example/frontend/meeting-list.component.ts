// ============================================================
// MEETING LIST COMPONENT (Frontend / Angular)
// ============================================================
// Demonstrates: signals, inject(), OnPush, native control flow,
// and calling the service layer (not Firestore directly).

import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  input,
} from '@angular/core';
import { MeetingFrontendService } from './meeting.service';

interface MeetingView {
  id: string;
  title: string;
  date: string;
}

@Component({
  selector: 'app-meeting-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 i18n="@@meetingListTitle">Meetings</h2>

    @if (loading()) {
      <p>Loading...</p>
    }

    @if (meetings().length === 0 && !loading()) {
      <p i18n="@@meetingListEmpty">No meetings found.</p>
    }

    <ul>
      @for (meeting of meetings(); track meeting.id) {
        <li>
          <strong>{{ meeting.title }}</strong>
          <span>{{ meeting.date }}</span>
          <button (click)="onDelete(meeting.id)" i18n="@@meetingDeleteBtn">Delete</button>
        </li>
      }
    </ul>

    <button (click)="onCreate()" i18n="@@meetingCreateBtn">New Meeting</button>
  `,
})
export class MeetingListComponent {
  // --- Inputs (from parent or route) ---
  organizationId = input.required<string>();
  groupId = input.required<string>();

  // --- Injected services ---
  private _meetingService = inject(MeetingFrontendService);

  // --- State (signals, not BehaviorSubject) ---
  meetings = signal<MeetingView[]>([]);
  loading = signal(false);

  // --- Derived state ---
  meetingCount = computed(() => this.meetings().length);

  // --- Actions ---

  async loadMeetings(): Promise<void> {
    this.loading.set(true);
    try {
      // In a real app, this might use a Firestore observable for real-time updates
      // For writes/mutations, always go through the service → callable function
      const result = await this._meetingService.get(
        this.organizationId(),
        this.groupId(),
        '', // would be a specific ID or a list endpoint
      );
      // this.meetings.set(result);
    } finally {
      this.loading.set(false);
    }
  }

  async onCreate(): Promise<void> {
    // In a real app, open a dialog/form first
    await this._meetingService.create({
      organizationId: this.organizationId(),
      groupId: this.groupId(),
      title: 'New Meeting',
      description: '',
      date: new Date().toISOString(),
    });
    await this.loadMeetings();
  }

  async onDelete(meetingId: string): Promise<void> {
    await this._meetingService.delete({
      organizationId: this.organizationId(),
      groupId: this.groupId(),
      meetingId,
    });
    // Optimistic update — remove from local state immediately
    this.meetings.update((list) => list.filter((m) => m.id !== meetingId));
  }
}
