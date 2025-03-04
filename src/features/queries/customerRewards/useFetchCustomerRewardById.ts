import { toCustomerReward } from '@src/features/mappers/toCustomerReward';
import {
  getCustomerRewardsSubcollectionRef,
  getLoyaltyCardById,
} from '@src/infrastructure/firebase/firebase.helpers';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';

const useFetchCustomerRewardById = (
  id: string,
  loyaltyCardId: string,
  businessId: string
) => {
  return useQuery({
    queryKey: ['useFetchCustomerRewardById', id, loyaltyCardId, businessId],
    queryFn: async () => {
      if (!id || !loyaltyCardId || !businessId) {
        return null;
      }

      try {
        const loyaltyCard = await getLoyaltyCardById(loyaltyCardId, businessId);

        const customerRewardRef = doc(
          getCustomerRewardsSubcollectionRef(businessId),
          id
        );

        const customerRewardSnapshot = await getDoc(customerRewardRef);
        const data = customerRewardSnapshot.data();

        return {
          ...toCustomerReward(customerRewardSnapshot.id, data),
          businessName: loyaltyCard.businessName,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  });
};

export default useFetchCustomerRewardById;
