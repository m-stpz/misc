/* 

== the shared contract ==
- lives outside both functions and src folders
- usually in a root shared directory, so both can import it
 */

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
