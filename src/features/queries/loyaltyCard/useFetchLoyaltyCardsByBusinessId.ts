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
} from 'firebase/firestore';
import { getLoyaltyCardsSubcollectionRef } from '../helpers';

const CARDS_PER_PAGE = 20;

export type LoyaltyCardPage = {
  cards: Array<LoyaltyCard & Customer>;
  lastVisible: any;
};

const useFetchLoyaltyCardsByBusinessId = (businessId: string) => {
  return useInfiniteQuery<LoyaltyCardPage>({
    queryKey: ['useFetchLoyaltyCardsByBusinessId', businessId],
    initialPageParam: null,
    queryFn: async ({ pageParam = null }) => {
      const cardsRef = getLoyaltyCardsSubcollectionRef(businessId);

      let q = query(
        cardsRef,
        orderBy('membershipDate', 'desc'),
        limit(CARDS_PER_PAGE)
      );
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
    },

    getNextPageParam: (lastPage: LoyaltyCardPage) =>
      lastPage.lastVisible ?? undefined,
  });
};

export default useFetchLoyaltyCardsByBusinessId;
