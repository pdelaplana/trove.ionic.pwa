import { toLoyaltyProgramMilestone } from '@src/features/mappers/toLoyaltyProgramMilestone';
import { getLoyaltyMilestoneRewardSubcollectionRef } from '@src/infrastructure/firebase/firestore.helpers';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { getBusinessById } from '../helpers';
import { LoyaltyProgramMilestone } from '@src/domain';

const useFetchLoyaltyProgramMilestoneById = (
  id: string,
  loyaltyProgramId: string,
  businessId: string
) => {
  return useQuery({
    queryKey: [
      'useFetchLoyaltyProgramMilestoneById',
      id,
      loyaltyProgramId,
      businessId,
    ],
    queryFn: async () => {
      if (!id || !loyaltyProgramId || !businessId) {
        return null;
      }

      try {
        const loyaltyProgramMilestoneSubcollectiionRef =
          getLoyaltyMilestoneRewardSubcollectionRef(
            loyaltyProgramId,
            businessId
          );

        const loyaltyProgramMilestoneSnapshot = await getDoc(
          doc(loyaltyProgramMilestoneSubcollectiionRef, id)
        );

        const milestone = toLoyaltyProgramMilestone(
          loyaltyProgramMilestoneSnapshot.id,
          loyaltyProgramMilestoneSnapshot.data()
        );

        const business = await getBusinessById(businessId);

        return {
          ...milestone,
          businessName: business?.name,
        } as LoyaltyProgramMilestone & { businessName: string };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  });
};

export default useFetchLoyaltyProgramMilestoneById;
