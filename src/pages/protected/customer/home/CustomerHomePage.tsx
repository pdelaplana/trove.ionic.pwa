import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { LoyaltyCard } from '@src/domain';
import LoyaltyCardsSwiper from '../component/LoyaltyCardsSwiper';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import {
  useFetchAvailableRewardsForCard,
  useFetchLoyaltyCardByCustomerId,
} from '@src/features/queries';
import { useEffect, useState } from 'react';
import LoyaltyRewardsSwiper from '../component/LoyaltyRewardsSwiper';

const CustomerHomePage: React.FC = () => {
  const { customer } = useCustomerProvider();
  const [selectedCard, setSelectedCard] = useState<LoyaltyCard | null>(null);
  const { data } = useFetchLoyaltyCardByCustomerId(customer?.id ?? '');

  const { data: rewards } = useFetchAvailableRewardsForCard(
    selectedCard?.membershipNumber ?? ''
  );

  const onSlideChange = (card: LoyaltyCard) => {
    setSelectedCard(card);
  };

  useEffect(() => {
    if (data?.cards.length) {
      setSelectedCard(data.cards[0]);
    }
  }, [data]);

  return (
    <BasePageLayout
      title='Home'
      showProfileIcon={true}
      showHeader={true}
      showBackButton={false}
    >
      <CenterContainer>
        <LoyaltyCardsSwiper
          loyaltyCards={data?.cards ?? []}
          onCardClick={() => {}}
          onSlideChange={onSlideChange}
        />
        <LoyaltyRewardsSwiper milestones={rewards ?? []} />
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerHomePage;
