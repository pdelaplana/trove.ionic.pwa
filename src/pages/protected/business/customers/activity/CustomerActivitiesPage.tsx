import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
} from '@ionic/react';
import { LoyaltyCardTransaction } from '@src/domain';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { cashOutline, chevronForward, giftOutline } from 'ionicons/icons';
import useFormatters, {
  DateFormatString,
} from '@src/pages/components/hooks/useFormatters';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { useFetchLoyaltyCardTransactionsByCardId } from '@src/features/queries';
import EmptySection from '@src/pages/components/layouts/EmptySection';
import {
  IonItemEndSlot,
  IonItemStartSlot,
} from '@src/pages/components/ui/IonItemSlot';

const CustomerActivitiesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // cardid, customerid

  const { business } = useBusiness();

  const {
    data,
    hasNextPage,
    isLoading: isFetchingNextPage,
    fetchNextPage,
  } = useFetchLoyaltyCardTransactionsByCardId(id, business?.id ?? '');

  const [transactions, setTransactions] =
    useState<Array<LoyaltyCardTransaction>>();

  const { formatCurrency, formatDate, formatNumber } = useFormatters();

  useEffect(() => {
    if (data) {
      setTransactions(data.pages.flatMap((page) => page.transactions));
    }
  }, [data]);

  return (
    <BasePageLayout title='Activity' defaultBackButtonHref={`/customers/${id}`}>
      <CenterContainer>
        {transactions?.length === 0 && (
          <EmptySection
            heading='No Activity'
            content='This customer has no recorded activity yet.'
          />
        )}

        {transactions?.length! > 0 && (
          <>
            <IonList className='ion-margin'>
              {transactions?.map((transaction) => (
                <IonItem
                  button
                  key={transaction.id}
                  lines='full'
                  routerLink={`/customers/${id}/activity/${transaction.id}`}
                >
                  <IonItemStartSlot slot='start'>
                    {transaction.transactionType === 'purchase' && (
                      <IonIcon
                        slot='start'
                        icon={cashOutline}
                        color='medium'
                        size='medium'
                      />
                    )}
                    {transaction.transactionType === 'redeem' && (
                      <IonIcon
                        slot='start'
                        icon={giftOutline}
                        color='medium'
                        size='medium'
                      />
                    )}
                  </IonItemStartSlot>
                  <IonLabel>
                    <>
                      <h2>
                        {formatDate(
                          transaction.transactionDate,
                          DateFormatString.EEE_MM_DD_YYYY
                        )}
                      </h2>
                      <IonNote>
                        {transaction.finalAmount > 0
                          ? `${formatCurrency(
                              transaction.finalAmount,
                              transaction?.currency
                            )} spent at ${transaction.businessName}`
                          : ''}
                        {transaction.finalAmount == 0
                          ? `Reedeemed at ${transaction.businessName}`
                          : ''}
                      </IonNote>
                    </>
                  </IonLabel>
                  <IonItemEndSlot slot='end'>
                    <IonNote color='medium' className='ion-margin-end'>
                      {formatNumber(transaction.totalPoints)} pts
                    </IonNote>
                    <IonIcon color='primary' icon={chevronForward}></IonIcon>
                  </IonItemEndSlot>
                </IonItem>
              ))}
              {hasNextPage && (
                <IonItem lines='none'>
                  <IonLabel>
                    <IonButton
                      expand='full'
                      fill='clear'
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                    </IonButton>
                  </IonLabel>
                </IonItem>
              )}
            </IonList>
          </>
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerActivitiesPage;
