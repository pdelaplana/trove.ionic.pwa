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
import { Gap, PositionedDiv } from '@src/pages/components/layouts';
import ResponsiveImage from '@src/pages/components/ui/ResponsiveImage';
import ResponsiveImage2 from '@src/pages/components/ui/ResponsiveImage2';

import styled from 'styled-components';

const StyledCard = styled(IonCard)``;

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
      button
      {...(onClickUrl ? { routerLink: onClickUrl } : {})}
      {...(onClick ? { onClick } : {})}
    >
      <IonCardContent className='ion-no-padding'>
        <IonGrid className='ion-no-padding'>
          <IonRow>
            <IonCol size='5'>
              <div className='ion-margin'>
                <ResponsiveImage2
                  src={
                    customerReward.imageUrl
                      ? customerReward.imageUrl
                      : '/images/trove.rewards.3.png'
                  }
                  alt={customerReward.name}
                  aspectRatio='16/9'
                />
              </div>
            </IonCol>
            <IonCol size='7'>
              <Gap size={'.75rem'} />
              <IonText color='dark' className='text-clamp-2 text-weight-bold'>
                <h2>{customerReward.businessName}</h2>
                <h4>{customerReward.name}</h4>
              </IonText>

              <PositionedDiv className='text-xs' color='primary' bottom='5px'>
                <IonNote>
                  <IonText color='medium'>
                    {customerReward.redeemedDate
                      ? `Redeemed on ${formatDate(customerReward.redeemedDate)}`
                      : `Ends in ${formatDaysUntil(customerReward.expiryDate)} days`}
                  </IonText>
                </IonNote>
              </PositionedDiv>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </StyledCard>
  );
};

export default CustomerRewardCardItem;
