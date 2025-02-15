import { toCustomerReward } from '@src/features/mappers/toCustomerReward';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import {
  getBusinessRef,
  getCustomerRewardsSubcollectionRef,
  getLoyaltyCardById,
  getLoyaltyCardByMembershipNo,
} from '../helpers';

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
          getCustomerRewardsSubcollectionRef(businessId, loyaltyCardId),
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
