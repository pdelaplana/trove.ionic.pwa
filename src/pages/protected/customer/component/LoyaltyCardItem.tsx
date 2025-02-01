import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/react';
import { LoyaltyCard } from '@src/domain';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import ResponsiveImage from '@src/pages/components/ui/ResponsiveImage';

interface LoyaltyCardItemProps {
  loyaltyCard: LoyaltyCard;
}
const LoyaltyCardItem: React.FC<LoyaltyCardItemProps> = ({ loyaltyCard }) => {
  const { formatDate, formatNumber } = useFormatters();
  return (
    <IonCard color='primary' button={true}>
      <ResponsiveImage
        src={'/public/images/trove.business.png'}
        alt={loyaltyCard.businessName}
        aspectRatio='LANDSCAPE'
        containerHeights={{
          default: '150px',
          tablet: '200px',
          desktop: '250px',
        }}
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
            <IonCol size='6' className='ion-text-start'>
              <p>Points Balance</p>
              <h2>{formatNumber(loyaltyCard.points)}</h2>
            </IonCol>
            <IonCol size='6' className='ion-text-end'>
              <p>Tier</p>
              <h2>{loyaltyCard.tierName}</h2>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default LoyaltyCardItem;
