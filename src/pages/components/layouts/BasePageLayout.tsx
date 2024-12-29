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
import { personOutline, exitOutline } from 'ionicons/icons';
import { PropsWithChildren } from 'react';

interface BasePageProps extends PropsWithChildren {
  title: string;
  showSignoutButton?: boolean;
  showHeader?: boolean;
  showProfileIcon?: boolean;
  children: React.ReactNode;
  defaultBackButtonHref?: string;
}

const BasePageLayout: React.FC<BasePageProps> = ({
  title,
  children,
  showSignoutButton = false,
  showProfileIcon = true,
  showHeader = true,
  defaultBackButtonHref,
}) => {
  const { signout } = useAuth();

  return (
    <IonPage>
      <IonHeader className='ion-no-border' hidden={!showHeader}>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref={defaultBackButtonHref} />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot='end'>
            {showProfileIcon && (
              <IonButton routerLink='/profile'>
                <IonIcon slot='icon-only' icon={personOutline} size='default' />
              </IonButton>
            )}
            {showSignoutButton && (
              <IonButton onClick={signout}>
                <IonIcon slot='icon-only' icon={exitOutline}></IonIcon>
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>{children}</IonContent>
    </IonPage>
  );
};

export default BasePageLayout;
