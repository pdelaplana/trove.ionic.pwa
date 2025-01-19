import {
  LoyaltyProgram,
  LoyaltyProgramMilestone,
  LoyaltyProgramTier,
} from '@src/domain';
import { createContext, ReactNode, useContext } from 'react';
import useFetchLoyaltyProgramById from '../queries/loyaltyProgram/useFetchLoyaltyProgramById';
import useUpsertLoyaltyProgram from '../mutations/useUpsertLoyaltyProgram';

type LoyaltyProgramContextType = {
  loyaltyProgram?: LoyaltyProgram;
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

  const { mutateAsync, error, isPending, isSuccess, status, reset } =
    useUpsertLoyaltyProgram();

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
      await upsertLoyaltyProgram({
        ...loyaltyProgram,
        milestones: loyaltyProgram.milestones?.some(
          (m) => m.id === loyaltyProgramMilestone.id
        )
          ? loyaltyProgram.milestones.map((m) =>
              m.id === loyaltyProgramMilestone.id ? loyaltyProgramMilestone : m
            )
          : [...(loyaltyProgram.milestones || []), loyaltyProgramMilestone],
      });
    }
  };

  const deleteLoyaltyProgramMilestone = async (
    loyaltyProgramMilestoneId: string
  ) => {
    if (loyaltyProgram) {
      await upsertLoyaltyProgram({
        ...loyaltyProgram,
        milestones: loyaltyProgram.milestones.filter(
          (m) => m.id !== loyaltyProgramMilestoneId
        ),
      });
    }
  };

  return (
    <LoyaltyProgramContext.Provider
      value={{
        loyaltyProgram: loyaltyProgram ?? undefined,
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
