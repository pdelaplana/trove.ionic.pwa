import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonFooter,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import React, { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
  title?: string;
  footer?: React.ReactNode;
  onDismiss: () => void;
}

const ModalPageLayout: React.FC<ModalProps> = ({
  title = '',
  footer,
  children,
  onDismiss,
}) => {
  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar>
          <IonButtons slot='end'>
            <IonButton
              onClick={() => onDismiss()}
              slot='icon-only'
              shape='round'
            >
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{children}</IonContent>
      {footer && <IonFooter>{footer}</IonFooter>}
    </IonPage>
  );
};

export default ModalPageLayout;
