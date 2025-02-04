import { toLoyaltyProgramMilestone } from '@src/features/mappers/toLoyaltyProgramMilestone';
import { getLoyaltyMilestoneRewardSubcollectionRef } from '@src/infrastructure/firebase/firestore.helpers';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { get } from 'react-hook-form';
import { l } from 'vite/dist/node/types.d-aGj9QkWt';
import { getBusinessRef } from '../helpers';
import { LoyaltyProgramMilestone } from '@src/domain';

const useFetchRewardById = (
  id: string,
  loyaltyProgramId: string,
  businessId: string
) => {
  return useQuery({
    queryKey: ['useFetchRewardById', id, loyaltyProgramId, businessId],
    queryFn: async () => {
      if (!id || !loyaltyProgramId || !businessId) {
        return null;
      }

      try {
        const loyaltyRewardMilestonesRef = doc(
          getLoyaltyMilestoneRewardSubcollectionRef(
            loyaltyProgramId,
            businessId
          ),
          id
        );

        const loyaltyRewardMilestonesSnapshot = await getDoc(
          loyaltyRewardMilestonesRef
        );
        const data = loyaltyRewardMilestonesSnapshot.data();

        const business = await getDoc(getBusinessRef(businessId));

        const reward = toLoyaltyProgramMilestone(
          loyaltyRewardMilestonesSnapshot.id,
          data
        );

        const businessData = business.data();

        return {
          ...reward,
          businessName: businessData?.name,
        } as LoyaltyProgramMilestone & { businessName: string };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  });
};

export default useFetchRewardById;
