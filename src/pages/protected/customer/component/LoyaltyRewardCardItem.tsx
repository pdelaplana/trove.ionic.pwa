import {
  IonCard,
  IonCardContent,
  IonText,
  IonNote,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
} from '@ionic/react';
import { LoyaltyProgramMilestone } from '@src/domain';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import { Gap, PositionedDiv } from '@src/pages/components/layouts';
import ResponsiveImage2 from '@src/pages/components/ui/ResponsiveImage2';
import { timeOutline } from 'ionicons/icons';
import styled from 'styled-components';

const StyledCard = styled(IonCard)``;

interface LoyaltyRewardCardItemProps {
  loyaltyRewardMilestone: LoyaltyProgramMilestone;
  onClickUrl?: string;
  onClick?: (() => void) | null;
}

const LoyaltyRewardCardItem: React.FC<LoyaltyRewardCardItemProps> = ({
  loyaltyRewardMilestone,
  onClickUrl,
  onClick,
}) => {
  const { formatDaysUntil } = useFormatters();

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
                    loyaltyRewardMilestone.reward.imageUrl
                      ? loyaltyRewardMilestone.reward.imageUrl
                      : '/images/trove.rewards.3.png'
                  }
                  alt={loyaltyRewardMilestone.reward.name}
                  aspectRatio='16/9'
                />
              </div>
            </IonCol>
            <IonCol size='7'>
              <Gap size={'.75rem'} />
              <IonText color='dark' className='line-clamp-2 text-weight-bold'>
                <h2>{loyaltyRewardMilestone.reward.name}</h2>
              </IonText>

              <PositionedDiv bottom='5px' right='10px'>
                <IonNote color='medium'>
                  {loyaltyRewardMilestone.points} points
                </IonNote>
              </PositionedDiv>

              <PositionedDiv bottom='5px' left='1px'>
                <IonNote color='primary'>
                  <IonIcon icon={timeOutline} size='medium' />
                  {` Ends in ${formatDaysUntil(
                    loyaltyRewardMilestone.reward.validUntilDate
                  )} `}
                  days
                </IonNote>
              </PositionedDiv>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </StyledCard>
  );
};

export default LoyaltyRewardCardItem;
