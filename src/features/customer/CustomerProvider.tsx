import { Customer } from '@src/domain';
import { notificationsCircleOutline } from 'ionicons/icons';
import { createContext, useContext } from 'react';

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
  return (
    <CustomerContext.Provider
      value={{
        customer: undefined,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerProvider = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
