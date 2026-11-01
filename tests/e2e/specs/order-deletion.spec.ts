import { test, expect } from '@playwright/test';

for (const role of ['ADMIN', 'STAFF'] as const) {
  test(`Bestellungen endgültig löschen: ${role}`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('verein_token', 'ui-test-token'));
    const order = {
      id: '00000000-0000-4000-8000-000000000001', orderNumber: 42, displayNumber: '042',
      orderDate: '2030-07-01', source: 'ONLINE', sourceLabel: 'Online',
      status: 'CANCELLED', statusLabel: 'Storniert', totalPrice: 5, createdAt: '2030-07-01T10:00:00Z',
      customer: { firstName: 'Test', lastName: 'Bestellung' },
      items: [{ id: 'item', foodItemId: 'food', name: 'Testgericht', quantity: 1, unitPrice: 5, lineTotal: 5 }],
    };
    const event = {
      id: 'event-test', name: 'Testveranstaltung', date: '2030-07-01',
      startTime: '10:00', endTime: '22:00', isActive: true,
      cashierActive: true, onlineOrdersActive: true, ordersClosed: false,
    };
    let orders = [order];
    let deleteRequests = 0;
    await page.route('**/api/**', async (route) => {
      const path = new URL(route.request().url()).pathname;
      if (route.request().method() === 'DELETE' && path === `/api/staff/orders/${order.id}`) {
        deleteRequests++;
        if (deleteRequests === 1) {
          await route.fulfill({ status: 500, json: { error: 'Test: Löschen fehlgeschlagen' } });
        } else {
          orders = [];
          await route.fulfill({ status: 204 });
        }
        return;
      }
      let data: unknown;
      switch (path) {
        case '/api/public/routing-config':
          data = { scope: 'tenant', basename: '', apiBasePath: '/api', tenantSlug: null };
          break;
        case '/api/auth/me':
          data = {
            id: 'user-test', firstName: 'Test', lastName: role, role,
            permissions: ['orders.view', 'orders.manage'],
          };
          break;
        case '/api/public/tenant':
          data = { id: 'tenant-test', name: 'Testverein', slug: 'test', status: 'ACTIVE' };
          break;
        case '/api/public/club':
          data = { clubName: 'Testverein' };
          break;
        case '/api/public/platform':
          data = {};
          break;
        case '/api/staff/events':
          data = [event];
          break;
        case '/api/staff/events/event-test/orders':
          data = orders;
          break;
        case '/api/realtime/events/event-test/orders':
          data = { changed: true, etag: String(deleteRequests), data: orders };
          break;
        default:
          await route.fulfill({ status: 404, json: { error: `Unmocked endpoint: ${path}` } });
          return;
      }
      await route.fulfill({ json: data });
    });

    await page.goto('/service/bestellungen');
    await expect(page.getByText('#042', { exact: true })).toBeVisible();
    const deleteButton = page.getByRole('button', { name: 'Endgültig löschen', exact: true });
    if (role === 'STAFF') {
      await expect(deleteButton).toHaveCount(0);
      expect(deleteRequests).toBe(0);
      return;
    }

    await deleteButton.click();
    const dialog = page.getByRole('dialog');
    const confirmButton = dialog.getByRole('button', { name: 'Endgültig löschen', exact: true });
    await expect(confirmButton).toBeDisabled();
    await expect(dialog.getByText(/Zahlungsnachweise bleiben erhalten/)).toBeVisible();
    await dialog.getByRole('button', { name: 'Abbrechen' }).click();
    await expect(dialog).toHaveCount(0);
    expect(deleteRequests).toBe(0);

    await deleteButton.click();
    const confirmation = dialog.getByRole('textbox');
    await confirmation.fill('999');
    await expect(confirmButton).toBeDisabled();
    await confirmation.fill('042');
    await confirmButton.click();
    await expect(dialog.getByText('Test: Löschen fehlgeschlagen')).toBeVisible();
    await expect(page.getByText('#042', { exact: true })).toBeVisible();
    await confirmButton.click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText('#042', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Keine Bestellungen für diese Veranstaltung')).toBeVisible();
    expect(deleteRequests).toBe(2);
  });
}
