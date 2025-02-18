import { useQuery } from '@tanstack/react-query';
import {
  getCustomerRewardsSubcollectionRef,
  getLoyaltyCardByMembershipNo,
} from '../helpers';
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { toCustomerReward } from '@src/features/mappers/toCustomerReward';

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

        const customerRewardsSubcollectionRef =
          getCustomerRewardsSubcollectionRef(
            loyaltyCard.businessId,
            loyaltyCard.id
          );

        const now = new Date();
        const querySnapshot = await getDocs(
          query(
            customerRewardsSubcollectionRef,
            where('expiryDate', '>=', now),
            orderBy('expiryDate', 'desc')
          )
        );

        return querySnapshot.docs.map((doc) =>
          toCustomerReward(doc.id, doc.data())
        );
      } catch (error) {
        console.error(`Failed to fetch customer rewards: ${error}`);
        throw new Error(`Failed to fetch custopmer rewards: ${error}`);
      }
    },
  });
};

export default useFetchRewardsClaimedForLoyaltyCard;
