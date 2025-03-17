import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonContent,
  useIonViewWillEnter,
  IonFooter,
} from '@ionic/react';
import { useAuth } from '@src/features/auth/AuthProvider';
import { personOutline, exitOutline } from 'ionicons/icons';
import { PropsWithChildren } from 'react';
import HeaderLogo from '../ui/HeaderLogo';
import { usePrompt } from '../hooks/usePrompt';
import styled from 'styled-components';

interface BasePageProps extends PropsWithChildren {
  title: string;
  showSignoutButton?: boolean;
  showHeader?: boolean;
  showProfileIcon?: boolean;
  showBackButton?: boolean;
  showLogo?: boolean;
  children: React.ReactNode;
  defaultBackButtonHref?: string;
  footer?: React.ReactNode;
}

const CenterTitle = styled.div<{
  addLeftMargin: boolean;
  addRightMargin: boolean;
}>`
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${(props) => (props.addLeftMargin ? '45px' : '0')};
  margin-right: ${(props) => (props.addRightMargin ? '45px' : '0')};
`;

const BasePageLayout: React.FC<BasePageProps> = ({
  title,
  children,
  showSignoutButton = false,
  showProfileIcon = true,
  showHeader = true,
  showBackButton = true,
  showLogo = false,
  defaultBackButtonHref,
  footer,
}) => {
  const { signout } = useAuth();
  const { showConfirmPrompt } = usePrompt();

  const handleSignout = () => {
    showConfirmPrompt({
      title: 'Sign out',
      message: 'Are you sure you want to sign out?',
      onConfirm: signout,
    });
  };

  useIonViewWillEnter(() => {
    if (title) {
      document.title = title + ' - Trove';
    } else {
      document.title = 'Trove - Rewards at Your Fingertips.';
    }
  });
  return (
    <IonPage>
      <IonHeader className='ion-no-border' hidden={!showHeader}>
        <IonToolbar color={'light'}>
          <IonButtons slot='start'>
            {showBackButton && (
              <IonBackButton defaultHref={defaultBackButtonHref} />
            )}
          </IonButtons>
          <CenterTitle
            addLeftMargin={!showBackButton}
            addRightMargin={!showSignoutButton && !showProfileIcon}
          >
            {showLogo && <HeaderLogo />}
            {!showLogo && title && <h1>{title}</h1>}
          </CenterTitle>

          <IonButtons slot='end'>
            {showProfileIcon && (
              <IonButton routerLink='/profile'>
                <IonIcon slot='icon-only' icon={personOutline} size='default' />
              </IonButton>
            )}
            {showSignoutButton && (
              <IonButton onClick={handleSignout}>
                <IonIcon slot='icon-only' icon={exitOutline}></IonIcon>
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent color={'light'}>{children}</IonContent>
      {footer && <IonFooter>{footer}</IonFooter>}
    </IonPage>
  );
};

export default BasePageLayout;
