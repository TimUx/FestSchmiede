import { prisma } from '../../config/database';
import { clubRepository } from '../../repositories/clubRepository';
import { TenantRepository } from '../../repositories/tenantRepository';
import { mapClubSettingsToTenantInput } from '../../platform/tenant/TenantService';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000010';

export async function ensureDefaultTenant(): Promise<void> {
  const repository = new TenantRepository();
  const existing = await repository.findBySlug('default');
  if (existing) {
    await repository.ensureSettings(existing.id);
    return;
  }

  const club = await clubRepository.get();
  const input = mapClubSettingsToTenantInput(club);

  await (prisma as unknown as { tenant: { upsert: (args: unknown) => Promise<unknown> } }).tenant.upsert({
    where: { slug: 'default' },
    update: {
      name: input.name,
      shortName: input.shortName ?? input.name,
      contactName: input.contactName ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      description: input.description ?? null,
      address: input.address ?? null,
      website: input.website ?? null,
      logoUrl: input.logoUrl ?? null,
      status: 'ACTIVE',
      activatedAt: new Date(),
    },
    create: {
      id: DEFAULT_TENANT_ID,
      name: input.name,
      shortName: input.shortName ?? input.name,
      slug: 'default',
      subdomain: 'default',
      status: 'ACTIVE',
      contactName: input.contactName ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      description: input.description ?? null,
      address: input.address ?? null,
      website: input.website ?? null,
      logoUrl: input.logoUrl ?? null,
      locale: 'de-DE',
      timezone: 'Europe/Berlin',
      currency: 'EUR',
      theme: 'default',
      activatedAt: new Date(),
      settings: {
        create: {
          orderFieldFirstNameRequired: club.orderFieldFirstNameRequired,
          orderFieldLastNameRequired: club.orderFieldLastNameRequired,
          orderFieldEmailRequired: club.orderFieldEmailRequired,
          orderFieldPhoneRequired: club.orderFieldPhoneRequired,
          cancellationDeadlineHours: club.cancellationDeadlineHours,
          dataRetentionDays: club.dataRetentionDays,
        },
      },
    },
  });
}
