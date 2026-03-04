import { onCall, HttpsError } from "firebase-functions/v2/https";
import { CloudFunctionsMap } from "../../shared/models";
import { getFirestore } from "firebase-admin/firestore"; // Use Admin SDK

const db = getFirestore();

// functions
export const updateDisplayName = onCall<
  CloudFunctionsMap["updateDisplayName"]["req"]
>(async (request) => {
  const name = request.data.newName;
  const uid = request.auth?.uid; // auth context is automatic in `onCall`

  if (!uid) {
    throw new HttpsError("unauthenticated", "must be logged in");
  }

  if (name.length < 3) {
    throw new HttpsError("invalid-argument", "name too short");
  }

  try {
    // direct db logic
    const userRef = db.collection("users").doc(uid);

    await userRef.update({
      displayName: name,
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    throw new HttpsError("internal", "failed to update db");
  }
});

// to continue notes [without repository pattern, then notes with it]
export const getUserStats = onCall<CloudFunctionsMap["getUserStats"]["req"]>(
  async (request) => {
    const userId = request.data.userId;
    const snapshot = await db.collection("users").doc(userId).get();

    if (!snapshot.exists) {
      throw new HttpsError("not-found", "user not found");
    }

    const data = snapshot.data();

    return {
      loginCount: data?.loginCount ?? 0,
      lastActive: data?.lastActive ?? Date.now(),
    };
  },
);
