import { LoyaltyCard } from '@src/domain';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import LoyaltyCardItem from './LoyaltyCardItem';
import { useLoyaltyCardModal } from '../loyaltyCard/LoyaltyCardModal';

interface LoyaltyCardsSwiperProps {
  loyaltyCards: LoyaltyCard[];
  onCardClick: (card: LoyaltyCard) => void;
  onSlideChange?: (card: LoyaltyCard) => void;
}

const LoyaltyCardsSwiper: React.FC<LoyaltyCardsSwiperProps> = ({
  loyaltyCards,
  onSlideChange,
}) => {
  const { open } = useLoyaltyCardModal();
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
          <LoyaltyCardItem
            loyaltyCard={card}
            onClickUrl={`/card/${card.id}`}
            //onClick={() => open(card)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default LoyaltyCardsSwiper;
