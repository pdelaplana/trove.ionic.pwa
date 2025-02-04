import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { LoyaltyCard } from '@src/domain';
import LoyaltyCardsSwiper from '../component/LoyaltyCardsSwiper';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import { useFetchAvailableRewardsForCard } from '@src/features/queries';
import { useEffect } from 'react';
import LoyaltyRewardsSwiper from '../component/LoyaltyRewardsSwiper';

const CustomerHomePage: React.FC = () => {
  const { loyaltyCards, setCurrentLoyaltyCard, getCurrentLoyaltyCard } =
    useCustomerProvider();

  const { data: rewards } = useFetchAvailableRewardsForCard(
    getCurrentLoyaltyCard()?.membershipNumber ?? ''
  );

  const onSlideChange = (card: LoyaltyCard) => {
    setCurrentLoyaltyCard(card);
  };

  useEffect(() => {
    if (loyaltyCards?.length) {
      setCurrentLoyaltyCard(loyaltyCards[0]);
    }
  }, [loyaltyCards]);

  return (
    <BasePageLayout
      title='Customer'
      showProfileIcon={true}
      showHeader={true}
      showBackButton={false}
    >
      <CenterContainer>
        <LoyaltyCardsSwiper
          loyaltyCards={loyaltyCards ?? []}
          onCardClick={() => {}}
          onSlideChange={onSlideChange}
        />
        <LoyaltyRewardsSwiper milestones={rewards ?? []} />
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerHomePage;
