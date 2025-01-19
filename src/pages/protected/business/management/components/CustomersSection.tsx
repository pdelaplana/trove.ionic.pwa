import { IonList, IonItem, IonIcon, IonLabel } from '@ionic/react';
import { personAddOutline, peopleOutline, walletOutline } from 'ionicons/icons';

const CustomersSection = () => {
  return (
    <>
      <div className='ion-padding'>Customers</div>
      <IonList className='ion-outline'>
        <IonItem
          lines='none'
          detail={true}
          routerLink='/manage/customers/enroll'
        >
          <IonIcon slot='start' icon={personAddOutline} color='primary' />
          <IonLabel>
            <h2>Enroll Customer</h2>
            <p>Enroll a new customer to your loyalty program.</p>
          </IonLabel>
        </IonItem>

        <IonItem lines='none' button detail routerLink='/manage/customers/earn'>
          <IonIcon src={walletOutline} slot='start' color='primary'></IonIcon>
          <IonLabel>
            <h2>Add Loyalty Points</h2>
            <p>Add loyalty points for purchases made by your customer</p>
          </IonLabel>
        </IonItem>
        <IonItem lines='none' detail={true} routerLink='/manage/customers'>
          <IonIcon slot='start' icon={peopleOutline} color='primary' />
          <IonLabel>
            <h2>View Customers</h2>
            <p>View and manage your enrolled customers.</p>
          </IonLabel>
        </IonItem>
      </IonList>
    </>
  );
};

export default CustomersSection;
