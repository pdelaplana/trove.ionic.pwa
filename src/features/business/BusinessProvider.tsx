import { OperatingHours, Business, LoyaltyCard, Customer } from '@src/domain';
import { createContext, ReactNode, useContext } from 'react';
import useFetchBusinessById from '../queries/useFetchBusinessById';
import useUpsertBusiness from '../mutations/useUpsertBusiness';
import {
  LoyaltyProgram,
  LoyaltyProgramMilestone,
  LoyaltyProgramTier,
} from '@src/domain/entities/loyaltyProgram';

import { useUniqueNumberGenerator } from '@src/pages/components/hooks/useUniqueNumberGenerator';
import useFetchAllLoyaltyPrograms from '../queries/useFetchAllLoyaltyPrograms';

type BusinessContextType = {
  business?: Business;
  isLoading: boolean;
  updatePending: boolean;
  status: 'idle' | 'loading' | 'pending' | 'success' | 'error';

  upsertAsync: (business: Business) => void;

  upsertOperatingHours: (operatingHours: OperatingHours) => void;
  deleteOperatingHours: (operatingHours: OperatingHours) => void;

  upsertLoyaltyProgram: (loyaltyProgram: LoyaltyProgram) => void;
  upsertLoyaltyProgramTier: (
    loyaltyProgramId: string,
    loyaltyProgramTier: LoyaltyProgramTier
  ) => void;

  deleteLoyaltyProgramTier: (
    loyaltyProgramId: string,
    loyaltyProgramTierId: string
  ) => void;

  upsertLoyaltyProgramMilestone: (
    loyaltyProgramId: string,
    loyaltyProgramMilestone: LoyaltyProgramMilestone
  ) => void;
  deleteLoyaltyProgramMilestone: (
    loyaltyProgramId: string,
    loyaltyProgramMilestoneId: string
  ) => void;
};

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

export const BusinessProvider: React.FC<{
  businessId: string;
  children: ReactNode;
}> = ({ businessId, children }) => {
  const {
    data: business,
    isLoading,
    refetch,
  } = useFetchBusinessById(businessId);

  const { data: loyaltyPrograms } = useFetchAllLoyaltyPrograms();

  const {
    mutateAsync: upsertBusinessAsync,
    error,
    isPending,
    isSuccess,
    status,
    reset,
  } = useUpsertBusiness();

  const { generateUniqueNumber } = useUniqueNumberGenerator();

  const upsertAsync = async (business: Business) => {
    await upsertBusinessAsync(business);
    refetch();
    setTimeout(() => {
      // reset the status after 1 second
      reset();
    }, 1000);
  };

  const upsertOperatingHours = async (operatingHours: OperatingHours) => {
    await upsertAsync({
      ...business!,
      operatingHours: !business?.operatingHours
        ? [operatingHours]
        : business.operatingHours.some((b) => b.day === operatingHours.day)
          ? business.operatingHours.map((b) =>
              b.day === operatingHours.day ? operatingHours : b
            )
          : [...business.operatingHours, operatingHours],
    });
  };

  const deleteOperatingHours = async (operatingHours: OperatingHours) => {
    await upsertAsync({
      ...business!,
      operatingHours: business!.operatingHours?.filter(
        (b) => b.day !== operatingHours.day
      ),
    });
  };

  const upsertLoyaltyProgram = async (loyaltyProgram: LoyaltyProgram) => {
    if (
      loyaltyProgram.uniqueCode === undefined ||
      loyaltyProgram.uniqueCode === ''
    ) {
      const usedNumbers = new Set(
        loyaltyPrograms?.map((program) => program.uniqueCode)
      );
      loyaltyProgram.uniqueCode = generateUniqueNumber(6, usedNumbers);
    }
    await upsertAsync({
      ...business!,
      loyaltyPrograms: !business?.loyaltyPrograms
        ? [loyaltyProgram]
        : business.loyaltyPrograms.some((b) => b.id === loyaltyProgram.id)
          ? business.loyaltyPrograms.map((b) =>
              b.id === loyaltyProgram.id ? { ...b, ...loyaltyProgram } : b
            )
          : [...business.loyaltyPrograms, loyaltyProgram],
    });
  };

  const upsertLoyaltyProgramTier = async (
    loyaltyProgramId: string,
    loyaltyProgramTier: LoyaltyProgramTier
  ) => {
    const loyaltyProgram = business?.loyaltyPrograms?.find(
      (p) => p.id === loyaltyProgramId
    );
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

  const deleteLoyaltyProgramTier = async (
    loyaltyProgramId: string,
    loyaltyProgramTierId: string
  ) => {
    const loyaltyProgram = business?.loyaltyPrograms?.find(
      (p) => p.id === loyaltyProgramId
    );
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
    loyaltyProgramId: string,
    loyaltyProgramMilestone: LoyaltyProgramMilestone
  ) => {
    const loyaltyProgram = business?.loyaltyPrograms?.find(
      (p) => p.id === loyaltyProgramId
    );
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
    loyaltyProgramId: string,
    loyaltyProgramMilestoneId: string
  ) => {
    const loyaltyProgram = business?.loyaltyPrograms?.find(
      (p) => p.id === loyaltyProgramId
    );
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
    <BusinessContext.Provider
      value={{
        business: business ?? undefined,
        isLoading,
        updatePending: isPending,
        status: isLoading ? 'loading' : status,

        upsertAsync,

        upsertOperatingHours,
        deleteOperatingHours,

        upsertLoyaltyProgram,

        upsertLoyaltyProgramTier,
        deleteLoyaltyProgramTier,

        upsertLoyaltyProgramMilestone,
        deleteLoyaltyProgramMilestone,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = (): BusinessContextType => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
