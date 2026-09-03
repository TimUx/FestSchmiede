import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('../config/database', () => ({
  prisma: {
    userSession: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

import { prisma } from '../config/database';
import { sessionService } from './sessionService';

describe('sessionService refresh-token families', () => {
  beforeEach(() => vi.clearAllMocks());

  it('revokes the entire tenant family when a rotated token is replayed', async () => {
    vi.mocked(prisma.userSession.findUnique).mockResolvedValue({
      id: 'old-session',
      userId: 'user-1',
      familyId: 'family-1',
      refreshTokenHash: 'old-hash',
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: new Date(),
      userAgent: null,
      createdAt: new Date(),
      user: { active: true, tenantId: 'tenant-1', id: 'user-1', email: 'user@example.test', username: null, role: { name: 'STAFF' } },
    } as never);

    await expect(sessionService.refreshSession('replayed-token')).rejects.toMatchObject({ statusCode: 401 });
    expect(prisma.userSession.updateMany).toHaveBeenCalledWith({
      where: { familyId: 'family-1', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
  });
});
