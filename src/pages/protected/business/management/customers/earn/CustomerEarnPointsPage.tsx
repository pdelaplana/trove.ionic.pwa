import { IonItem, IonLabel, IonList } from '@ionic/react';
import { InputFormField } from '@src/pages/components/form';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import ActionButton from '@src/pages/components/ui/ActionButton';

const CustomerEarnPointsPage = () => {
  return (
    <BasePageLayout title='Add Points' defaultBackButtonHref='/manage/'>
      <CenterContainer>
        <div className='ion-margin'>
          <h2>Add Points</h2>
          <p>Add loyalty points for purchases made by your customer.</p>
        </div>
        <IonList lines='none'>
          <IonItem>
            <IonLabel>
              <InputFormField
                label='Customer Membership No, Phone No, or Email'
                placeholder='Provide a membership number, phone number, or email to identify the customer'
                name='customerPhoneNumber'
                type='tel'
                fill='outline'
              />
            </IonLabel>
          </IonItem>
        </IonList>
        <ActionButton
          label='Search'
          expand='full'
          className='ion-margin'
          isLoading={false}
          isDisabled={false}
        />
      </CenterContainer>
    </BasePageLayout>
  );
};
export default CustomerEarnPointsPage;
