import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import { useParams } from 'react-router-dom';
import { useFetchAvailableRewardsForCustomer } from '@src/features/queries';
import LoyaltyRewardCardItem from '../component/LoyaltyRewardCardItem';

interface DiscoverRewardsPageProps {}
const DiscoverRewardsPage: React.FC<DiscoverRewardsPageProps> = ({}) => {
  const { customer } = useCustomerProvider();

  const { membershipNo } = useParams<{ membershipNo: string }>();

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
        <div className='ion-padding'>
          <h2>Discover Rewards</h2>
        </div>
        {milestoneRewards?.map((milestone) => (
          <LoyaltyRewardCardItem
            key={milestone.id}
            loyaltyRewardMilestone={milestone}
          />
        ))}
      </CenterContainer>
    </BasePageLayout>
  );
};
export default DiscoverRewardsPage;
