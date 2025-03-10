import { toCustomerReward } from '@src/features/mappers/toCustomerReward';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useQuery } from '@tanstack/react-query';
import {
  collectionGroup,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  getDoc,
  doc,
} from 'firebase/firestore';
import { getBusinessRef } from '../helpers';

const useFetchRewardsClaimedByCustomer = (customerId: string) => {
  return useQuery({
    queryKey: ['useFetchRewardsClaimedByCustomer', customerId],
    queryFn: async () => {
      if (!customerId) {
        return null;
      }

      try {
        const customerRewardsRef = collectionGroup(db, 'customerRewards');

        const now = Timestamp.now();
        const customerRewardsQueryRef = query(
          customerRewardsRef,
          where('customerId', '==', customerId),
          where('redeemedDate', '==', null),
          where('expiryDate', '>=', now),
          orderBy('expiryDate', 'asc')
        );
        const customerRewardsQuerySnapshot = await getDocs(
          customerRewardsQueryRef
        );

        if (customerRewardsQuerySnapshot.empty) {
          return null;
        }

        const customerRewardsWithBusinessName = await Promise.all(
          customerRewardsQuerySnapshot.docs.map(async (doc) => {
            const customerReward = toCustomerReward(doc.id, doc.data());

            const businessId = customerReward.businessId;
            const businessDoc = await getDoc(getBusinessRef(businessId));
            return {
              ...toCustomerReward(doc.id, doc.data()),
              businessName: businessDoc?.data()?.name ?? '',
            };
          })
        );

        return customerRewardsWithBusinessName;
      } catch (error) {
        console.error(`Error fetching rewards claimed by customer: ${error}`);
        throw new Error(`Error fetching rewards claimed by customer: ${error}`);
      }
    },
  });
};

export default useFetchRewardsClaimedByCustomer;
