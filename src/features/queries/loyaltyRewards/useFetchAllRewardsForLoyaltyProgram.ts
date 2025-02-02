import { LoyaltyProgramMilestone } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useQuery } from '@tanstack/react-query';
import { collectionGroup, query, where, getDocs } from 'firebase/firestore';

const useFetchAllRewardsForLoyaltyProgram = (loyaltyProgramId: string) => {
  return useQuery({
    queryKey: ['useFetchAllRewardsForLoyaltyProgram', loyaltyProgramId],
    queryFn: async () => {
      if (!loyaltyProgramId) {
        return null;
      }

      const loyaltyRewardMilestonesQueryRef = query(
        collectionGroup(db, 'milestoneRewards'),
        where('loyaltyProgramId', '==', loyaltyProgramId)
      );
      const loyaltyRewardMilestonesQuerySnapshot = await getDocs(
        loyaltyRewardMilestonesQueryRef
      );

      if (loyaltyRewardMilestonesQuerySnapshot.empty) {
        return null;
      }

      return loyaltyRewardMilestonesQuerySnapshot.docs.map((doc) => {
        console.log(doc.data());
        return {
          ...doc.data(),
          id: doc.id,
          reward: {
            ...doc.data().reward,
            validUntilDate: doc.data().reward.validUntilDate
              ? (doc.data().reward.validUntilDate as any).toDate()
              : null,
          },
        } as LoyaltyProgramMilestone;
      });
    },
  });
};

export default useFetchAllRewardsForLoyaltyProgram;
