import { LoyaltyCardTransaction } from '@src/domain';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from 'firebase/firestore';
import { getLoyaltyCardTransactionsSubcollectionRef } from '../helpers';

const TRANSACTIONS_PER_PAGE = 20;

const useFetchLoyaltyCardTransactionsByCardId = (
  cardId: string,
  businessId: string
) => {
  return useInfiniteQuery<{
    transactions: Array<LoyaltyCardTransaction>;
    lastVisible: any;
  }>({
    queryKey: ['useFetchLoyaltyCardTransactionsByCardId', cardId],
    initialPageParam: null,
    queryFn: async ({ pageParam = null }) => {
      try {
        if (!cardId || !businessId) {
          return { transactions: [], lastVisible: null };
        }

        const transactionsRef =
          getLoyaltyCardTransactionsSubcollectionRef(businessId);
        let q = query(
          transactionsRef,
          where('loyaltyCardId', '==', cardId),
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
      } catch (error) {
        console.error('Error fetching loyalty card transactions:', error);
        return { transactions: [], lastVisible: null };
      }
    },

    getNextPageParam: (lastPage: {
      transactions: Array<LoyaltyCardTransaction>;
      lastVisible: any;
    }) => lastPage.lastVisible ?? undefined,
  });
};
export default useFetchLoyaltyCardTransactionsByCardId;
