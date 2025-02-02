import {
  LoyaltyProgram,
  LoyaltyProgramMilestone,
  LoyaltyProgramTier,
} from '@src/domain';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import useFetchLoyaltyProgramById from '../queries/loyaltyProgram/useFetchLoyaltyProgramById';
import useUpsertLoyaltyProgram from '../mutations/useUpsertLoyaltyProgram';
import { useUpsertLoyaltyProgramMilestone } from '../mutations';
import useFetchAllRewardsForLoyaltyProgram from '../queries/loyaltyRewards/useFetchAllRewardsForLoyaltyProgram';
import { l } from 'vite/dist/node/types.d-aGj9QkWt';
import useDeleteDocument from '../mutations/useDeleteDocument';
import useEarnPointsFunction from '../cloudFunctions/useEarnPointsFunction';

type LoyaltyProgramContextType = {
  loyaltyProgram?: LoyaltyProgram;
  loyaltyRewardMilestones?: LoyaltyProgramMilestone[];
  upsertLoyaltyProgram: (loyaltyProgram: LoyaltyProgram) => void;
  upsertLoyaltyProgramTier: (loyaltyProgramTier: LoyaltyProgramTier) => void;
  deleteLoyaltyProgramTier: (loyaltyProgramTierId: string) => void;
  upsertLoyaltyProgramMilestone: (
    loyaltyProgramMilestone: LoyaltyProgramMilestone
  ) => void;
  deleteLoyaltyProgramMilestone: (loyaltyProgramMilestoneId: string) => void;
};

const LoyaltyProgramContext = createContext<
  LoyaltyProgramContextType | undefined
>(undefined);

export const LoyaltyProgramProvider: React.FC<{
  loyaltyProgramId: string;
  businessId: string;
  children: ReactNode;
}> = ({ loyaltyProgramId, businessId, children }) => {
  const {
    data: loyaltyProgram,
    isLoading,
    refetch,
  } = useFetchLoyaltyProgramById(loyaltyProgramId, businessId);

  const {
    data: loyaltyRewardMilestones,
    refetch: refetchLoyaltyRewardMilestones,
  } = useFetchAllRewardsForLoyaltyProgram(loyaltyProgramId);

  const { mutateAsync, error, isPending, isSuccess, status, reset } =
    useUpsertLoyaltyProgram();

  const {
    mutate: mutateLoyaltyProgramMilestoneAsync,
    reset: resetMutateLoyaltyProgramMilestone,
    isSuccess: mutateLoyaltyProgramMilestoneSuccess,
  } = useUpsertLoyaltyProgramMilestone();

  const { mutateAsync: deleteDocumentAsync } = useDeleteDocument();

  const upsertLoyaltyProgram = async (loyaltyProgram: LoyaltyProgram) => {
    await mutateAsync(loyaltyProgram);
    refetch();
    setTimeout(() => {
      // reset the status after 1 second
      reset();
    }, 1000);
  };

  const upsertLoyaltyProgramTier = async (
    loyaltyProgramTier: LoyaltyProgramTier
  ) => {
    if (loyaltyProgram) {
      await upsertLoyaltyProgram({
        ...loyaltyProgram,
        tiers: loyaltyProgram.tiers?.some((t) => t.id === loyaltyProgramTier.id)
          ? loyaltyProgram.tiers.map((t) =>
              t.id === loyaltyProgramTier.id ? loyaltyProgramTier : t
            )
          : [...(loyaltyProgram.tiers || []), loyaltyProgramTier],
      });
    }
  };

  const deleteLoyaltyProgramTier = async (loyaltyProgramTierId: string) => {
    if (loyaltyProgram) {
      await upsertLoyaltyProgram({
        ...loyaltyProgram,
        tiers: loyaltyProgram.tiers.filter(
          (t) => t.id !== loyaltyProgramTierId
        ),
      });
    }
  };

  const upsertLoyaltyProgramMilestone = async (
    loyaltyProgramMilestone: LoyaltyProgramMilestone
  ) => {
    if (loyaltyProgram) {
      mutateLoyaltyProgramMilestoneAsync(loyaltyProgramMilestone);
    }
  };

  const deleteLoyaltyProgramMilestone = async (
    loyaltyProgramMilestoneId: string
  ) => {
    deleteDocumentAsync({
      id: loyaltyProgramMilestoneId,
      collectionName: `businesses/${businessId}/loyaltyPrograms/${loyaltyProgramId}/milestoneRewards`,
    });
  };

  useEffect(() => {
    if (mutateLoyaltyProgramMilestoneSuccess) {
      refetchLoyaltyRewardMilestones();
      setTimeout(() => {
        // reset the status after 1 second
        resetMutateLoyaltyProgramMilestone();
      }, 1000);
    }
  }, [mutateLoyaltyProgramMilestoneSuccess]);

  return (
    <LoyaltyProgramContext.Provider
      value={{
        loyaltyProgram: loyaltyProgram ?? undefined,
        loyaltyRewardMilestones: loyaltyRewardMilestones ?? undefined,
        upsertLoyaltyProgram,
        upsertLoyaltyProgramTier,
        deleteLoyaltyProgramTier,
        upsertLoyaltyProgramMilestone,
        deleteLoyaltyProgramMilestone,
      }}
    >
      {children}
    </LoyaltyProgramContext.Provider>
  );
};

export const useLoyaltyProgram = () => {
  const context = useContext(LoyaltyProgramContext);
  if (context === undefined) {
    throw new Error(
      'useLoyaltyProgram must be used within a LoyaltyProgramProvider'
    );
  }
  return context;
};
