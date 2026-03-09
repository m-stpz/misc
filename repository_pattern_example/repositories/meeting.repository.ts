// ============================================================
// MEETING REPOSITORY — Concrete repository for Meeting documents
// ============================================================
// This is what a real repository looks like — almost zero code.
// All the logic is inherited from DataRepository.
// Only add domain-specific query methods if needed.

import { DataRepository } from './data.repository';
import { Meeting, MeetingPath, MeetingPathProperties } from '../models/meeting.model';
import { DataService } from '../services/data.service';

export class MeetingRepository extends DataRepository<Meeting, MeetingPathProperties> {
  constructor(dataService: DataService) {
    super(Meeting as any, MeetingPath, dataService);
  }

  // --- Domain-specific queries (optional, only if you need custom logic) ---

  /** Example: find all meetings created by a specific user */
  async findByCreator(props: MeetingPathProperties, userId: string): Promise<Meeting[]> {
    return this.find(props, (ref) => ({
      ...ref,
      where: ['createdBy', '==', userId],
    }));
  }
}
