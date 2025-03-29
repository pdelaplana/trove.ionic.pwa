import { IonCard, IonCardContent, IonText, IonNote } from '@ionic/react';
import { LoyaltyProgramMilestone } from '@src/domain';
import ResponsiveImage2 from '@src/pages/components/ui/ResponsiveImage2';
import styled from 'styled-components';

const StyledCard = styled(IonCard)`
  margin-bottom: 3rem;
  height: 250px;
`;

interface LoyaltyRewardCardItemProps {
  loyaltyRewardMilestone: LoyaltyProgramMilestone;
  onClickUrl?: string;
  onClick?: (() => void) | null;
}

const LoyaltyRewardCardSwiperItem: React.FC<LoyaltyRewardCardItemProps> = ({
  loyaltyRewardMilestone,
  onClick,
  onClickUrl,
}) => {
  return (
    <StyledCard
      className='reward-card'
      button
      {...(onClick ? { onClick } : {})}
      {...(onClickUrl ? { routerLink: onClickUrl } : {})}
    >
      <ResponsiveImage2
        src={
          loyaltyRewardMilestone.reward.imageUrl
            ? loyaltyRewardMilestone.reward.imageUrl
            : '/images/trove.rewards.3.png'
        }
        alt={loyaltyRewardMilestone.reward.name}
        aspectRatio='16/8'
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
