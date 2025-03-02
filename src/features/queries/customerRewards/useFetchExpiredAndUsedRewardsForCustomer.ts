import { toCustomerReward } from '@src/features/mappers/toCustomerReward';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useQuery } from '@tanstack/react-query';
import {
  collectionGroup,
  Timestamp,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  or,
  and,
  limit,
} from 'firebase/firestore';
import { getBusinessRef } from '../helpers';

const useFetchExpiredAndUsedRewardsForCustomer = (customerId: string) => {
  return useQuery({
    queryKey: ['useFetchExpiredAndUsedRewardsForCustomer', customerId],
    queryFn: async () => {
      if (!customerId) {
        return null;
      }

      try {
        const customerRewardsRef = collectionGroup(db, 'customerRewards');

        const now = Timestamp.now();
        const customerRewardsQueryRef = query(
          customerRewardsRef,
          and(
            where('customerId', '==', customerId),
            or(where('redeemedDate', '!=', null), where('expiryDate', '<', now))
          ),
          orderBy('expiryDate', 'asc'),
          limit(10)
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
        console.error(
          `Error fetching expired and used rewards for customer: ${error}`
        );
        throw new Error(
          `Error fetching expired and used rewards for customer: ${error}`
        );
      }
    },
  });
};

export default useFetchExpiredAndUsedRewardsForCustomer;
