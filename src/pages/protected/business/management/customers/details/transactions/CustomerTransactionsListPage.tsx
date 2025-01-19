import { IonIcon, IonItem, IonLabel, IonList, IonNote } from '@ionic/react';
import { LoyaltyCardTransaction } from '@src/domain';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { cashOutline } from 'ionicons/icons';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { useFetchLoyaltyCardTransactionsByCustomerId } from '@src/features/queries';
import EmptySection from '@src/pages/components/layouts/EmptySection';

const CustomerTransactionsListPage: React.FC = () => {
  const { id, customerId } = useParams<{ id: string; customerId: string }>(); // cardid, customerid

  const { business } = useBusiness();

  const { data } = useFetchLoyaltyCardTransactionsByCustomerId(
    customerId,
    business?.id ?? ''
  );

  const [transactions, setTransactions] =
    useState<Array<LoyaltyCardTransaction>>();

  const { formatCurrency, formatDate, formatNumber } = useFormatters();

  useEffect(() => {
    if (data) {
      setTransactions(data.pages.flatMap((page) => page.transactions));
    }
  }, [data]);

  return (
    <BasePageLayout
      title='Card Transactions'
      defaultBackButtonHref={`/manage/customers/${id}`}
    >
      <CenterContainer>
        {transactions?.length === 0 && (
          <EmptySection
            heading='No transactions'
            content='This customer has not made any transactions yet.'
          />
        )}

        {transactions?.length! > 0 && (
          <>
            <div className='ion-margin'>Transactions</div>
            <IonList className='ion-margin'>
              {transactions?.map((transaction) => (
                <IonItem
                  detail
                  button
                  key={transaction.id}
                  lines='full'
                  routerLink={`/manage/customers/${id}/transactions/${customerId}/details/${transaction.id}`}
                >
                  <IonIcon slot='start' icon={cashOutline} color='primary' />
                  <IonLabel>
                    <h2>{transaction.businessName}</h2>
                    <h4>
                      {formatCurrency(
                        transaction.finalAmount,
                        business?.currency
                      )}
                    </h4>
                    <IonNote>{formatDate(transaction.transactionDate)}</IonNote>
                  </IonLabel>
                  <IonLabel slot='end'>
                    <strong>{formatNumber(transaction.totalPoints)} pts</strong>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </>
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerTransactionsListPage;
