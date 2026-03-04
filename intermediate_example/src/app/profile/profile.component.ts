import { ApiService } from "../api.service";

// @Component({...})
export class ProfileComponent {
  private api = inject(ApiService); // grabs our wrapper
  userStats = signal<UserStats>(null);

  async changeName() {
    try {
      const response = await this.api.call("updateDisplayName", {
        newName: "...",
      });

      console.log(response.updatedAt);
    } catch (error) {
      console.error("Cloud function error:", err);
    }
  }

  async loadStats(id: string) {
    const stats = await this.api.call("getUserStats", { userId: id });
    this.userStats.stats(stats);
  }
}
