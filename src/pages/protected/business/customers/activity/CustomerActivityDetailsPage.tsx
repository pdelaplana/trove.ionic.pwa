import { IonItem, IonLabel, IonList } from '@ionic/react';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { useFetchLoyaltyCardTransactionById } from '@src/features/queries';
import useFormatters, {
  DateFormatString,
} from '@src/pages/components/hooks/useFormatters';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useParams } from 'react-router-dom';

const CustomerActivityDetailsPage: React.FC = () => {
  const { id, transactionId } = useParams<{
    id: string;
    transactionId: string;
  }>();

  const { business } = useBusiness();
  const { data: transaction } = useFetchLoyaltyCardTransactionById(
    transactionId,
    business?.id ?? ''
  );
  const { formatDate, formatCurrency, formatNumber } = useFormatters();

  return (
    <BasePageLayout
      title={formatDate(
        transaction?.transactionDate,
        DateFormatString.EEE_MM_DD_YYYY
      )}
      defaultBackButtonHref={`/customers/${id}/activity`}
    >
      <CenterContainer>
        <IonList lines='full' className='ion-margin-top'>
          <IonItem>
            <IonLabel>
              <h2>Date</h2>
              <p>{formatDate(transaction?.transactionDate)}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Member</h2>
              <p>
                {`${transaction?.customerName} (${transaction?.customerEmail})`}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Member No</h2>
              <p>{transaction?.membershipNumber}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Business </h2>
              <p>
                {transaction?.businessName} ({transaction?.businessEmail})
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Purchase Amount</h2>
              <p>
                {formatCurrency(
                  transaction?.purchaseAmount,
                  transaction?.currency
                )}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Discount Amount</h2>
              <p>
                {formatCurrency(
                  transaction?.discountAmount,
                  transaction?.currency
                )}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Final Amount</h2>
              <p>
                {formatCurrency(
                  transaction?.finalAmount,
                  transaction?.currency
                )}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Points this Pruchase</h2>
              <p>{formatNumber(transaction?.earnedPoints)} pts</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Bonus Points</h2>
              <p>{formatNumber(transaction?.bonusPoints)} pts</p>
            </IonLabel>
          </IonItem>
          <IonItem lines='none'>
            <IonLabel>
              <h2>Total Points Earned</h2>
              <p>{formatNumber(transaction?.totalPoints)} pts</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerActivityDetailsPage;
