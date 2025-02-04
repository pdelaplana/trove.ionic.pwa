import { LoyaltyProgramMilestone } from '@src/domain';

export const toLoyaltyProgramMilestone = (id: string, data: any) => ({
  ...data,
  id: id,
  reward: {
    ...data.reward,
    validUntilDate: data.reward.validUntilDate
      ? data.reward.validUntilDate.toDate()
      : null,
  } as LoyaltyProgramMilestone,
});
