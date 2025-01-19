import { LoyaltyCard, LoyaltyCardTransaction } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useQuery } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

const TRANSACTIONS_PER_PAGE = 20;

export type LoyaltyCardPage = {
  cards: Array<LoyaltyCard>;
  lastVisible: any;
};

const useFetchLoyaltyCardByQuery = (queryString: string) => {
  return useQuery({
    queryKey: ['useFetchLoyaltyCardByQuery', queryString],
    queryFn: async () => {
      const loyaltyCardRef = collection(db, 'loyaltyCards');
      let q = query(
        loyaltyCardRef,
        where('membershipNumber', '==', queryString),
        limit(TRANSACTIONS_PER_PAGE)
      );

      let snapshot = await getDocs(q);

      if (snapshot.empty) {
        const customerRef = collection(db, 'customers');
        q = query(
          customerRef,
          where('email', '==', queryString),
          limit(TRANSACTIONS_PER_PAGE)
        );
        snapshot = await getDocs(q);

        if (snapshot.empty) {
          q = query(
            customerRef,
            where('phoneNumber', '==', queryString),
            limit(TRANSACTIONS_PER_PAGE)
          );
          snapshot = await getDocs(q);
        }
      }

      const transactions = snapshot.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            transactionDate: doc.data().transactionDate.toDate(),
            id: doc.id,
          }) as LoyaltyCardTransaction
      );
      /*
      const loyaltyCardSnapshot = await getDoc(loyaltyCardRef);
      if (loyaltyCardSnapshot.exists()) {
        return {
          ...loyaltyCardSnapshot.data(),
          id: loyaltyCardSnapshot.id,
        } as LoyaltyCard;
      } else {
        console.log('No such document!');
        return null;
      }
        */
    },
  });
};
export default useFetchLoyaltyCardByQuery;
