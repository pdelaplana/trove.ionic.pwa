import {
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonImg,
  IonText,
  IonBadge,
  useIonModal,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { CustomerReward } from '@src/domain';
import {
  ModalPageLayout,
  CenterContainer,
} from '@src/pages/components/layouts';
import { useEffect, useState } from 'react';
import QRCode from '@src/pages/components/ui/QRCode';
import ResponsiveImage from '@src/pages/components/ui/ResponsiveImage';
import useFormatters from '@src/pages/components/hooks/useFormatters';

interface CustomerRewardQrCodeModalProps {
  customerReward: CustomerReward & { businessName: string };
  onDismiss: (data?: any, role?: string) => void;
}

const CustomerRewardQrCodeModal: React.FC<CustomerRewardQrCodeModalProps> = ({
  customerReward,
  onDismiss,
}) => {
  const { formatDate } = useFormatters();
  return (
    <ModalPageLayout onDismiss={onDismiss}>
      <CenterContainer>
        <div className='ion-flex ion-justify-content-between ion-align-items-baseline'>
          <h2>{customerReward.name}</h2>
          <span>{customerReward.businessName}</span>
        </div>
        <div
          className='ion-flex ion-justify-content-between ion-align-items-start'
          style={{ marginBottom: '50px' }}
        >
          <br />
          <span>{formatDate(customerReward.expiryDate)}</span>
        </div>

        <div
          className='ion-flex ion-justify-content-center ion-align-items-center'
          style={{ marginBottom: '20px' }}
        >
          <IonText>Scan to Redeem Your Reward</IonText>
        </div>

        <div className='ion-flex ion-justify-content-center ion-align-items-center'>
          <QRCode value={customerReward.id} size={250} level='M' />
        </div>
        <div className='ion-flex ion-justify-content-center ion-align-items-center'>
          <IonText color='medium' className='ion-padding-top'>
            ID: {customerReward.id}
          </IonText>
        </div>
      </CenterContainer>
    </ModalPageLayout>
  );
};

export default CustomerRewardQrCodeModal;

export const useCustomerRewardQrCodeModal = (): {
  open: (customerReward: CustomerReward) => Promise<{ role: string }>;
} => {
  const [inputs, setInputs] = useState<{
    customerReward: CustomerReward;
  }>();

  const [present, dismiss] = useIonModal(CustomerRewardQrCodeModal, {
    customerReward: inputs?.customerReward,
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  return {
    open: (customerReward: CustomerReward) => {
      setInputs({
        customerReward,
      });
      return new Promise(async (resolve) => {
        present({
          onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
            if (ev.detail.role) {
              resolve({ role: ev.detail.role });
            }
          },
        });
      });
    },
  };
};
