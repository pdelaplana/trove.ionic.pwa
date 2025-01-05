import { IonList, IonItem, IonIcon, IonLabel } from '@ionic/react';
import {
  businessOutline,
  locationOutline,
  timeOutline,
  buildOutline,
} from 'ionicons/icons';

const BusinessSection = () => {
  return (
    <>
      <div className='ion-padding'>Your Business</div>
      <IonList className='ion-outline'>
        <IonItem
          button={true}
          detail={true}
          lines='none'
          routerLink='/manage/business/information'
        >
          <IonIcon
            icon={businessOutline}
            slot='start'
            color='primary'
          ></IonIcon>
          <IonLabel>
            <h2>Basic Information</h2>
            <p>
              Update your business name, contact details, and email to keep
              customer communication seamless.
            </p>
          </IonLabel>
        </IonItem>
        <IonItem
          button={true}
          detail={true}
          lines='none'
          routerLink='/manage/business/address'
        >
          <IonIcon
            icon={locationOutline}
            slot='start'
            color='primary'
          ></IonIcon>
          <IonLabel>
            <h2>Address</h2>
            <p>
              Edit your shop’s location to ensure customers can find you easily.
            </p>
          </IonLabel>
        </IonItem>

        <IonItem
          button={true}
          detail={true}
          lines='none'
          routerLink='/manage/business/hours'
        >
          <IonIcon icon={timeOutline} slot='start' color='primary'></IonIcon>
          <IonLabel>
            <h2>Operating Hours</h2>
            <p>
              Set or update your shop's operating hours to let customers know
              when you're available
            </p>
          </IonLabel>
        </IonItem>
        <IonItem
          button={true}
          detail={true}
          lines='none'
          routerLink='/manage/business/advance'
        >
          <IonIcon icon={buildOutline} slot='start' color='primary'></IonIcon>
          <IonLabel>
            <h2>Regional Settings</h2>
            <p>Make changes specific to the region where you do business.</p>
          </IonLabel>
        </IonItem>
      </IonList>
    </>
  );
};
export default BusinessSection;
