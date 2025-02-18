import { LoyaltyCard, LoyaltyProgramMilestone } from '@src/domain';
import { useQuery } from '@tanstack/react-query';
import {
  collectionGroup,
  where,
  getDocs,
  query,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
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
              } as LoyaltyCard;

              const loyaltyRewardMilestonesSubcollectionRef =
                getLoyaltyMilestoneRewardSubcollectionRef(
                  loyaltyCard.loyaltyProgramId,
                  loyaltyCard.businessId
                );

              const queryRef = query(
                loyaltyRewardMilestonesSubcollectionRef,
                where('reward.validUntilDate', '>=', Timestamp.now()),
                where('points', '<=', loyaltyCard.rewardPoints),
                where('tierId', 'in', [loyaltyCard.tierId, '']),
                orderBy('reward.validUntilDate', 'desc')
              );

              const querySnapshot = await getDocs(queryRef);
              return querySnapshot.docs.map((doc) => {
                const milestone = toLoyaltyProgramMilestone(doc.id, doc.data());
                return {
                  ...milestone,
                  membershipNumber: loyaltyCard.membershipNumber,
                  businessName: loyaltyCard.businessName,
                } as LoyaltyProgramMilestone & {
                  membershipNumber: string;
                  businessName: string;
                };
              });
            })
          )
        ).flat();

        return combinedRewards;
      } catch (error) {
        console.error(`Failed to fetch rewards: ${error}`);
        throw new Error(`Failed to fetch rewards: ${error}`);
      }
    },
  });
};

export default useFetchAvailableRewardsForCustomer;
