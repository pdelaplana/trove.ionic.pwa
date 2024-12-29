import { CenterContainer, ContentSection } from '@src/pages/components/layouts';
import BusinessPage from '../BusinessPage';
import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import {
  businessOutline,
  locationOutline,
  timeOutline,
  addCircleOutline,
  buildOutline,
  ribbonOutline,
} from 'ionicons/icons';
import { useBusiness } from '@src/features/business/BusinessProvider';

const BusinessSettingsPage: React.FC = () => {
  const { business } = useBusiness();
  return (
    <BusinessPage title='Settings' showProfileIcon={true} showHeader={true}>
      <CenterContainer>
        <div className='ion-padding'>Your Business</div>
        <IonList className='ion-outline'>
          <IonItem
            button={true}
            detail={true}
            lines='none'
            routerLink='/settings/business/information'
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
            routerLink='/settings/business/address'
          >
            <IonIcon
              icon={locationOutline}
              slot='start'
              color='primary'
            ></IonIcon>
            <IonLabel>
              <h2>Address</h2>
              <p>
                Edit your shop’s location to ensure customers can find you
                easily.
              </p>
            </IonLabel>
          </IonItem>

          <IonItem
            button={true}
            detail={true}
            lines='none'
            routerLink='/settings/business/hours'
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
            routerLink='/settings/business/advance'
          >
            <IonIcon icon={buildOutline} slot='start' color='primary'></IonIcon>
            <IonLabel>
              <h2>Regional Settings</h2>
              <p>Make changes specific to the region where you do business.</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <div className='ion-padding'>Loyalty Programs</div>
        <IonList className='ion-outline'>
          {business?.loyaltyPrograms.map((program) => (
            <IonItem
              button={true}
              detail={true}
              lines='none'
              routerLink={`/settings/loyalty/${program.id}`}
            >
              <IonIcon
                icon={ribbonOutline}
                slot='start'
                color='primary'
              ></IonIcon>
              <IonLabel>
                <h2>{program.name}</h2>
                <p>
                  {program.type} - {program.pointsPerSpend} points per spend
                </p>
              </IonLabel>
            </IonItem>
          ))}

          <IonItem
            button={true}
            detail={true}
            lines='none'
            routerLink='/settings/loyalty/new'
          >
            <IonIcon
              icon={addCircleOutline}
              slot='start'
              color='primary'
            ></IonIcon>
            <IonLabel>
              <h2>Add New Program</h2>
              <p>Create a new loyalty program and reward your customers</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </CenterContainer>
    </BusinessPage>
  );
};

export default BusinessSettingsPage;
