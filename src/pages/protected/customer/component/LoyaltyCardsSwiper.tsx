import { LoyaltyCard } from '@src/domain';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import LoyaltyCardItem from './LoyaltyCardItem';

interface LoyaltyCardsSwiperProps {
  loyaltyCards: LoyaltyCard[];
  onCardClick: (card: LoyaltyCard) => void;
}

const LoyaltyCardsSwiper: React.FC<LoyaltyCardsSwiperProps> = ({
  loyaltyCards,
}) => {
  return (
    <Swiper
      spaceBetween={30}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
    >
      {loyaltyCards.map((card) => (
        <SwiperSlide key={card.id}>
          <div style={{ marginBottom: '3rem' }}>
            <LoyaltyCardItem loyaltyCard={card} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default LoyaltyCardsSwiper;
