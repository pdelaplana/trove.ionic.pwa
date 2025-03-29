import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import { useFetchAvailableRewardsForCustomer } from '@src/features/queries';
import LoyaltyRewardCardItem from '../component/LoyaltyRewardCardItem';

interface DiscoverRewardsPageProps {}
const DiscoverRewardsPage: React.FC<DiscoverRewardsPageProps> = ({}) => {
  const { customer } = useCustomerProvider();

  const { data: milestoneRewards } = useFetchAvailableRewardsForCustomer(
    customer?.id ?? ''
  );

  return (
    <BasePageLayout
      title='Discover'
      showProfileIcon={true}
      showHeader={true}
      showLogo={false}
      showBackButton={false}
    >
      <CenterContainer>
        <div className='ion-margin'>Discover Rewards</div>
        {milestoneRewards?.map((milestone) => (
          <LoyaltyRewardCardItem
            key={milestone.id}
            loyaltyRewardMilestone={milestone}
            onClickUrl={`/discover/rewards/${milestone.businessId}/${milestone.loyaltyProgramId}/${milestone.id}`}
          />
        ))}
      </CenterContainer>
    </BasePageLayout>
  );
};
export default DiscoverRewardsPage;
