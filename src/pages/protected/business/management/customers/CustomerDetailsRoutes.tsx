import ProtectedRoute from '@src/pages/components/routing/ProtectedRoute';
import CustomerDetailsPage from './details/CustomerDetailsPage';
import CustomerEditPage from './details/edit/CustomerEditPage';
import CustomerTransactionDetailsPage from './details/transactions/CustomerTransactionDetailsPage';
import CustomerTransactionsListPage from './details/transactions/CustomerTransactionsListPage';

export const CustomerDetailsRoutes: React.FC = () => {
  return (
    <>
      <ProtectedRoute path='/manage/customers/:id' exact>
        <CustomerDetailsPage />
      </ProtectedRoute>
      <ProtectedRoute path='/manage/customers/:id/edit/:customerId' exact>
        <CustomerEditPage />
      </ProtectedRoute>
      {/* Customer Transactions */}
      <ProtectedRoute
        path='/manage/customers/:id/transactions/:customerId'
        exact
      >
        <CustomerTransactionsListPage />
      </ProtectedRoute>
      <ProtectedRoute
        path='/manage/customers/:id/transactions/:customerId/details/:transactionId'
        exact
      >
        <CustomerTransactionDetailsPage />
      </ProtectedRoute>
    </>
  );
};
