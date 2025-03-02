import { IonButton, IonIcon, IonText, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { CustomerReward, LoyaltyCard } from '@src/domain';
import {
  CenterContainer,
  FixedBottomContainer,
  ModalPageLayout,
} from '@src/pages/components/layouts';
import QRCode from '@src/pages/components/ui/QRCode';
import { closeCircleOutline } from 'ionicons/icons';
import { useState } from 'react';

interface LoyaltyCardModalProps {
  loyaltyCard: LoyaltyCard;
  onDismiss: (data?: any, role?: string) => void;
}

const LoyaltyCardModal: React.FC<LoyaltyCardModalProps> = ({
  loyaltyCard,
  onDismiss,
}) => {
  return (
    <ModalPageLayout onDismiss={onDismiss}>
      <CenterContainer>
        <div className='ion-flex ion-justify-content-center ion-align-items-center'>
          <QRCode
            value={{
              memberno: loyaltyCard.membershipNumber,
              businessid: loyaltyCard.businessId,
            }}
            size={250}
            level='M'
          />
        </div>
        <div className='ion-flex ion-justify-content-center ion-align-items-center'>
          <IonText color='medium' className='ion-padding-top'>
            Membership No: {loyaltyCard.membershipNumber}
          </IonText>
        </div>
        <FixedBottomContainer>
          <div
            className='ion-flex ion-justify-content-center ion-align-items-center'
            style={{ width: '100%' }}
          >
            <IonButton
              shape='round'
              onClick={() => onDismiss(undefined, 'close')}
              fill='clear'
              size='large'
            >
              <IonIcon
                slot='icon-only'
                icon={closeCircleOutline}
                size='large'
                color='dark'
                style={{ height: '50px' }}
              />
            </IonButton>
          </div>
        </FixedBottomContainer>
      </CenterContainer>
    </ModalPageLayout>
  );
};

export default LoyaltyCardModal;

export const useLoyaltyCardModal = (): {
  open: (loyaltyCard: LoyaltyCard) => Promise<{ role: string }>;
} => {
  const [inputs, setInputs] = useState<{
    loyaltyCard: LoyaltyCard;
  }>();

  const [present, dismiss] = useIonModal(LoyaltyCardModal, {
    loyaltyCard: inputs?.loyaltyCard,
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  return {
    open: (loyaltyCard: LoyaltyCard) => {
      setInputs({
        loyaltyCard,
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
