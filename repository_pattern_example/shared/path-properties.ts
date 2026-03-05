export type ID = string;
export interface BasePathProperties {}

/**
 * Users: root collection
 * path: /users/{userId}
 */
export type UserPathProperties = BasePathProperties;

/**
 * Boards: nested under organizations
 * path: /organizations/{orgId}/boards/{boardId}
 */
export type BoardPathProperties = BasePathProperties & {
  organization: ID;
};

/**
 * Meetings: nested under boards
 * path: /organizations/{orgId}/boards/{boardId}/meetings/{meetingId}
 */
export type MeetingPathProperties = BasePathProperties & {
  organization: ID;
  board: ID;
};

/**
 * - path factory
 * - standardizes how repos resolve where the data lives in the db
 *
 * - abstract class since it shouldn't be instantiated on its own
 * - exists only to be extends by specific paths like `UserPath` or `BoardPath`
 */
export abstract class BasePath<P> {
  constructor(protected props: P) {}

  /**
   * every child must implement this getter to define its specific firestore collection location
   */
  abstract get collectionPath(): string;

  docPath(id: string) {
    return `${this.collectionPath}/${id}`;
  }
}

// == URL BUILDERS ==
export class UserPath extends BasePath<UserPathProperties> {
  get collectionPath() {
    return "users";
  }
}

export class BoardPath extends BasePath<BoardPathProperties> {
  get collectionPath() {
    return `organizations/${this.props.organization}/boards`;
  }
}

export class MeetingPath extends BasePath<MeetingPathProperties> {
  get collectionPath() {
    const props = this.props;
    return `organizations/${props.organization}/boards/${props.board}/meetings`;
  }
}
