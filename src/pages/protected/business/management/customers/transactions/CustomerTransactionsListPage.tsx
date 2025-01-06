import { IonIcon, IonItem, IonLabel, IonList, IonNote } from '@ionic/react';
import { LoyaltyCardTransaction } from '@src/domain';
import useFetchLoyaltyCardTransactionsByCustomerId from '@src/features/queries/useFetchLoyaltyCardTransactionsByCustomerId';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { cashOutline } from 'ionicons/icons';

const CustomerTransactionsListPage: React.FC = () => {
  const { id, customerId } = useParams<{ id: string; customerId: string }>(); // cardid, customerid

  const { data } = useFetchLoyaltyCardTransactionsByCustomerId(customerId);

  const [transactions, setTransactions] =
    useState<Array<LoyaltyCardTransaction>>();

  useEffect(() => {
    if (data) {
      setTransactions(data.pages.flatMap((page) => page.transactions));
    }
  }, [data]);

  return (
    <BasePageLayout
      title='Customer Transactions'
      defaultBackButtonHref={`/manage/customers/details/${id}`}
    >
      <CenterContainer>
        <div className='ion-margin'>Customer Transactions</div>
        <IonList className='ion-margin'>
          {transactions?.map((transaction) => (
            <IonItem detail key={transaction.id} lines='full'>
              <IonIcon slot='start' icon={cashOutline} color='primary' />
              <IonLabel>
                <h2>{transaction.businessName}</h2>
                <h4>Points Earned: {transaction.totalPoints}</h4>
                <IonNote>
                  {' '}
                  {transaction.transactionDate
                    ? format(
                        new Date(transaction.transactionDate),
                        'MMM dd, yyyy'
                      )
                    : ''}
                </IonNote>
              </IonLabel>
              <IonLabel slot='end'>
                <strong>{transaction.finalAmount}</strong>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerTransactionsListPage;
