import { LoyaltyCard, LoyaltyProgram } from '@src/domain';
import { useQuery } from '@tanstack/react-query';
import {
  getDoc,
  doc,
  collection,
  collectionGroup,
  where,
  getDocs,
  query,
  QuerySnapshot,
  documentId,
  limit,
} from 'firebase/firestore';
import {
  getLoyaltyProgramById,
  getLoyaltyProgramsSubcollectionRef,
} from './helpers';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { R } from '@tanstack/react-query-devtools/build/legacy/ReactQueryDevtools-Cn7cKi7o';

const useFetchAvailableRewardsForCustomer = (customerId: string) => {
  return useQuery({
    queryKey: ['useFetchAvailableRewardsForCustomer', customerId],
    queryFn: async () => {
      if (!customerId) {
        return null;
      }

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

            const loyaltyProgram = await getLoyaltyProgramById(
              loyaltyCard.loyaltyProgramId,
              loyaltyCard.businessId
            );

            const rewards = loyaltyProgram.milestones
              .filter((m) => {
                if (loyaltyCard.tierId) {
                  return (
                    m.points <= loyaltyCard.points &&
                    (m.tierId === loyaltyCard.tierId || !m.tierId)
                  );
                }

                return m.points <= loyaltyCard.points && !m.tierId;
              })
              .map((m) => ({
                ...m,

                reward: {
                  ...m.reward,
                  validUntilDate: m.reward.validUntilDate
                    ? (m.reward.validUntilDate as any).toDate()
                    : null,
                },
              }));

            return rewards;
          })
        )
      ).flat();

      return combinedRewards;
    },
  });
};

export default useFetchAvailableRewardsForCustomer;
