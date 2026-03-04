import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { UserRepository } from "./user.repository";

const db = getFirestore();
const userRepo = new UserRepository(UserRepository); // instantiate the repo

export const updateDisplayName = 