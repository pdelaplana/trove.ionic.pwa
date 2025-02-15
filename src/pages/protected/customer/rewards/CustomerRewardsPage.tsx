import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import CustomerRewardCardItem from '../component/CustomerRewardCardItem';
import useFetchRewardsClaimedByCustomer from '@src/features/queries/loyaltyRewards/useFetchRewardsClaimedByCustomer';
import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSegmentView,
  IonSegmentContent,
} from '@ionic/react';
import { useCustomerRewardsDetailsModal } from './components/CustomerRewardsDetailsModal';
import { useCustomerRewardQrCodeModal } from './components/CustomerRewardQrCodeModal';

interface CustomerRewardsPageProps {}
const CustomerRewardsPage: React.FC<CustomerRewardsPageProps> = ({}) => {
  const { customer } = useCustomerProvider();
  const { data: customerRewards } = useFetchRewardsClaimedByCustomer(
    customer?.id || ''
  );

  const { open: openRewardDetailsModal } = useCustomerRewardsDetailsModal();

  return (
    <BasePageLayout
      title='Rewards'
      showProfileIcon={true}
      showHeader={true}
      showLogo={false}
      showBackButton={false}
    >
      <CenterContainer>
        <IonSegment value='default'>
          <IonSegmentButton value='default' contentId='default'>
            <IonLabel>Available</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='segment' contentId='expired'>
            <IonLabel>Used & Expired</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonSegmentView>
          <IonSegmentContent id='default'>
            <div className='ion-margin'></div>
            {customerRewards?.map((customerReward) => (
              <CustomerRewardCardItem
                key={customerReward.id}
                customerReward={customerReward}
                onClickUrl={`/rewards/${customerReward.loyaltyCardId}/${customerReward.id}`}
                //onClick={() => openRewardQrCodeModal(customerReward)}
                //onClick={() => openRewardDetailsModal(customerReward)}
              />
            ))}
          </IonSegmentContent>
          <IonSegmentContent id='expired'>
            <div className='ion-padding'>
              <h2></h2>
            </div>
          </IonSegmentContent>
        </IonSegmentView>
      </CenterContainer>
    </BasePageLayout>
  );
};
export default CustomerRewardsPage;
