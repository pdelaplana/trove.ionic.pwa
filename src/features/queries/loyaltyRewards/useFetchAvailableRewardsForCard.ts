import { getDocs, query, where } from 'firebase/firestore';
import {
  getLoyaltyCardByMembershipNo,
  getLoyaltyMilestoneRewardSubcollectionRef,
} from '../helpers';
import { useQuery } from '@tanstack/react-query';
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
          where('points', '<=', loyaltyCard.points.toString()),
          where('tierId', 'in', [loyaltyCard.tierId, ''])
        );

        const querySnapshot = await getDocs(queryRef);

        return querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              reward: {
                ...doc.data().reward,
                validUntilDate: doc.data().reward.validUntilDate
                  ? (doc.data().reward.validUntilDate as any).toDate()
                  : null,
              },
            }) as LoyaltyProgramMilestone
        );
      } catch (error) {
        console.log(`Failed to fetch rewards: ${error}`);
        throw new Error(`Failed to fetch rewards: ${error}`);
      }
    },
  });
};

export default useFetchAvailableRewardsForCard;
