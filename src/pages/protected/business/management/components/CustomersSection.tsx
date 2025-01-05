import { IonList, IonItem, IonIcon, IonLabel } from '@ionic/react';
import { personAddOutline, peopleOutline } from 'ionicons/icons';

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
