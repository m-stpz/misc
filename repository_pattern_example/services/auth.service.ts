// ============================================================
// AUTH SERVICE — Server-side authentication & authorization
// ============================================================
// NEVER trust the client. ALWAYS validate tokens and roles server-side.
// This service wraps Firebase Auth and custom claims checks.

import { ID } from '../models/base.model';
import { unauthenticated, permissionDenied } from '../utils/errors';

/** Simplified representation of a Firebase callable request context */
export interface CallableContext {
  auth?: {
    uid: string;
    token: {
      organization?: string;
      roles?: string[];
      [key: string]: unknown;
    };
  };
}

/** Group roles in the system */
export enum GroupRole {
  ADMIN = 'admin',
  ASSISTANT = 'assistant',
  DECIDER = 'decider',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export class AuthService {
  private _context: CallableContext;

  constructor(context: CallableContext) {
    this._context = context;
  }

  // --- Authentication (WHO are you?) ---

  /** Verify the caller is authenticated and has valid claims */
  async isAuthenticated(): Promise<boolean> {
    return !!this._context.auth?.uid && !!this._context.auth?.token?.organization;
  }

  /** Get the authenticated user's ID — throws if not authenticated */
  getUserId(): ID {
    if (!this._context.auth?.uid) throw unauthenticated();
    return this._context.auth.uid;
  }

  /** Get the user's organization from custom claims */
  getOrganizationId(): ID {
    if (!this._context.auth?.token?.organization) throw unauthenticated();
    return this._context.auth.token.organization;
  }

  // --- Authorization (WHAT can you do?) ---

  /** Check if user is an organization-level admin */
  async isOrgAdmin(organizationId: ID): Promise<boolean> {
    // In production: query Firestore for the user's org-level role
    return this._context.auth?.token?.roles?.includes('org-admin') ?? false;
  }

  /** Check if user is a group admin */
  async isGroupAdmin(organizationId: ID, groupId: ID): Promise<boolean> {
    // In production: query the group's member list for admin role
    return this.hasGroupRole(organizationId, groupId, GroupRole.ADMIN);
  }

  /** Check if user has a specific role in a group */
  async hasGroupRole(organizationId: ID, groupId: ID, role: GroupRole): Promise<boolean> {
    // In production: look up the group member document
    // Simplified for template — real impl queries Firestore
    return false;
  }

  /** Check if user has ANY of the specified roles in a group */
  async hasAnyGroupRole(organizationId: ID, groupId: ID, roles: GroupRole[]): Promise<boolean> {
    for (const role of roles) {
      if (await this.hasGroupRole(organizationId, groupId, role)) return true;
    }
    return false;
  }

  // --- Convenience error getters ---

  get errorPermissionDenied() {
    return permissionDenied();
  }

  get errorUnauthenticated() {
    return unauthenticated();
  }
}
