import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/react';
import { giftOutline, personAddOutline, walletOutline } from 'ionicons/icons';

const BusinessDashboardPage: React.FC = () => {
  return (
    <BasePageLayout
      title='Dashboard'
      showProfileIcon={true}
      showHeader={true}
      showLogo={true}
      showBackButton={false}
    >
      <CenterContainer>
        <IonCard
          button
          //onClick={}
          style={{
            margin: '16px',
            cursor: 'pointer',
          }}
        >
          <IonCardHeader>
            <IonIcon
              icon={giftOutline}
              style={{
                fontSize: '48px',
                color: 'var(--ion-color-primary)',
                marginBottom: '8px',
                position: 'absolute',
                right: 10,
              }}
            />
            <IonCardTitle>Enroll a Customer</IonCardTitle>
            <IonCardSubtitle>Earn rewards on every purchase!</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              Sign up today and enjoy exclusive benefits, discounts, and more.
            </p>
            <IonButton
              color='primary'
              fill='clear'
              onClick={(e) => {
                e.stopPropagation(); // Prevents card click event from triggering
                //handleEnrollClick();
              }}
            >
              Enroll Now
            </IonButton>
          </IonCardContent>
        </IonCard>

        <div className='ion-margin'>Actions</div>
        <IonList lines='none' className='ion-outline ion-margin'>
          <IonItem button detail routerLink='/manage/customers/enroll'>
            <IonIcon
              src={personAddOutline}
              slot='start'
              size='large'
              color='primary'
            ></IonIcon>
            <IonLabel>
              <h2>
                <strong> Enroll a Customer</strong>
              </h2>
              <p>Enroll a new customer to your loyalty program</p>
            </IonLabel>
          </IonItem>
          <IonItem button detail routerLink='/manage/customers/enrol'>
            <IonIcon
              src={walletOutline}
              slot='start'
              size='large'
              color='primary'
            ></IonIcon>
            <IonLabel>
              <h2>
                <strong>Add Loyalty Points</strong>
              </h2>
              <p>Add loyalty points for purchases made by your customer</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </CenterContainer>
    </BasePageLayout>
  );
};

export default BusinessDashboardPage;
