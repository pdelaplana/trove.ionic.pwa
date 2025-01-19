import { OperatingHours, Business } from '@src/domain';
import { createContext, ReactNode, useContext } from 'react';
import useFetchBusinessById from '../queries/useFetchBusinessById';
import useUpsertBusiness from '../mutations/useUpsertBusiness';
import { LoyaltyProgram } from '@src/domain/entities/loyaltyProgram';

import { useUniqueNumberGenerator } from '@src/pages/components/hooks/useUniqueNumberGenerator';
import {
  useFetchAllLoyaltyPrograms,
  useFetchLoyaltyCardsByBusinessId,
} from '../queries';

type BusinessContextType = {
  business?: Business;
  isLoading: boolean;
  updatePending: boolean;
  status: 'idle' | 'loading' | 'pending' | 'success' | 'error';

  upsertAsync: (business: Business) => void;

  upsertOperatingHours: (operatingHours: OperatingHours) => void;
  deleteOperatingHours: (operatingHours: OperatingHours) => void;

  upsertLoyaltyProgram: (loyaltyProgram: LoyaltyProgram) => void;
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
