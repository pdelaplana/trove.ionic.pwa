import {
  IonList,
  IonItem,
  IonLabel,
  IonLoading,
  IonNote,
  IonText,
  IonRouterLink,
  IonButton,
} from '@ionic/react';
import { LoyaltyCard } from '@src/domain';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import { useFetchLoyaltyCardTransactionById } from '@src/features/queries';
import useFormatters, {
  DateFormatString,
} from '@src/pages/components/hooks/useFormatters';
import {
  BasePageLayout,
  CenterContainer,
  Gap,
} from '@src/pages/components/layouts';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const LoyaltyCardActivityDetailsPage: React.FC = () => {
  const { cardId, transactionId } = useParams<{
    transactionId: string;
    cardId: string;
  }>();
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>();

  const { loyaltyCards } = useCustomerProvider();
  const { data: transaction, isLoading } = useFetchLoyaltyCardTransactionById(
    transactionId,
    loyaltyCard?.businessId ?? ''
  );

  const { formatDate, formatCurrency, formatNumber } = useFormatters();

  useEffect(() => {
    if (loyaltyCards) {
      const data = loyaltyCards.find((card) => card.id === cardId);
      setLoyaltyCard(data);
    }
  }, [loyaltyCards]);

  return (
    <BasePageLayout
      title={formatDate(
        transaction?.transactionDate,
        DateFormatString.EEE_MM_DD_YYYY
      )}
      showHeader={true}
      defaultBackButtonHref={`/card/${cardId}/activity`}
    >
      <CenterContainer>
        {isLoading && <IonLoading isOpen={true} />}
        {!isLoading && transaction && (
          <>
            <IonList lines='full' className='ion-margin-top'>
              <IonItem lines='none'>
                <IonLabel className='ion-text-center'>
                  {transaction?.transactionType == 'purchase' && (
                    <>
                      <IonText color='primary'>
                        <h1>
                          <strong className='text-3xl'>
                            +{formatNumber(transaction?.earnedPoints)}
                          </strong>
                        </h1>
                      </IonText>
                      <p>Total Points Earned</p>
                    </>
                  )}
                  {transaction?.transactionType == 'redeem' && (
                    <>
                      <IonText color='primary'>
                        <h1>
                          <strong className='text-3xl'>
                            -{formatNumber(transaction?.redeemedPoints)}
                          </strong>
                        </h1>
                      </IonText>

                      <p>Points Redeemed</p>
                    </>
                  )}
                </IonLabel>
              </IonItem>
            </IonList>

            <IonList className='ion-margin-top' lines='none'>
              <IonItem>
                <IonLabel className='ion-text-center'>
                  <h1>{transaction.businessName}</h1>
                  <p>{transaction.businessEmail}</p>
                </IonLabel>
              </IonItem>
            </IonList>

            {transaction?.transactionType == 'purchase' && (
              <>
                <IonList className='ion-margin-top' lines='full'>
                  <IonItem>
                    <IonLabel>
                      <h2>Purchase Amount</h2>
                    </IonLabel>
                    <div slot='end'>
                      {formatCurrency(
                        transaction?.purchaseAmount,
                        transaction?.currency
                      )}
                    </div>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Discount Amount</h2>
                    </IonLabel>
                    <div slot='end'>
                      {formatCurrency(
                        transaction?.discountAmount,
                        transaction?.currency
                      )}
                    </div>
                  </IonItem>
                  <IonItem lines='none'>
                    <IonLabel>
                      <h2>Final Amount</h2>
                    </IonLabel>
                    <div slot='end'>
                      {formatCurrency(
                        transaction?.finalAmount,
                        transaction?.currency
                      )}
                    </div>
                  </IonItem>
                </IonList>
                <IonList className='ion-margin-top' lines='full'>
                  <IonItem>
                    <IonLabel>
                      <h2>Points this Purchase</h2>
                    </IonLabel>
                    <div slot='end'>
                      {formatNumber(transaction?.earnedPoints)} pts
                    </div>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Bonus Points</h2>
                    </IonLabel>
                    <div slot='end'>
                      {formatNumber(transaction?.bonusPoints)} pts
                    </div>
                  </IonItem>
                  <IonItem lines='none'>
                    <IonLabel>
                      <h2>Total Points Earned</h2>
                    </IonLabel>
                    <div slot='end'>
                      {formatNumber(transaction?.totalPoints)} pts
                    </div>
                  </IonItem>
                </IonList>
              </>
            )}
            {transaction?.transactionType == 'redeem' && (
              <IonList className='ion-margin-top' lines='none'>
                <IonItem>
                  <IonLabel>
                    <h2>Redeemed Points</h2>
                  </IonLabel>
                  <div className='end'>
                    {formatNumber(transaction?.redeemedPoints)} pts
                  </div>
                </IonItem>
              </IonList>
            )}
            <IonList className='ion-margin-top' lines='none'>
              <IonItem>
                <IonLabel className='ion-text-center'>
                  <h2>
                    <strong>Missing points or need help?</strong>
                  </h2>
                  <p>Some bonus points appear after a delay</p>
                  <p>
                    <IonRouterLink>Find out more</IonRouterLink>
                  </p>
                </IonLabel>
              </IonItem>
            </IonList>
            <IonList className='ion-margin-top' lines='none'>
              <IonItem>
                <IonLabel className='ion-text-center'>
                  <h2>
                    <strong>How was your shopping experience?</strong>
                  </h2>
                  <p>
                    To help us improve, we'd love to hear your feedback about
                    your recent shopping experience.
                  </p>
                  <p style={{ marginTop: '1rem' }}>
                    <IonButton expand='full'>Provide Feedback</IonButton>
                  </p>
                </IonLabel>
              </IonItem>
            </IonList>
          </>
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};
export default LoyaltyCardActivityDetailsPage;
