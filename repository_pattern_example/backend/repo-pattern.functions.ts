import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { UserRepository } from "./user.repository";

const db = getFirestore();
const userRepo = new UserRepository(db); // instantiate the repo

export const updateDisplayName = onCall(async (request) => {
  const name = request.data.newName;
  const uid = request.auth?.uid; // auth context is automatic in `onCall`

  if (!uid) {
    throw new HttpsError("unauthenticated", "must be logged in");
  }

  if (name.length < 3) {
    throw new HttpsError("invalid-argument", "name too short");
  }

  try {
    // use the repo instead of db.collection("users").doc(uid)
    await userRepo.updateProfile(uid, { displayName: name });

    return {
      success: true,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    throw new HttpsError("internal", "failed to update db");
  }
});

export const getUserStats = onCall(async (request) => {
  try {
    const user = await userRepo.getById(request.data.userId);

    return {
      loginCount: user?.loginCount ?? 0,
      lastActive: user?.lastActive ?? Date.now(),
    };
  } catch (error) {
    throw new HttpsError("not found", "stats not found");
  }
});
