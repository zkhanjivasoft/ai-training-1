import type { ActivityAction, ActivityEntityType, ActivityEntry } from '@taskboard/shared';
import { newId } from '../lib/ids';
import { activityRepository } from '../repositories/activity.repository';

export const activityService = {
  list(options: { entityId?: string; limit: number }): ActivityEntry[] {
    const entries = options.entityId
      ? activityRepository.findByEntityId(options.entityId)
      : activityRepository.findAll();
    return entries.toSorted((a, b) => b.at.localeCompare(a.at)).slice(0, options.limit);
  },

  record(
    entityType: ActivityEntityType,
    entityId: string,
    entityTitle: string,
    action: ActivityAction,
  ): ActivityEntry {
    return activityRepository.insert({
      id: newId('act'),
      entityType,
      entityId,
      entityTitle,
      action,
      at: new Date().toISOString(),
    });
  },
};
