import { LoyaltyCardTransaction } from '@src/domain';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { getLoyaltyCardTransactionsSubcollectionRef } from '../helpers';

const useFetchLoyaltyCardTransactionById = (id: string, businessId: string) => {
  return useQuery({
    queryKey: ['useFetchLoyaltyCardTransactionById', id],
    queryFn: async () => {
      const loyaltyCardTransactionsSubcollectionRef =
        getLoyaltyCardTransactionsSubcollectionRef(businessId);

      const docRef = doc(loyaltyCardTransactionsSubcollectionRef, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          transactionDate: docSnap.data().transactionDate.toDate(),
          id: docSnap.id,
        } as LoyaltyCardTransaction;
      } else {
        console.log('No such document!');
        return null;
      }
    },
  });
};

export default useFetchLoyaltyCardTransactionById;
