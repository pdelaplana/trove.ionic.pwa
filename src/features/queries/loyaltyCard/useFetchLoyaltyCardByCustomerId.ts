import { LoyaltyCard } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useQuery } from '@tanstack/react-query';
import {
  query,
  where,
  limit,
  getDocs,
  collectionGroup,
} from 'firebase/firestore';

const TRANSACTIONS_PER_PAGE = 20;

const useFetchLoyaltyCardByCustomerId = (customerId: string) => {
  return useQuery({
    queryKey: ['useFetchLoyaltyCardByCustomerId', customerId],
    queryFn: async () => {
      try {
        const loyaltyCardRef = collectionGroup(db, 'loyaltyCards');
        let q = query(
          loyaltyCardRef,
          where('customerId', '==', customerId),
          limit(TRANSACTIONS_PER_PAGE)
        );

        let snapshot = await getDocs(q);

        const cards = snapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
              membershipDate: doc.data().membershipDate.toDate(),
            }) as LoyaltyCard
        );

        return {
          cards: cards,
        };
      } catch (error) {
        console.error('Error fetching loyalty card', error);
        throw error;
      }
    },
  });
};
export default useFetchLoyaltyCardByCustomerId;
