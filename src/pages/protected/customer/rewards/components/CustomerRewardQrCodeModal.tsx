import { IonText, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { CustomerReward } from '@src/domain';
import {
  ModalPageLayout,
  CenterContainer,
  Gap,
} from '@src/pages/components/layouts';
import { useState } from 'react';
import QRCode from '@src/pages/components/ui/QRCode';
import styled from 'styled-components';

const QrCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
`;

interface CustomerRewardQrCodeModalProps {
  customerReward: CustomerReward & { businessName: string };
  onDismiss: (data?: any, role?: string) => void;
}

const CustomerRewardQrCodeModal: React.FC<CustomerRewardQrCodeModalProps> = ({
  customerReward,
  onDismiss,
}) => {
  return (
    <ModalPageLayout onDismiss={onDismiss}>
      <CenterContainer>
        <QrCodeContainer>
          <div className='ion-flex ion-justify-content-center ion-align-items-center'>
            <IonText>Scan to Redeem Your Reward</IonText>
          </div>
          <Gap size={'30px'} />
          <div className='ion-flex ion-justify-content-center ion-align-items-center'>
            <QRCode
              url={`${import.meta.env.VITE_SCANNER_APP_URL}/redeem`}
              value={{
                rewardcode: customerReward?.id ?? '',
              }}
              size={250}
              level='M'
            />
          </div>
          <div className='ion-flex ion-justify-content-center ion-align-items-center'>
            <IonText color='medium' className='ion-padding-top'>
              ID: {customerReward.id}
            </IonText>
          </div>
        </QrCodeContainer>
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
