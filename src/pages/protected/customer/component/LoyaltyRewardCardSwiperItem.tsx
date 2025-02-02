import { IonCard, IonCardContent, IonText, IonNote } from '@ionic/react';
import { LoyaltyProgramMilestone } from '@src/domain';
import ResponsiveImage from '@src/pages/components/ui/ResponsiveImage';
import styled from 'styled-components';

const StyledCard = styled(IonCard)`
  margin-bottom: 3rem;
  height: 250px;
`;

interface LoyaltyRewardCardItemProps {
  loyaltyRewardMilestone: LoyaltyProgramMilestone;
}

const LoyaltyRewardCardSwiperItem: React.FC<LoyaltyRewardCardItemProps> = ({
  loyaltyRewardMilestone,
}) => {
  return (
    <StyledCard className='reward-card' button>
      <ResponsiveImage
        src={
          loyaltyRewardMilestone.reward.imageUrl
            ? loyaltyRewardMilestone.reward.imageUrl
            : '/images/trove.rewards.3.png'
        }
        alt={loyaltyRewardMilestone.reward.name}
        aspectRatio='LANDSCAPE'
        containerHeights={{
          default: '100px',
          tablet: '150px',
          desktop: '150px',
        }}
      />

      <IonCardContent>
        <IonText className='text-base' color='dark'>
          {loyaltyRewardMilestone.reward.name}
        </IonText>
      </IonCardContent>
      <IonNote style={{ position: 'absolute', bottom: '.45rem', left: '1rem' }}>
        {loyaltyRewardMilestone.points} points
      </IonNote>
    </StyledCard>
  );
};

export default LoyaltyRewardCardSwiperItem;
