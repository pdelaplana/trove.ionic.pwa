import { LoyaltyCard, LoyaltyProgramMilestone } from '@src/domain';
import { useQuery } from '@tanstack/react-query';
import { collectionGroup, where, getDocs, query } from 'firebase/firestore';
import { getLoyaltyMilestoneRewardSubcollectionRef } from '../helpers';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { toLoyaltyProgramMilestone } from '@src/features/mappers/toLoyaltyProgramMilestone';

const useFetchAvailableRewardsForCustomer = (customerId: string) => {
  return useQuery({
    queryKey: ['useFetchAvailableRewardsForCustomer', customerId],
    queryFn: async () => {
      if (!customerId) {
        return null;
      }

      try {
        const loyaltyCardsRef = collectionGroup(db, 'loyaltyCards');
        const loyaltyCardsQueryRef = query(
          loyaltyCardsRef,
          where('customerId', '==', customerId)
        );
        const loyaltyCardsQuerySnapshot = await getDocs(loyaltyCardsQueryRef);

        if (loyaltyCardsQuerySnapshot.empty) {
          return null;
        }

        const combinedRewards = (
          await Promise.all(
            loyaltyCardsQuerySnapshot.docs.map(async (card) => {
              const loyaltyCard = {
                ...card.data(),
                id: card.id,
                businessId: card.ref.parent.parent?.id,
              } as LoyaltyCard;

              const loyaltyRewardMilestonesSubcollectionRef =
                getLoyaltyMilestoneRewardSubcollectionRef(
                  loyaltyCard.loyaltyProgramId,
                  loyaltyCard.businessId
                );

              const queryRef = query(
                loyaltyRewardMilestonesSubcollectionRef,
                where('points', '<=', loyaltyCard.points.toString()),
                where('tierId', 'in', [loyaltyCard.tierId, ''])
              );

              const querySnapshot = await getDocs(queryRef);

              return querySnapshot.docs.map(
                (doc) =>
                  toLoyaltyProgramMilestone(
                    doc.id,
                    doc.data()
                  ) as LoyaltyProgramMilestone
              );
            })
          )
        ).flat();

        return combinedRewards;
      } catch (error) {
        console.log(`Failed to fetch rewards: ${error}`);
        throw new Error(`Failed to fetch rewards: ${error}`);
      }
    },
  });
};

export default useFetchAvailableRewardsForCustomer;
