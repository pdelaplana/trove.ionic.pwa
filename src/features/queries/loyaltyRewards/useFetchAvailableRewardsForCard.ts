import { getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import {
  getLoyaltyCardByMembershipNo,
  getLoyaltyMilestoneRewardSubcollectionRef,
} from '../helpers';
import { useQuery } from '@tanstack/react-query';
import { toLoyaltyProgramMilestone } from '@src/features/mappers/toLoyaltyProgramMilestone';
import { LoyaltyProgramMilestone } from '@src/domain';

const useFetchAvailableRewardsForCard = (membershipNo: string) => {
  return useQuery({
    queryKey: ['useFetchAvailableRewardsForCard', membershipNo],
    queryFn: async () => {
      try {
        if (!membershipNo) {
          return null;
        }

        const loyaltyCard = await getLoyaltyCardByMembershipNo(membershipNo);
        if (!loyaltyCard) {
          return null;
        }

        const loyaltyRewardMilestonesSubcollectionRef =
          getLoyaltyMilestoneRewardSubcollectionRef(
            loyaltyCard.loyaltyProgramId,
            loyaltyCard.businessId
          );

        const queryRef = query(
          loyaltyRewardMilestonesSubcollectionRef,
          where('reward.validUntilDate', '>=', Timestamp.now()),
          where('points', '<=', loyaltyCard.rewardPoints),
          where('tierId', 'in', [loyaltyCard.tierId, '']),
          orderBy('reward.validUntilDate', 'desc')
        );

        const querySnapshot = await getDocs(queryRef);
        return querySnapshot.docs.map(
          (doc) =>
            ({
              ...toLoyaltyProgramMilestone(doc.id, doc.data()),
              businessName: loyaltyCard.businessName,
              loyaltyCardId: loyaltyCard.id,
            }) as LoyaltyProgramMilestone & {
              businessName: string;
              loyaltyCardId: string;
            }
        );
      } catch (error) {
        console.error(`Failed to fetch rewards: ${error}`);
        throw new Error(`Failed to fetch rewards: ${error}`);
      }
    },
  });
};

export default useFetchAvailableRewardsForCard;
