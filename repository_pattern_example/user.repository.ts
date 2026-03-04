import { UserProfile } from "./models";
import { DataRepository } from "./data-repository";
import { UserPath, UserPathProperties } from "./path-properties";

/**
 * Since we extend the DataRepository, it only focuses on user-specific logic
 * CRUD boilerplate is handled by the parent class
 */
export class UserRepository extends DataRepository<
  UserProfile,
  UserPathProperties
> {
  constructor() {
    // Model class, Path class, and the shared API service
    super(UserProfile, UserPath);
  }

  streamProfile(uid: string) {
    return this.watch(uid, {});
  }

  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const timedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // the .update from `DataRepository` base class
    return this.update(uid, timedData, {});
  }

  async setupProfile(uid: string, profile: Partial<UserProfile>) {
    return this.save(
      uid,
      {
        ...profile,
        loginCount: 0,
      },
      {},
    );
  }

  async recordLogin(uid: string) {
    return this.update(
      uid,
      {
        loginCount: this.atomic.increment(1),
      },
      {},
    );
  }
}
