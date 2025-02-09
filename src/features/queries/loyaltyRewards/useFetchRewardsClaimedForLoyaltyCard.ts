import { useQuery } from '@tanstack/react-query';
import {
  getLoyaltyCardByMembershipNo,
  getLoyaltyCardsSubcollectionRef,
  getLoyaltyMilestoneRewardSubcollectionRef,
} from '../helpers';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { collection, doc, getDocs, orderBy, query } from 'firebase/firestore';

const useFetchRewardsClaimedForLoyaltyCard = (membershipNumber: string) => {
  return useQuery({
    queryKey: ['useFetchRewardsClaimedForLoyaltyCard', membershipNumber],
    queryFn: async () => {
      try {
        if (!membershipNumber) {
          return null;
        }

        const loyaltyCard =
          await getLoyaltyCardByMembershipNo(membershipNumber);
        if (!loyaltyCard) {
          return null;
        }

        const customerRewardsRef = collection(
          db,
          `businesses\\${loyaltyCard.businessId}\\loyaltycards\\${loyaltyCard.id}\\customerRewards`
        );

        const querySnapshot = await query(
          customerRewardsRef,
          orderBy('validityDate', 'desc')
        );
      } catch (error) {
        console.log(`Failed to fetch rewards: ${error}`);
        throw new Error(`Failed to fetch rewards: ${error}`);
      }
    },
  });
};

export default useFetchRewardsClaimedForLoyaltyCard;
