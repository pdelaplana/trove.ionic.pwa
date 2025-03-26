import {
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  useIonRouter,
} from '@ionic/react';
import DOMPurify from 'dompurify';
import { LoyaltyCard } from '@src/domain';
import useClaimRewardFunction from '@src/features/cloudFunctions/useClaimRewardFunction';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import { useFetchLoyaltyProgramMilestoneById } from '@src/features/queries';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import { usePrompt } from '@src/pages/components/hooks/usePrompt';
import {
  BasePageLayout,
  CenterContainer,
  Gap,
} from '@src/pages/components/layouts';
import ActionButton from '@src/pages/components/ui/ActionButton';
import ResponsiveImage from '@src/pages/components/ui/ResponsiveImage';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const DiscoverRewardsDetailsPage: React.FC = () => {
  const { loyaltyProgramMilestoneId, loyaltyProgramId, businessId } =
    useParams<{
      loyaltyProgramMilestoneId: string;
      loyaltyProgramId: string;
      businessId: string;
    }>();

  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>();

  const { loyaltyCards } = useCustomerProvider();
  const { formatDate } = useFormatters();

  const { push } = useIonRouter();

  const { data: loyaltyProgramMilestone } = useFetchLoyaltyProgramMilestoneById(
    loyaltyProgramMilestoneId,
    loyaltyProgramId,
    businessId
  );
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
          membershipNumber: loyaltyCard?.membershipNumber ?? '',
          loyaltyProgramMilestoneId: loyaltyProgramMilestone?.id ?? '',
        });
      },
    });
  };

  useEffect(() => {
    const loyaltyCard = loyaltyCards?.find(
      (card) => card.loyaltyProgramId === loyaltyProgramId
    );
    setLoyaltyCard(loyaltyCard ?? null);
  }, [loyaltyProgramId, loyaltyCards]);

  useEffect(() => {
    if (isSuccess) {
      showNotification('Reward claimed successfully');
      push('/rewards', 'forward', 'replace');
    }
    if (isError) {
      showErrorNotification('Failed to claim reward');
    }
  }, [isSuccess, isError]);

  const footer = (
    <CenterContainer>
      <Gap size='30px' />
      <ActionButton
        isLoading={isPending}
        isDisabled={false}
        expand='full'
        onClick={() => handleClaimReward()}
        label={'Claim Now'}
      />
    </CenterContainer>
  );

  return (
    <BasePageLayout
      title='Discover Rewards'
      showLogo={false}
      showHeader={true}
      showProfileIcon={false}
      showBackButton={true}
      defaultBackButtonHref='/discover'
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
                <p
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      loyaltyProgramMilestone?.reward?.termsAndConditions
                    ),
                  }}
                ></p>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
      </CenterContainer>
    </BasePageLayout>
  );
};
export default DiscoverRewardsDetailsPage;
