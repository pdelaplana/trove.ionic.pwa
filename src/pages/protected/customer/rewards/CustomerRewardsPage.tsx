import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import { useParams } from 'react-router-dom';
import {
  useFetchAvailableRewardsForCard,
  useFetchAvailableRewardsForCustomer,
} from '@src/features/queries';
import LoyaltyRewardCardItem from '../component/LoyaltyRewardCardItem';

interface CustomerRewardsPageProps {}
const CustomerRewardsPage: React.FC<CustomerRewardsPageProps> = ({}) => {
  const { customer } = useCustomerProvider();

  const { membershipNo } = useParams<{ membershipNo: string }>();

  const { data: milestoneRewards } = useFetchAvailableRewardsForCustomer(
    customer?.id ?? ''
  );

  return (
    <BasePageLayout title='Rewards' showProfileIcon={true} showHeader={true}>
      <CenterContainer>
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
export default CustomerRewardsPage;
