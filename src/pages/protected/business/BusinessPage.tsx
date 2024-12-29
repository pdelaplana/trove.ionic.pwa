import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonIcon,
  IonContent,
} from '@ionic/react';
import { useAuth } from '@src/features/auth/AuthProvider';
import { personOutline } from 'ionicons/icons';
import { PropsWithChildren } from 'react';

interface BusinessPageProps extends PropsWithChildren {
  title?: string;
  showHeader?: boolean;
  showProfileIcon?: boolean;
  children: React.ReactNode;
  defaultBackButtonHref?: string;
}

const BusinessPage: React.FC<BusinessPageProps> = ({
  children,
  defaultBackButtonHref,
  showHeader = true,
  showProfileIcon = true,
  title,
}) => {
  const { user } = useAuth();
  return (
    <IonPage>
      <IonHeader className='ion-no-border' hidden={!showHeader}>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref={defaultBackButtonHref} />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          {showProfileIcon && (
            <IonButtons slot='end'>
              <IonButton routerLink='/profile'>
                <IonIcon slot='icon-only' icon={personOutline} size='default' />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>{children}</IonContent>
    </IonPage>
  );
};

export default BusinessPage;
