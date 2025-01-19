import { LoyaltyCard, Customer, LoyaltyCardTransaction } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { getLoyaltyCardTransactionsSubcollectionRef } from '../helpers';

const TRANSACTIONS_PER_PAGE = 20;

export type LoyaltyCardPage = {
  cards: Array<LoyaltyCard>;
  lastVisible: any;
};

const useFetchLoyaltyCardTransactionsByCustomerId = (
  customerId: string,
  businessId: string
) => {
  return useInfiniteQuery<{
    transactions: Array<LoyaltyCardTransaction>;
    lastVisible: any;
  }>({
    queryKey: ['useFetchLoyaltyCardTransactionsByCustomerId', customerId],
    initialPageParam: null,
    queryFn: async ({ pageParam = null }) => {
      const transactionsRef =
        getLoyaltyCardTransactionsSubcollectionRef(businessId);
      let q = query(
        transactionsRef,
        where('customerId', '==', customerId),
        orderBy('transactionDate', 'desc'),
        limit(TRANSACTIONS_PER_PAGE)
      );
      if (pageParam) {
        q = query(q, startAfter(pageParam));
      }
      const snapshot = await getDocs(q);
      const transactions = snapshot.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            transactionDate: doc.data().transactionDate.toDate(),
            id: doc.id,
          }) as LoyaltyCardTransaction
      );

      const lastVisible = snapshot.docs[snapshot.docs.length - 1];

      return {
        transactions,
        lastVisible,
      };
    },

    getNextPageParam: (lastPage: {
      transactions: Array<LoyaltyCardTransaction>;
      lastVisible: any;
    }) => lastPage.lastVisible ?? undefined,
  });
};
export default useFetchLoyaltyCardTransactionsByCustomerId;
