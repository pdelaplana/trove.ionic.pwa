import {
  BasePageLayout,
  CenterContainer,
  ContentSection,
} from '@src/pages/components/layouts';
import { LoyaltyCard } from '@src/domain';
import LoyaltyCardsSwiper from '../component/LoyaltyCardsSwiper';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import { useFetchAvailableRewardsForCard } from '@src/features/queries';
import { useEffect } from 'react';
import LoyaltyRewardsSwiper from '../component/LoyaltyRewardsSwiper';
import { IonText } from '@ionic/react';
import { useAuth } from '@src/features/auth/AuthProvider';

const CustomerHomePage: React.FC = () => {
  const { user } = useAuth();
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
      title='Home'
      showProfileIcon={true}
      showHeader={true}
      showBackButton={false}
      showTitle={true}
      showSecondaryHeader={true}
    >
      <CenterContainer>
        <ContentSection>
          <div className='ion-flex ion-justify-content-between ion-align-items-baseline ion-margin'>
            <IonText color=''>
              Welcome back, <br />
              <span className='text-3xl'>
                {user?.displayName?.split(' ')[0]} !
              </span>
            </IonText>
          </div>
        </ContentSection>
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
