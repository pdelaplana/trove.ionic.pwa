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
  IonTitle,
  IonText,
} from '@ionic/react';
import { useAuth } from '@src/features/auth/AuthProvider';
import {
  personOutline,
  exitOutline,
  personCircleSharp,
  personCircleOutline,
} from 'ionicons/icons';
import { PropsWithChildren } from 'react';
import HeaderLogo from '../ui/HeaderLogo';
import { usePrompt } from '../hooks/usePrompt';
import styled from 'styled-components';

interface BasePageProps extends PropsWithChildren {
  title: string;
  showTitle?: boolean;
  showSignoutButton?: boolean;
  showHeader?: boolean;
  showProfileIcon?: boolean;
  showBackButton?: boolean;
  showLogo?: boolean;
  children: React.ReactNode;
  defaultBackButtonHref?: string;
  footer?: React.ReactNode;
  showSecondaryHeader?: boolean;
}

const CenterTitle = styled.div<{
  addLeftMargin: boolean;
  addRightMargin: boolean;
}>`
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BasePageLayout: React.FC<BasePageProps> = ({
  title,
  children,
  showTitle = true,
  showSignoutButton = false,
  showProfileIcon = true,
  showHeader = true,
  showBackButton = true,
  showLogo = false,
  defaultBackButtonHref,
  footer,
  showSecondaryHeader = false,
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
      {showHeader && (
        <IonHeader className='primary ion-no-border' mode='ios'>
          <IonToolbar color={'light'}>
            <IonButtons slot='start'>
              {showBackButton && (
                <IonBackButton
                  defaultHref={defaultBackButtonHref}
                  color='primary'
                  style={{ '--color': 'var(--ion-color-primary)' }}
                  text={''}
                />
              )}
            </IonButtons>
            <IonTitle>
              <CenterTitle
                addLeftMargin={!showBackButton}
                addRightMargin={!showSignoutButton && !showProfileIcon}
              >
                {showLogo && <HeaderLogo />}
                {!showLogo && showTitle && <IonText>{title}</IonText>}
              </CenterTitle>
            </IonTitle>

            <IonButtons slot='end'>
              {showProfileIcon && (
                <IonButton routerLink='/profile'>
                  <IonIcon
                    slot='icon-only'
                    icon={personCircleOutline}
                    size='medium'
                    color='primary'
                  />
                </IonButton>
              )}
              {showSignoutButton && (
                <IonButton onClick={handleSignout}>
                  <IonIcon
                    slot='icon-only'
                    icon={exitOutline}
                    color='primary'
                    size='medium'
                  ></IonIcon>
                </IonButton>
              )}
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      )}

      <IonContent color={'light'}>
        {showSecondaryHeader && (
          <IonHeader mode='ios' className='ion-no-border' collapse='condense'>
            <IonToolbar color='light' className='ion-no-border'>
              <div className='ion-margin'>
                <h1>{title}</h1>
              </div>
            </IonToolbar>
          </IonHeader>
        )}

        {children}
      </IonContent>
      {footer && <IonFooter color='light'>{footer}</IonFooter>}
    </IonPage>
  );
};

export default BasePageLayout;
