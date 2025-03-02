import { Customer, LoyaltyCard } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useQuery } from '@tanstack/react-query';
import { collection, doc, getDoc } from 'firebase/firestore';
import { getLoyaltyCardsSubcollectionRef } from '../helpers';

const useFetchLoyaltyCardWithCustomerInfoById = (
  id: string,
  businessId: string
) => {
  return useQuery({
    queryKey: ['useFetchLoyaltyCardWithCustomerInfoById', id, businessId],
    queryFn: async () => {
      const loyaltyCardsSubcollectionRef =
        getLoyaltyCardsSubcollectionRef(businessId);

      const loyaltyCardSnapshot = await getDoc(
        doc(loyaltyCardsSubcollectionRef, id)
      );

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
