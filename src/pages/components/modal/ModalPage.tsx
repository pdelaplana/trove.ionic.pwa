import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonList,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
  title: string;
  onDismiss: () => void;
}

const ModalPage: React.FC<ModalProps> = ({ title, children, onDismiss }) => {
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
    </IonPage>
  );
};

export default ModalPage;
