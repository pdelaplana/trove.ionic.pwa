import { getLoyaltyCardByMembershipNo, getLoyaltyProgramById } from './helpers';
import { useQuery } from '@tanstack/react-query';

const useFetchAvailableRewardsForCard = (membershipNo: string) => {
  return useQuery({
    queryKey: ['useFetchAvailableRewardsForCard', membershipNo],
    queryFn: async () => {
      if (!membershipNo) {
        return null;
      }

      const loyaltyCard = await getLoyaltyCardByMembershipNo(membershipNo);
      if (!loyaltyCard) {
        return null;
      }

      const loyaltyProgram = await getLoyaltyProgramById(
        loyaltyCard.loyaltyProgramId,
        loyaltyCard.businessId
      );

      const rewards = loyaltyProgram.milestones
        .filter((m) => {
          if (loyaltyCard.tierId) {
            return (
              m.points <= loyaltyCard.points &&
              (m.tierId === loyaltyCard.tierId || !m.tierId)
            );
          }

          return m.points <= loyaltyCard.points && !m.tierId;
        })
        .map((m) => ({
          ...m,

          reward: {
            ...m.reward,
            validUntilDate: m.reward.validUntilDate
              ? (m.reward.validUntilDate as any).toDate()
              : null,
          },
        }));

      return rewards;
    },
  });
};

export default useFetchAvailableRewardsForCard;
