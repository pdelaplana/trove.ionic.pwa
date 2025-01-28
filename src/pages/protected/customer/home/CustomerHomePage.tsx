import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import LoyaltyCardItem from '../component/LoyaltyCardItem';
import { LoyaltyCard } from '@src/domain';
import LoyaltyCardsSwiper from '../component/LoyaltyCardsSwiper';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import { useFetchLoyaltyCardByCustomerId } from '@src/features/queries';

const CustomerHomePage: React.FC = () => {
  const { customer } = useCustomerProvider();

  const { data } = useFetchLoyaltyCardByCustomerId(customer?.id ?? '');

  return (
    <BasePageLayout title='Home' showProfileIcon={true} showHeader={true}>
      <CenterContainer>
        <LoyaltyCardsSwiper
          loyaltyCards={data?.cards ?? []}
          onCardClick={() => {}}
        />
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerHomePage;
