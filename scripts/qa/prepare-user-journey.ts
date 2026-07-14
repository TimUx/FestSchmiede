/**
 * Bereitet die CI-Umgebung für die realistische Nutzerreise vor
 * (Mandantenbewerbung muss freigeschaltet sein).
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.platformSettings.upsert({
    where: { key: 'platform.registration.enabled' },
    create: { key: 'platform.registration.enabled', value: true, encrypted: false },
    update: { value: true },
  });
  console.log('QA: Mandantenbewerbungen aktiviert (platform.registration.enabled=true)');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
