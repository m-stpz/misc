import { ApiService } from "../api.service";

// @Component({...})
export class ProfileComponent {
  private api = inject(ApiService); // grabs our wrapper
  userStats = signal<UserStats>(null);

  async changeName() {
    const response = await this.api.call("updateDisplayName", {
      newName: "...",
    });

    if (response.sucess) {
      console.log(response.updatedAt);
    }
  }

  async loadStats(id: string) {
    const stats = await this.api.call("getUserStats", { userId: id });
    this.userStats.stats(stats);
  }
}
