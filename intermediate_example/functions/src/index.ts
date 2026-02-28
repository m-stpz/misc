import { onCall, HttpsError } from "firebase-functions/v2/https";
import { CloudFunctionsMap } from "../../shared/models";

// functions
export const updateDisplayName = onCall<
  CloudFunctionsMap["updateDisplayName"]["req"]
>((request) => {
  const name = request.data.newName;

  if (name.length < 3) {
    throw new HttpsError("invalid-argument", "name too short");
  }

  // logic to update db...

  return {
    success: true,
    updatedAt: new Date().toISOString(),
  };
});

export const getUserStats = onCall<CloudFunctionsMap["getUserStats"]["req"]>(
  (request) => {
    return {
      loginCount: 42,
      lastActive: Date.now(),
    };
  },
);
