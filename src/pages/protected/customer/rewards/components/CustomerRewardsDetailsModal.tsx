import {
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  useIonModal,
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { CustomerReward } from '@src/domain';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import {
  CenterContainer,
  ModalPageLayout,
} from '@src/pages/components/layouts';
import ResponsiveImage from '@src/pages/components/ui/ResponsiveImage';
import { useEffect, useState } from 'react';

interface CustomerRewardsDetaislModalProps {
  customerReward: CustomerReward;
  onDismiss: (data?: any, role?: string) => void;
}

const CustomerRewardsDetailsModal: React.FC<
  CustomerRewardsDetaislModalProps
> = ({ customerReward, onDismiss }) => {
  const { formatDate } = useFormatters();

  useEffect(() => {
    console.log('useEffect', customerReward);
  }, [customerReward]);

  return (
    <ModalPageLayout onDismiss={onDismiss}>
      <CenterContainer>
        <ResponsiveImage
          src={'/images/trove.rewards.3.png'}
          alt={''}
          aspectRatio='LANDSCAPE'
          containerHeights={{
            default: '420px',
            tablet: '420px',
            desktop: '45opx',
          }}
        />
        <IonList lines='none'>
          <IonItem lines='none'>
            <IonLabel className='ion-text-center'>
              <h1>{customerReward?.name}</h1>
            </IonLabel>
          </IonItem>
          {customerReward?.description && (
            <IonItem lines='none'>
              <IonLabel className='ion-text-center '>
                <IonText>{customerReward?.description}</IonText>
              </IonLabel>
            </IonItem>
          )}

          <IonItem lines='none'>
            <IonGrid className='ion-no-padding'>
              <IonRow>
                <IonCol size='6' className='ion-text-start ion-no-padding'>
                  <p>
                    <IonText color='medium'> Points Required</IonText>
                    <br />
                  </p>
                </IonCol>
                <IonCol size='6' className='ion-text-end ion-no-padding'>
                  {customerReward?.validUntilDate && (
                    <p>
                      <IonText color='medium'>Valid Until</IonText> <br />
                      {formatDate(customerReward.validUntilDate)}
                    </p>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>

          {customerReward?.termsAndConditions && (
            <IonItem lines='none'>
              <IonLabel>
                <h2>Terms and Conditions</h2>
                <p>{customerReward?.termsAndConditions}</p>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
      </CenterContainer>
    </ModalPageLayout>
  );
};

export default CustomerRewardsDetailsModal;

export const useCustomerRewardsDetailsModal = (): {
  open: (customerReward: CustomerReward) => Promise<{ role: string }>;
} => {
  const [inputs, setInputs] = useState<{
    customerReward: CustomerReward;
  }>();

  const [present, dismiss] = useIonModal(CustomerRewardsDetailsModal, {
    customerReward: inputs?.customerReward,
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  useEffect(() => {
    console.log(inputs);
  }, [inputs]);

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
