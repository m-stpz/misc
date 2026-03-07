/**
 * ===
 * Meeting model: concrete firestore document model
 * ===
 * Shows: model interface, path properties, path class, and ACL structure
 */

import { BasePath, BasePathProperties, ID, ModelInterface } from "./base.model";

/**
 * ACL: Access control list: maps identity keys to permission arrays
 */
export interface ACL {
  [identityKey: string]: ("read" | "write" | "share" | "delete")[];
}

/**
 * the model
 */
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
  /**
   * Document-level access control
   */
  acl: ACL;
}

/**
 * path properties: what you need to locate this collection
 */
export interface MeetingPathProperties extends BasePathProperties {
  organization: ID;
  group: ID;
  [key: string]: any;
}

/**
 * path class: maps properties to the actual firestore path
 */
export class MeetingPath extends BasePath<MeetingPathProperties> {
  get collectionPath() {
    return `organizations/${this.props.organization}/groups/${this.props.group}/meetings`;
  }
}
