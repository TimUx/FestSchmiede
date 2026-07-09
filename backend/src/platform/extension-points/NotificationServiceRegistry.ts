import type { NotificationService } from './NotificationService';

class NotificationServiceRegistryImpl {
  private service: NotificationService | null = null;

  register(service: NotificationService): void {
    this.service = service;
  }

  unregister(): void {
    this.service = null;
  }

  getService(): NotificationService | null {
    return this.service;
  }

  async isAvailable(): Promise<boolean> {
    if (!this.service) return false;
    return this.service.isAvailable();
  }
}

export const notificationServiceRegistry = new NotificationServiceRegistryImpl();
