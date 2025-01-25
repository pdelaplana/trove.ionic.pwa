import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import CustomerLoyaltyCardResult from './components/CustomerLoyaltyCardResult';
import { useState } from 'react';
import CustomerLoyaltyCardSearchForm from './components/CustomerLoyaltyCardSearchForm';
import CustomerLoyaltyCardAddTransactionForm from './components/CustomerLoyaltyCardAddTransactionForm';
import CustomerLoyaltyCardAddTransactionResult from './components/CustomerLoyaltyCardAddTransactionResult';
import { LoyaltyCardTransaction } from '@src/domain';
import { set } from 'date-fns';

export enum CustomerEarnPointsPageState {
  SEARCH = 'SEARCH',
  REVIEW_CUSTOMER = 'REVIEW_CUSTOMER',
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  RESULT = 'RESULT',
}

const CustomerEarnPointsPage = () => {
  const [currentPageState, setPageCurrentState] =
    useState<CustomerEarnPointsPageState>(CustomerEarnPointsPageState.SEARCH);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [membershipNumber, setMembershipNumber] = useState<string>('');
  const [loyaltyCardTransaction, setLoyaltyCardTransaction] =
    useState<LoyaltyCardTransaction>();

  const handleSearchStarted = (term: string) => {
    setSearchTerm(term);
    setPageCurrentState(CustomerEarnPointsPageState.REVIEW_CUSTOMER);
  };

  const handlePageStateChange = (pageState: CustomerEarnPointsPageState) => {
    setPageCurrentState(pageState);
  };

  return (
    <BasePageLayout title='Add Points' defaultBackButtonHref='/manage/'>
      <CenterContainer>
        {currentPageState === CustomerEarnPointsPageState.SEARCH && (
          <CustomerLoyaltyCardSearchForm
            onSearchStarted={handleSearchStarted}
          />
        )}

        {currentPageState === CustomerEarnPointsPageState.REVIEW_CUSTOMER && (
          <CustomerLoyaltyCardResult
            membershipId={searchTerm}
            onCustomerLoyaltyCardFound={(membershipNumber) =>
              setMembershipNumber(membershipNumber)
            }
            onPageStateChange={(state) => setPageCurrentState(state)}
          />
        )}

        {currentPageState === CustomerEarnPointsPageState.ADD_TRANSACTION && (
          <CustomerLoyaltyCardAddTransactionForm
            membershipNumber={membershipNumber}
            onTransactionCompleted={(transaction) =>
              setLoyaltyCardTransaction(transaction)
            }
            onPageStateChange={(state) => setPageCurrentState(state)}
          />
        )}

        {currentPageState === CustomerEarnPointsPageState.RESULT && (
          <CustomerLoyaltyCardAddTransactionResult
            onPageStateChange={(state) => setPageCurrentState(state)}
            loyaltyCardTransaction={loyaltyCardTransaction ?? null}
          />
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};
export default CustomerEarnPointsPage;
