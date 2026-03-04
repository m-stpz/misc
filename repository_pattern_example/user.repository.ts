import { FireStore, doc, updateDoc, getDoc } from "firebase-admin/firestore";
import { UserProfile } from "./models.shared";

/**
 * communicates with the db
 */
export class UserRepository {
  private collectionPath = "users";

  constructor(private db: FirebaseFirestore.Firestore) {}

  /**
   * encapsulate update logic
   */
  async updateProfile(uid: string, data: Partial<UserProfile>) {
    const userRef = this.db.collection(this.collectionPath).doc(uid);

    return userRef.update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * encapsulate read logic
   */
  async getById(uid: string): Promise<UserProfile> {
    const snap = this.db.collection(this.collectionPath).doc(uid).get();

    if (!snap.exists) {
      throw new Error("user not found");
    }

    return snap.data() as UserProfile;
  }
}
