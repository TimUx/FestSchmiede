import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('../config/database', () => ({
  prisma: {
    platformUserSession: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

import { prisma } from '../config/database';
import { platformSessionService } from './platformSessionService';

describe('platformSessionService refresh-token families', () => {
  beforeEach(() => vi.clearAllMocks());

  it('revokes the entire platform family when a rotated token is replayed', async () => {
    vi.mocked(prisma.platformUserSession.findUnique).mockResolvedValue({
      id: 'old-session',
      userId: 'platform-user-1',
      familyId: 'family-1',
      refreshTokenHash: 'old-hash',
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: new Date(),
      userAgent: null,
      createdAt: new Date(),
      user: { active: true, id: 'platform-user-1', email: 'admin@example.test', username: null, permissions: [] },
    } as never);

    await expect(platformSessionService.refreshSession('replayed-token')).rejects.toMatchObject({ statusCode: 401 });
    expect(prisma.platformUserSession.updateMany).toHaveBeenCalledWith({
      where: { familyId: 'family-1', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
  });
});
