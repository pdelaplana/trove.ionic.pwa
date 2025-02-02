import { LoyaltyProgramMilestone } from '@src/domain';
import { useMutation } from '@tanstack/react-query';
import {
  getLoyaltyMilestoneRewardSubcollectionRef,
  insertDocument,
  updateDocument,
} from '../queries/helpers';

const useUpsertLoyaltyProgramMilestone = () => {
  return useMutation({
    mutationFn: async (data: LoyaltyProgramMilestone) => {
      const loyaltyMilestoneRewardSubcollectionRef =
        getLoyaltyMilestoneRewardSubcollectionRef(
          data.loyaltyProgramId,
          data.businessId
        );

      try {
        if (data.id) {
          return await updateDocument<LoyaltyProgramMilestone>(
            data,
            loyaltyMilestoneRewardSubcollectionRef
          );
        } else {
          return await insertDocument<LoyaltyProgramMilestone>(
            data,
            loyaltyMilestoneRewardSubcollectionRef
          );
        }
      } catch (error) {
        throw new Error('Error adding document: ' + error);
      }
    },
    onSuccess: (data) => {
      console.log('Document written with ID: ', data.id);
    },
    onError: (error: unknown) => {
      console.error('Error adding document: ', error);
    },
  });
};

export default useUpsertLoyaltyProgramMilestone;
