import {
  IonCard,
  IonCardContent,
  IonText,
  IonNote,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/react';
import { LoyaltyProgramMilestone } from '@src/domain';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import ResponsiveImage from '@src/pages/components/ui/ResponsiveImage';
import styled from 'styled-components';

const StyledCard = styled(IonCard)`
  margin-bottom: 0.5rem;
  height: 120px;

  @media (min-width: 768px) {
    height: 150px;
  }

  @media (min-width: 1024px) {
    height: 120px;
  }
`;

interface LoyaltyRewardCardItemProps {
  loyaltyRewardMilestone: LoyaltyProgramMilestone;
}

const LoyaltyRewardCardItem: React.FC<LoyaltyRewardCardItemProps> = ({
  loyaltyRewardMilestone,
}) => {
  const { formatDate } = useFormatters();
  return (
    <StyledCard
      className='reward-card'
      button
      routerLink={`/rewards/${loyaltyRewardMilestone.loyaltyProgramId}/details/${loyaltyRewardMilestone.id}`}
    >
      <IonCardContent className='ion-no-padding'>
        <IonGrid className='ion-no-padding'>
          <IonRow>
            <IonCol size='4'>
              <div className='ion-flex ion-justify-content-center ion-align-items-center'>
                <ResponsiveImage
                  src={
                    loyaltyRewardMilestone.reward.imageUrl
                      ? loyaltyRewardMilestone.reward.imageUrl
                      : '/images/trove.rewards.3.png'
                  }
                  alt={loyaltyRewardMilestone.reward.name}
                  aspectRatio='SQUARE'
                  containerHeights={{
                    default: '120px',
                    tablet: '150px',
                    desktop: '120px',
                  }}
                />
              </div>
            </IonCol>
            <IonCol size='8' className='ion-padding'>
              <IonText className='text-base' color='dark'>
                {loyaltyRewardMilestone.reward.name}
              </IonText>
              <p>
                <IonText color='medium' className='text-sm line-clamp-2'>
                  {loyaltyRewardMilestone.reward.description}
                </IonText>
              </p>
              <IonNote
                className='text-xs'
                style={{ position: 'absolute', bottom: '.5rem', left: '1rem' }}
                color='medium'
              >
                {loyaltyRewardMilestone.points} points
              </IonNote>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </StyledCard>
  );
};

export default LoyaltyRewardCardItem;
