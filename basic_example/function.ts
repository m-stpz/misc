import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

/**
 * callable function
 * - unlike standard HTTP request, firebase callables automatically
 *  - handle authentication
 *  - JSON parsing
 */
export const incrementCounter = onCall((request) => {
  const currentCount = request.data.currentCount ?? 0;
  const newCount = currentCount + 1;

  logger.log("incrementing count to: ", newCount);

  return {
    total: newCount,
  };
});
