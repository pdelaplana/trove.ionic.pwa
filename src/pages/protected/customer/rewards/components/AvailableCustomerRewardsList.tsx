import useFetchRewardsClaimedByCustomer from '@src/features/queries/customerRewards/useFetchRewardsClaimedByCustomer';
import CustomerRewardCardItem from '../../component/CustomerRewardCardItem';

interface AvailableCustomerRewardsListProps {
  customerId: string;
}
const AvailableCustomerRewardsList: React.FC<
  AvailableCustomerRewardsListProps
> = ({ customerId }) => {
  const { data: customerRewards } = useFetchRewardsClaimedByCustomer(
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
export default AvailableCustomerRewardsList;
