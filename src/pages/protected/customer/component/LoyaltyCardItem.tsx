import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
  IonText,
} from '@ionic/react';
import { LoyaltyCard } from '@src/domain';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import ResponsiveImage2 from '@src/pages/components/ui/ResponsiveImage2';

interface LoyaltyCardItemProps {
  loyaltyCard?: LoyaltyCard;
  onClickUrl?: string;
  onClick?: (() => void) | null;
}
const LoyaltyCardItem: React.FC<LoyaltyCardItemProps> = ({
  loyaltyCard,
  onClickUrl = null,
  onClick,
}) => {
  const { formatDate, formatNumber } = useFormatters();

  if (!loyaltyCard) {
    return null;
  }

  return (
    <IonCard
      style={{ margin: '0px 10px 40px' }}
      color='primary'
      button={true}
      {...(onClickUrl ? { routerLink: onClickUrl } : {})}
      {...(onClick ? { onClick } : {})}
    >
      <ResponsiveImage2
        src={'/images/trove.business.png'}
        alt={loyaltyCard.businessName}
        aspectRatio='16/8'
      />

      <IonCardHeader>
        <IonCardTitle>{loyaltyCard.businessName}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size='6' className='ion-text-start'>
              <p>Membership Number</p>
              <h2>{loyaltyCard.membershipNumber}</h2>
            </IonCol>
            <IonCol size='6' className='ion-text-end'>
              <p>Member Since</p>
              <h2>{formatDate(loyaltyCard?.membershipDate)}</h2>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size='6' className='ion-text-start ion-padding-top'>
              <p>Points Balance</p>
              <h2>{formatNumber(loyaltyCard.rewardPoints)}</h2>
            </IonCol>
            <IonCol size='6' className='ion-text-end ion-padding-top'>
              {loyaltyCard?.tierId && (
                <>
                  <p>Tier</p>
                  <h2>{loyaltyCard.tierName}</h2>
                </>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default LoyaltyCardItem;
