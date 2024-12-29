import {
  IonButton,
  IonContent,
  IonDatetime,
  useIonModal,
  IonText,
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { useState } from 'react';

import './hoursSelectorModal.css';

interface HoursSelectorModalProps {
  title: string;
  initialTime: string;
  onDismiss: (data?: any, role?: string) => void;
}

const HoursSelectorModal: React.FC<HoursSelectorModalProps> = ({
  title = 'Select Time',
  initialTime = '06:00',
  onDismiss,
}) => {
  const [time, setTime] = useState<string>(initialTime);
  return (
    <IonContent className='ion-padding' style={{ height: '100px' }}>
      <IonText>
        <strong>{title}</strong>
      </IonText>

      <div className='ion-flex ion-justify-content-center ion-align-items-center ion-margin-top'>
        <IonDatetime
          presentation='time'
          value={time}
          onIonChange={(e: CustomEvent) => setTime(e.detail.value!)}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          width: '90%',
          marginBottom: '5px',
        }}
      >
        <IonButton expand='full' onClick={() => onDismiss(time, 'confirm')}>
          Confirm
        </IonButton>
      </div>
    </IonContent>
  );
};

export const useHoursSelector = (): {
  open: (
    title: string,
    initialTime?: string
  ) => Promise<{ selectedTime: string; role: string }>;
} => {
  const [inputs, setInputs] = useState<{
    title: string;
    initialTime: string;
  }>();

  const [present, dismiss] = useIonModal(HoursSelectorModal, {
    title: inputs?.title,
    initialTime: inputs?.initialTime,
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  return {
    open: (title, initialTime) => {
      setInputs({
        title,
        initialTime: initialTime || '06:00',
      });
      return new Promise(async (resolve) => {
        present({
          cssClass: 'half-screen',
          backdropDismiss: true,
          showBackdrop: true,
          onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
            if (ev.detail.role) {
              resolve({ selectedTime: ev.detail.data, role: ev.detail.role });
            }
          },
        });
      });
    },
  };
};
