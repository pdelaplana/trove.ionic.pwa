import CustomerRewardCardItem from '../../component/CustomerRewardCardItem';
import { useFetchExpiredAndUsedRewardsForCustomer } from '@src/features/queries';

interface UsedAndExpiredCustomerRewardsListProps {
  customerId: string;
}
const UsedAndExpiredCustomerRewardsList: React.FC<
  UsedAndExpiredCustomerRewardsListProps
> = ({ customerId }) => {
  const { data: customerRewards } = useFetchExpiredAndUsedRewardsForCustomer(
    customerId || ''
  );
  return (
    <>
      <div className='ion-margin'></div>
      {customerRewards?.map((customerReward) => (
        <CustomerRewardCardItem
          key={customerReward.id}
          customerReward={customerReward}
          onClickUrl={`/rewards/${customerReward.loyaltyCardId}/${customerReward.id}`}
        />
      ))}
    </>
  );
};
export default UsedAndExpiredCustomerRewardsList;
