import { LoyaltyCard } from '@src/domain';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import LoyaltyCardItem from './LoyaltyCardItem';

interface LoyaltyCardsSwiperProps {
  loyaltyCards: LoyaltyCard[];
  onCardClick: (card: LoyaltyCard) => void;
  onSlideChange?: (card: LoyaltyCard) => void;
}

const LoyaltyCardsSwiper: React.FC<LoyaltyCardsSwiperProps> = ({
  loyaltyCards,
  onSlideChange,
}) => {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      onSlideChange={(swiper: SwiperType) => {
        const activeCard = loyaltyCards[swiper.activeIndex];
        onSlideChange?.(activeCard);
      }}
    >
      {loyaltyCards.map((card) => (
        <SwiperSlide key={card.id}>
          <LoyaltyCardItem loyaltyCard={card} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default LoyaltyCardsSwiper;
