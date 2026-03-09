/**
 * ===
 * Meeting repository - Concrete repo for meeting docs
 * ===
 * This is what a real repo looks like, almost zero code
 * - All logic is inherited from DataRepository
 * - Only add domain-specific query methods if needed
 */

import {
  Meeting,
  MeetingPath,
  MeetingPathProperties,
} from "../models/meeting.model";
import { DataService } from "../services/data.service";
import { DataRepository } from "./data.repository";

export class MeetingRepository extends DataRepository<
  Meeting,
  MeetingPathProperties
> {
  constructor(dataService: DataService) {
    super(Meeting as any, MeetingPath, dataService);
  }

  //  -- Domain-specific queries (optional, only if custom logic is needed)

  /** example: find all meetings created by a specific user */
}
