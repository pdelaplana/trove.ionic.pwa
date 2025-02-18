import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSegmentView,
  IonSegmentContent,
} from '@ionic/react';

import AvailableCustomerRewardsList from './components/AvailableCustomerRewardsList';
import UsedAndExpiredCustomerRewardsList from './components/UsedAndExpiredCustomerRewardsList';

interface CustomerRewardsPageProps {}
const CustomerRewardsPage: React.FC<CustomerRewardsPageProps> = ({}) => {
  const { customer } = useCustomerProvider();

  return (
    <BasePageLayout
      title='Rewards'
      showProfileIcon={true}
      showHeader={true}
      showLogo={false}
      showBackButton={false}
    >
      <CenterContainer>
        <IonSegment value='default' mode='md'>
          <IonSegmentButton value='default' contentId='default'>
            <IonLabel>Available</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='segment' contentId='expired'>
            <IonLabel>Used & Expired</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonSegmentView>
          <IonSegmentContent id='default'>
            <AvailableCustomerRewardsList customerId={customer?.id ?? ''} />
          </IonSegmentContent>
          <IonSegmentContent id='expired'>
            <UsedAndExpiredCustomerRewardsList
              customerId={customer?.id ?? ''}
            />
          </IonSegmentContent>
        </IonSegmentView>
      </CenterContainer>
    </BasePageLayout>
  );
};
export default CustomerRewardsPage;
