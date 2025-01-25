import { IonItem, IonLabel, IonList } from '@ionic/react';
import { LoyaltyCardTransaction } from '@src/domain';
import { CustomerEarnPointsPageState } from '../CustomerEarnPointsPage';
import ActionButton from '@src/pages/components/ui/ActionButton';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import { useBusiness } from '@src/features/business/BusinessProvider';

interface CustomerLoyaltyCardAddTransactionResultProps {
  loyaltyCardTransaction: LoyaltyCardTransaction | null;
  onPageStateChange: (pageState: CustomerEarnPointsPageState) => void;
}

const CustomerLoyaltyCardAddTransactionResult: React.FC<
  CustomerLoyaltyCardAddTransactionResultProps
> = ({ loyaltyCardTransaction, onPageStateChange }) => {
  const { business } = useBusiness();
  const { formatCurrency, formatNumber } = useFormatters();
  return (
    <>
      <div className='ion-margin'>
        <h2>Transaction Completed</h2>
        <p>Loyalty points have been earned by this customer</p>
      </div>
      <IonList>
        <IonItem>
          <IonLabel>
            <h2>Loyalty Program</h2>
            <p>{loyaltyCardTransaction?.loyaltyProgramName}</p>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>Amount</h2>
            <p>
              {formatCurrency(
                loyaltyCardTransaction?.finalAmount,
                business?.currency
              )}
            </p>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>Points Earned</h2>
            <p>{formatNumber(loyaltyCardTransaction?.totalPoints)}</p>
          </IonLabel>
        </IonItem>
      </IonList>
      <div className='ion-flex ion-justify-content-between'>
        <ActionButton
          label='Search Again'
          fill='clear'
          onClick={() => onPageStateChange(CustomerEarnPointsPageState.SEARCH)}
          isLoading={false}
          isDisabled={false}
        />
      </div>
    </>
  );
};

export default CustomerLoyaltyCardAddTransactionResult;
