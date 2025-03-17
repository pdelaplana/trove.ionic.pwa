import {
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonNote,
  IonButton,
} from '@ionic/react';
import { LoyaltyCard, LoyaltyCardTransaction } from '@src/domain';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import useFetchLoyaltyCardTransactionsByCardId from '@src/features/queries/loyaltyCard/useFetchLoyaltyCardTransactionsByCardId';
import useFormatters, {
  DateFormatString,
} from '@src/pages/components/hooks/useFormatters';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import EmptySection from '@src/pages/components/layouts/EmptySection';
import { format } from 'date-fns';
import { cashOutline, chevronForward, giftOutline } from 'ionicons/icons';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

const LoyaltyCardActivityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);
  const [transactions, setTransactions] =
    useState<Array<LoyaltyCardTransaction>>();

  const { formatCurrency, formatDate, formatNumber } = useFormatters();

  const { loyaltyCards } = useCustomerProvider();

  const { data, hasNextPage, isLoading, fetchNextPage } =
    useFetchLoyaltyCardTransactionsByCardId(
      loyaltyCard?.id ?? '',
      loyaltyCard?.businessId ?? ''
    );

  const groupedByMonth = useMemo(() => {
    if (transactions) {
      return transactions.reduce(
        (acc, transaction) => {
          const key = format(transaction.transactionDate, 'MMMM yyyy');
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(transaction);
          return acc;
        },
        {} as Record<string, LoyaltyCardTransaction[]>
      );
    }
  }, [transactions]);

  const activityItem = (transaction: LoyaltyCardTransaction) => (
    <IonItem
      button
      key={transaction.id}
      lines='full'
      routerLink={`/card/${id}/activity/${transaction.id}`}
    >
      <div className='item-start-wrapper ion-padding-start' slot='start'>
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
      </div>

      <IonLabel>
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
      </IonLabel>
      <div className='item-end-wrapper' slot='end'>
        <IonNote color='medium' className='ion-margin-end'>
          {formatNumber(transaction.totalPoints)} pts
        </IonNote>
        <IonIcon color='primary' icon={chevronForward}></IonIcon>
      </div>
    </IonItem>
  );

  useEffect(() => {
    const card = loyaltyCards?.find((card) => card.id === id);
    setLoyaltyCard(card ?? null);
  }, [loyaltyCards]);

  useEffect(() => {
    if (data) {
      setTransactions(data.pages.flatMap((page) => page.transactions));
    }
  }, [data]);

  return (
    <BasePageLayout
      title='Activity'
      showProfileIcon={false}
      showHeader={true}
      defaultBackButtonHref={`/card/${id}`}
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
            {Object.entries(groupedByMonth ?? {}).map(
              ([month, transactions]) => (
                <IonList
                  className='ion-no-margin ion-no-padding ion-margin-top '
                  key={month}
                >
                  <IonItem
                    lines='none'
                    className='ion-no-margin ion-no-padding'
                    style={{ marginLeft: '14px' }}
                  >
                    <IonLabel color={'medium'}>
                      <h2>{month}</h2>
                    </IonLabel>
                  </IonItem>
                  {transactions?.map((transaction) =>
                    activityItem(transaction)
                  )}
                </IonList>
              )
            )}
          </>
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};
export default LoyaltyCardActivityPage;
