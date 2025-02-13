import { LoyaltyProgramMilestone } from '@src/domain';
import { Swiper } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import { IonRouterLink } from '@ionic/react';
import LoyaltyRewardCardSwiperItem from './LoyaltyRewardCardSwiperItem';
import { useDiscoverRewardsDetailsModal } from '../discover/components/DiscoverRewardsDetailsModal';

interface LoyaltyRewardsSwiperProps {
  milestones: Array<
    LoyaltyProgramMilestone & { businessName: string; loyaltyCardId: string }
  >;
}

const LoyaltyRewardsSwiper: React.FC<LoyaltyRewardsSwiperProps> = ({
  milestones,
}) => {
  const { open: openRewardDetailsModal } = useDiscoverRewardsDetailsModal();

  return (
    <>
      <div className='ion-pa dding-start ion-padding-end  ion-flex ion-justify-content-between ion-align-items-baseline'>
        <h3>Discover Rewards</h3>
        <IonRouterLink routerLink={`/discover`}>View all rewards</IonRouterLink>
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
            <LoyaltyRewardCardSwiperItem
              loyaltyRewardMilestone={milestone}
              onClick={() => openRewardDetailsModal(milestone)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default LoyaltyRewardsSwiper;
