import { LoyaltyProgramMilestone } from '@src/domain';
import { Swiper } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import { IonRouterLink } from '@ionic/react';
import LoyaltyRewardCardSwiperItem from './LoyaltyRewardCardSwiperItem';

interface LoyaltyRewardsSwiperProps {
  milestones: LoyaltyProgramMilestone[];
}

const LoyaltyRewardsSwiper: React.FC<LoyaltyRewardsSwiperProps> = ({
  milestones,
}) => {
  return (
    <>
      <div className='ion-padding-start ion-padding-end  ion-flex ion-justify-content-between ion-align-items-baseline'>
        <h3>Available Rewards</h3>
        <IonRouterLink routerLink={`/rewards`}>View all rewards</IonRouterLink>
      </div>
      <Swiper
        slidesPerView={2}
        spaceBetween={1}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        style={{ paddingTop: '0px' }}
      >
        {milestones.map((milestone) => (
          <SwiperSlide key={milestone.id}>
            <LoyaltyRewardCardSwiperItem loyaltyRewardMilestone={milestone} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default LoyaltyRewardsSwiper;
