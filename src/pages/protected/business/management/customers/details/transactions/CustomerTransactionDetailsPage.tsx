import { IonItem, IonLabel, IonList } from '@ionic/react';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { useFetchLoyaltyCardTransactionById } from '@src/features/queries';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface CustomerTransactionDetailsPageValues {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  businessId: string;
  businessName: string;
  businessEmail: string;
  loyaltyCardId: string;
  membershipNumber: string;
  loyaltyProgramId: string;
  loyaltyProgramName: string;
  loyaltyProgramTierId?: string;
  loyaltyProgramTierName?: string;

  transactionDate: Date;

  purchaseAmount: number;
  discountAmount: number;
  finalAmount: number;

  earnedPoints: number;
  bonusPoints: number;
  redeemedPoints: number;
  totalPoints: number;

  rewardsEarned: string[];
}

const CustomerTransactionDetailsPage: React.FC = () => {
  const { id, customerId, transactionId } = useParams<{
    id: string;
    customerId: string;
    transactionId: string;
  }>();

  const { business } = useBusiness();
  const { data } = useFetchLoyaltyCardTransactionById(
    transactionId,
    business?.id ?? ''
  );
  const { formatDate, formatCurrency, formatNumber } = useFormatters();

  const [
    customerTransactionDetailsPageValues,
    setCustomerTransactionDetailsPageValues,
  ] = useState<CustomerTransactionDetailsPageValues>();

  useEffect(() => {
    if (data) {
      setCustomerTransactionDetailsPageValues(data);
    }
  }, [data]);

  return (
    <BasePageLayout
      title='Transaction Details'
      defaultBackButtonHref={`/manage/customers/${id}/transactions/${customerId}`}
    >
      <CenterContainer>
        <div className='ion-margin'>Transaction Details</div>
        <IonList lines='full' className='ion-margin'>
          <IonItem>
            <IonLabel>
              <h2>Date</h2>
              <p>
                {formatDate(
                  customerTransactionDetailsPageValues?.transactionDate ??
                    new Date()
                )}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Member</h2>
              <p>
                {`${customerTransactionDetailsPageValues?.customerName} (${customerTransactionDetailsPageValues?.customerEmail})`}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Member No</h2>
              <p>{customerTransactionDetailsPageValues?.membershipNumber}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Business </h2>
              <p>
                {customerTransactionDetailsPageValues?.businessName} (
                {customerTransactionDetailsPageValues?.businessEmail})
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Purchase Amount</h2>
              <p>
                {formatCurrency(
                  customerTransactionDetailsPageValues?.purchaseAmount,
                  business?.currency
                )}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Discount Amount</h2>
              <p>
                {formatCurrency(
                  customerTransactionDetailsPageValues?.discountAmount,
                  business?.currency
                )}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Final Amount</h2>
              <p>
                {formatCurrency(
                  customerTransactionDetailsPageValues?.finalAmount,
                  business?.currency
                )}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Points this Pruchase</h2>
              <p>
                {formatNumber(
                  customerTransactionDetailsPageValues?.earnedPoints
                )}{' '}
                pts
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Bonus Points</h2>
              <p>
                {formatNumber(
                  customerTransactionDetailsPageValues?.bonusPoints
                )}{' '}
                pts
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Total Points Earned</h2>
              <p>
                {formatNumber(
                  customerTransactionDetailsPageValues?.totalPoints
                )}{' '}
                pts
              </p>
            </IonLabel>
          </IonItem>
        </IonList>
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerTransactionDetailsPage;
