import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonNote,
  IonRow,
  IonText,
} from '@ionic/react';
import { CustomerReward } from '@src/domain';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import ResponsiveImage from '@src/pages/components/ui/ResponsiveImage';
import styled from 'styled-components';

const StyledCard = styled(IonCard)`
  margin-bottom: 0.5rem;
  height: 190px;

  @media (min-width: 768px) {
    height: 190px;
  }

  @media (min-width: 1024px) {
    height: 190px;
  }
`;

interface CustomerRewardCardItemProps {
  customerReward: CustomerReward & { businessName: string };
  onClickUrl?: string;
  onClick?: (() => void) | null;
}

const CustomerRewardCardItem: React.FC<CustomerRewardCardItemProps> = ({
  customerReward,
  onClickUrl = null,
  onClick,
}) => {
  const { formatDate, formatDaysUntil } = useFormatters();
  return (
    <StyledCard
      className='reward-card'
      button
      {...(onClickUrl ? { routerLink: onClickUrl } : {})}
      {...(onClick ? { onClick } : {})}
    >
      <IonCardContent className='ion-no-padding'>
        <IonGrid className='ion-no-padding'>
          <IonRow>
            <IonCol size='4'>
              <div className='ion-flex ion-justify-content-center ion-align-items-center'>
                <ResponsiveImage
                  src={
                    customerReward.imageUrl
                      ? customerReward.imageUrl
                      : '/images/trove.rewards.3.png'
                  }
                  alt={customerReward.name}
                  aspectRatio='SQUARE'
                  containerHeights={{
                    default: '190px',
                    tablet: '190px',
                    desktop: '190px',
                  }}
                />
              </div>
            </IonCol>
            <IonCol size='8' className='ion-padding'>
              <IonText className='text-base' color='dark'>
                <h2>{customerReward.businessName}</h2>
                {customerReward.name}
              </IonText>
              <p>
                <IonText color='medium' className='text-sm line-clamp-2'>
                  {customerReward.description}
                </IonText>
              </p>
              <IonNote
                className='text-xs'
                style={{ position: 'absolute', bottom: '.5rem', left: '1rem' }}
                color='primary'
              >
                {`Ends in ${formatDaysUntil(customerReward.expiryDate)} days`}
              </IonNote>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </StyledCard>
  );
};

export default CustomerRewardCardItem;
