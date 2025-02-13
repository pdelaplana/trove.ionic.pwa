import {
  IonCol,
  IonFooter,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  useIonModal,
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { LoyaltyProgramMilestone } from '@src/domain';
import useClaimRewardFunction from '@src/features/cloudFunctions/useClaimRewardFunction';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import { usePrompt } from '@src/pages/components/hooks/usePrompt';
import {
  CenterContainer,
  FixedBottomContainer,
  FooterSection,
  ModalPageLayout,
  ScrollableContainer,
} from '@src/pages/components/layouts';
import ActionButton from '@src/pages/components/ui/ActionButton';
import ResponsiveImage from '@src/pages/components/ui/ResponsiveImage';
import { useState } from 'react';

interface DiscoverRewardsDetaislModalProps {
  loyaltyProgramMilestone: LoyaltyProgramMilestone & {
    membershipNumber: string;
    businessName: string;
  };
  onDismiss: (data?: any, role?: string) => void;
}

const DiscoverRewardsDetailsModal: React.FC<
  DiscoverRewardsDetaislModalProps
> = ({ loyaltyProgramMilestone, onDismiss }) => {
  const { formatDate } = useFormatters();
  const { showNotification, showErrorNotification } = useAppNotifications();
  const { showConfirmPrompt } = usePrompt();
  const {
    mutate: claimReward,
    isSuccess,
    isError,
    isPending,
  } = useClaimRewardFunction();

  const handleClaimReward = () => {
    showConfirmPrompt({
      title: 'Claim Reward',
      message: 'Are you sure you want to claim this reward?',
      onConfirm: () => {
        claimReward({
          membershipNumber: loyaltyProgramMilestone?.membershipNumber ?? '',
          loyaltyProgramMilestoneId: loyaltyProgramMilestone?.id ?? '',
        });
      },
    });
  };

  const footer = (
    <CenterContainer>
      <ActionButton
        isLoading={isPending}
        isDisabled={false}
        expand='full'
        onClick={() => handleClaimReward()}
        label={'Claim Reward'}
      />
    </CenterContainer>
  );

  return (
    <ModalPageLayout
      title='Reward Details'
      onDismiss={onDismiss}
      footer={footer}
    >
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
              <h1>{loyaltyProgramMilestone?.reward?.name}</h1>
              <h2>{loyaltyProgramMilestone?.businessName}</h2>
            </IonLabel>
          </IonItem>
          {loyaltyProgramMilestone?.reward?.description && (
            <IonItem lines='none'>
              <IonLabel className='ion-text-center '>
                <IonText>
                  {loyaltyProgramMilestone?.reward?.description}
                </IonText>
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
                    {loyaltyProgramMilestone?.points} points
                  </p>
                </IonCol>
                <IonCol size='6' className='ion-text-end ion-no-padding'>
                  {loyaltyProgramMilestone?.reward.validUntilDate && (
                    <p>
                      <IonText color='medium'>Valid Until</IonText> <br />
                      {formatDate(
                        loyaltyProgramMilestone?.reward.validUntilDate
                      )}
                    </p>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>

          {loyaltyProgramMilestone?.reward?.termsAndConditions && (
            <IonItem lines='none'>
              <IonLabel>
                <h2>Terms and Conditions</h2>
                <p>{loyaltyProgramMilestone?.reward?.termsAndConditions}</p>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
      </CenterContainer>
    </ModalPageLayout>
  );
};

export default DiscoverRewardsDetailsModal;

export const useDiscoverRewardsDetailsModal = (): {
  open: (
    loyaltyProgramMilestone: LoyaltyProgramMilestone
  ) => Promise<{ role: string }>;
} => {
  const [inputs, setInputs] = useState<{
    loyaltyProgramMilestone: LoyaltyProgramMilestone;
  }>();

  const [present, dismiss] = useIonModal(DiscoverRewardsDetailsModal, {
    loyaltyProgramMilestone: inputs?.loyaltyProgramMilestone,
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  return {
    open: (loyaltyProgramMilestone: LoyaltyProgramMilestone) => {
      setInputs({
        loyaltyProgramMilestone,
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
