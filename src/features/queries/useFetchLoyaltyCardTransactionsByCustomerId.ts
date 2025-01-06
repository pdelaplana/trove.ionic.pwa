import { LoyaltyCard, Customer, LoyaltyCardTransaction } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';

const TRANSACTIONS_PER_PAGE = 20;

export type LoyaltyCardPage = {
  cards: Array<LoyaltyCard>;
  lastVisible: any;
};

const useFetchLoyaltyCardTransactionsByCustomerId = (customerId: string) => {
  return useInfiniteQuery<{
    transactions: Array<LoyaltyCardTransaction>;
    lastVisible: any;
  }>({
    queryKey: ['useFetchLoyaltyCardTransactionsByCustomerId', customerId],
    initialPageParam: null,
    queryFn: async ({ pageParam = null }) => {
      const transanctionsRef = collection(db, 'loyaltyCardTransactions');
      let q = query(
        transanctionsRef,
        where('customerId', '==', customerId),
        //orderBy('transactionDate', 'desc'),
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
