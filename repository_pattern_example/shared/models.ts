export class UserProfile {
  displayName!: string;
  loginCount?: number;
}

/**
 * using a class, not an interface, nor a type
 */
export class Board {
  id?: string;
  name!: string;
  status!: "active" | "archived";
}

export interface CloudFunctionsMap {
  incrementCounter: {
    req: {
      // some types
    };
    res: {
      // some types
    };
  };
  updateDisplayName: {
    req: {
      // some types
    };
    res: {
      // some types
    };
  };
  getUserStats: {
    req: {
      // some types
    };
    res: {
      // some types
    };
  };
}

export type FunctionName = keyof CloudFunctionsMap;
