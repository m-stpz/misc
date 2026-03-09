// ============================================================
// MEETING MODEL — A concrete Firestore document model
// ============================================================
// Shows: model interface, path properties, path class, and ACL structure.

import { BasePath, BasePathProperties, ID, ModelInterface } from "./base.model";

/** Access control list — maps identity keys to permission arrays */
export interface ACL {
  [identityKey: string]: ("read" | "write" | "share" | "delete")[];
}

// --- The Model ---
export interface Meeting extends ModelInterface {
  id: ID;
  title: string;
  description: string;
  date: Date;
  organizationId: ID;
  groupId: ID;
  createdBy: ID;
  createdAt: Date;
  updatedAt: Date;
  acl: ACL; // Document-level access control
}

// --- Path Properties (what you need to locate this collection) ---
export interface MeetingPathProperties extends BasePathProperties {
  organization: ID;
  group: ID;
}

// --- Path Class (maps properties to the actual Firestore path) ---
export class MeetingPath extends BasePath<MeetingPathProperties> {
  get collectionPath(): string {
    return `organizations/${this.props.organization}/groups/${this.props.group}/meetings`;
  }
}
