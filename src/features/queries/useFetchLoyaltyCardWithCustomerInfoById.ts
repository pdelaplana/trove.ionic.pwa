import { Customer, LoyaltyCard } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';

const useFetchLoyaltyCardWithCustomerInfoById = (id: string) => {
  return useQuery({
    queryKey: ['useFetchLoyaltyCardWithCustomerInfoById', id],
    queryFn: async () => {
      const loyaltyCardsRef = doc(db, 'loyaltyCards', id);
      const loyaltyCardSnapshot = await getDoc(loyaltyCardsRef);

      if (loyaltyCardSnapshot.exists()) {
        const loyaltyCard = {
          ...loyaltyCardSnapshot.data(),
          id: loyaltyCardSnapshot.id,
          membershipDate: loyaltyCardSnapshot.data().membershipDate.toDate(),
        } as LoyaltyCard;

        const customerSnapshot = await getDoc(
          doc(db, 'customers', loyaltyCard.customerId)
        );
        const customer = {
          ...customerSnapshot.data(),
        } as Omit<Customer, 'id'>;

        return { ...loyaltyCard, ...customer };
      } else {
        console.log('No such document!');
        return null;
      }
    },
  });
};

export default useFetchLoyaltyCardWithCustomerInfoById;
