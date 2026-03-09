// ============================================================
// ACL UTILITIES — Document-level access control
// ============================================================
// Each document can have an `acl` object that maps identity keys
// to permission arrays. Identity key format:
//
//   u-{userId}    → direct user access
//   g-{groupId}   → info group access
//   b-{boardId}   → board-level access
//
// Permissions: 'read' | 'write' | 'share' | 'delete'

import { ACL } from '../models/meeting.model';
import { ID } from '../models/base.model';

export type Permission = 'read' | 'write' | 'share' | 'delete';

/** Check if a user has a specific permission on a document */
export function hasPermission(acl: ACL, userId: ID, permission: Permission): boolean {
  const userKey = `u-${userId}`;
  return acl[userKey]?.includes(permission) ?? false;
}

/** Check if any of the user's group memberships grant a permission */
export function hasGroupPermission(
  acl: ACL,
  groupIds: ID[],
  permission: Permission,
): boolean {
  return groupIds.some((gid) => {
    const groupKey = `g-${gid}`;
    return acl[groupKey]?.includes(permission) ?? false;
  });
}

/** Build an ACL entry granting the creator full permissions */
export function buildCreatorACL(userId: ID): ACL {
  return {
    [`u-${userId}`]: ['read', 'write', 'share', 'delete'],
  };
}

/** Grant read access to an entire group */
export function grantGroupRead(acl: ACL, groupId: ID): ACL {
  return {
    ...acl,
    [`g-${groupId}`]: ['read'],
  };
}
