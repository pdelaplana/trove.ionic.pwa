import { Customer, LoyaltyCard } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getDocs,
  query,
  limit,
  orderBy,
  startAfter,
  getDoc,
  doc,
  where,
} from 'firebase/firestore';
import { getLoyaltyCardsSubcollectionRef } from '../helpers';

const CARDS_PER_PAGE = 20;

export type LoyaltyCardPage = {
  cards: Array<LoyaltyCard & Customer>;
  lastVisible: any;
};

const useFetchLoyaltyCardsByBusinessId = (
  businessId: string,
  search?: string
) => {
  return useInfiniteQuery<LoyaltyCardPage>({
    queryKey: ['useFetchLoyaltyCardsByBusinessId', businessId, search],
    initialPageParam: null,
    queryFn: async ({ pageParam = null }) => {
      try {
        const cardsRef = getLoyaltyCardsSubcollectionRef(businessId);

        let q = query(
          cardsRef,
          orderBy('membershipDate', 'desc'),
          limit(CARDS_PER_PAGE)
        );

        if (search) {
          q = query(
            q,
            where(
              'keywords',
              'array-contains-any',
              search.toLowerCase().split(' ')
            )
          );
        }

        if (pageParam) {
          q = query(q, startAfter(pageParam));
        }
        const snapshot = await getDocs(q);

        // Fetch customer data for each card
        const cardsWithCustomers = await Promise.all(
          snapshot.docs.map(async (loyaltyCardDoc) => {
            const card = {
              ...loyaltyCardDoc.data(),
              id: loyaltyCardDoc.id,
            } as LoyaltyCard;
            const customerDoc = await getDoc(
              doc(db, 'customers', card.customerId)
            );
            const customer = {
              ...customerDoc.data(),
            } as Omit<Customer, 'id'>;

            return {
              ...customer,
              ...card,
            };
          })
        );

        const lastVisible = snapshot.docs[snapshot.docs.length - 1];

        return {
          cards: cardsWithCustomers,
          lastVisible,
        };
      } catch (error) {
        console.error('Error fetching loyalty cards', error);
        return {
          cards: [],
          lastVisible: null,
        };
      }
    },

    getNextPageParam: (lastPage: LoyaltyCardPage) =>
      lastPage.lastVisible ?? undefined,
  });
};

export default useFetchLoyaltyCardsByBusinessId;
