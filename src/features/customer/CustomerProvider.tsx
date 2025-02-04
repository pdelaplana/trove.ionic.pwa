import { Customer, LoyaltyCard } from '@src/domain';
import { createContext, useContext, useState } from 'react';
import useFetchCustomerById from '../queries/useFetchCustomerById';
import { useFetchLoyaltyCardByCustomerId } from '../queries';

type CustomerContextType = {
  customer?: Customer;
  loyaltyCards: LoyaltyCard[] | undefined;
  getCurrentLoyaltyCard: () => LoyaltyCard | null;
  setCurrentLoyaltyCard: (loyaltyCard: LoyaltyCard) => void;
};

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);

export const CustomerProvider: React.FC<{
  customerId: string;
  children: React.ReactNode;
}> = ({ customerId, children }) => {
  const { data: customer } = useFetchCustomerById(customerId);
  const { data: loyaltyCards } = useFetchLoyaltyCardByCustomerId(customerId);
  const [currentLoyaltyCard, setCurrentLoyaltyCard] =
    useState<LoyaltyCard | null>();

  return (
    <CustomerContext.Provider
      value={{
        customer: customer ?? undefined,
        loyaltyCards: loyaltyCards?.cards ?? [],
        getCurrentLoyaltyCard: () => currentLoyaltyCard ?? null,
        setCurrentLoyaltyCard: (loyaltyCard: LoyaltyCard) =>
          setCurrentLoyaltyCard(loyaltyCard),
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerProvider = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error(
      'useCustomerProvider must be used within a CustomerProvider'
    );
  }
  return context;
};
