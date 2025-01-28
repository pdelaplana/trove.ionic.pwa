import { Customer } from '@src/domain';
import { createContext, useContext } from 'react';
import useFetchCustomerById from '../queries/useFetchCustomerById';

type CustomerContextType = {
  customer?: Customer;
};

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);

export const CustomerProvider: React.FC<{
  customerId: string;
  children: React.ReactNode;
}> = ({ customerId, children }) => {
  const { data: customer } = useFetchCustomerById(customerId);
  return (
    <CustomerContext.Provider
      value={{
        customer: customer ?? undefined,
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
