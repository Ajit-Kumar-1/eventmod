import { describe, expect, it } from 'vitest';
import { claimedByMe, claimValid } from '../Utils.ts';
import { Status, type Event } from '../Types.ts';

const buildEvent = (overrides: Partial<Event> = {}): Event => ({
  eventId: 1,
  region: 'eu',
  status: Status.CLAIMED,
  claimedAt: new Date(),
  claimedBy: 'eu_mod_1',
  ...overrides,
});

describe('Utils', () => {
  describe('claimValid', () => {
    it('returns false when claimedAt is null', () => {
      const event = buildEvent({ claimedAt: null });
      expect(claimValid(event)).toBe(false);
    });

    it('returns true when claim is within 15 minutes', () => {
      const event = buildEvent({
        claimedAt: new Date(Date.now() - 5 * 60 * 1000),
      });
      expect(claimValid(event)).toBe(true);
    });

    it('returns false when claim is older than 15 minutes', () => {
      const event = buildEvent({
        claimedAt: new Date(Date.now() - 16 * 60 * 1000),
      });
      expect(claimValid(event)).toBe(false);
    });
  });

  describe('claimedByMe', () => {
    it('returns true for active claim by same user', () => {
      const event = buildEvent({
        claimedAt: new Date(Date.now() - 2 * 60 * 1000),
        claimedBy: 'eu_mod_1',
      });

      expect(claimedByMe(event, 'eu_mod_1')).toBe(true);
    });

    it('returns false for active claim by another user', () => {
      const event = buildEvent({
        claimedAt: new Date(Date.now() - 2 * 60 * 1000),
        claimedBy: 'eu_mod_2',
      });

      expect(claimedByMe(event, 'eu_mod_1')).toBe(false);
    });

    it('returns false when claim is expired', () => {
      const event = buildEvent({
        claimedAt: new Date(Date.now() - 20 * 60 * 1000),
        claimedBy: 'eu_mod_1',
      });

      expect(claimedByMe(event, 'eu_mod_1')).toBe(false);
    });
  });
});
