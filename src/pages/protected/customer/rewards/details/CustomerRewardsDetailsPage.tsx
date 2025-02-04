import {
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { LoyaltyCard } from '@src/domain';
import useClaimRewardFunction from '@src/features/cloudFunctions/useClaimRewardFunction';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import useFetchRewardById from '@src/features/queries/loyaltyRewards/useFetchRewardById';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import { usePrompt } from '@src/pages/components/hooks/usePrompt';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import ActionButton from '@src/pages/components/ui/ActionButton';
import ResponsiveImage from '@src/pages/components/ui/ResponsiveImage';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface CustomerRewardsDetailsPageProps {}

const CustomerRewardsDetailsPage: React.FC = () => {
  const { id, loyaltyProgramId } = useParams<{
    id: string;
    loyaltyProgramId: string;
  }>();
  const { formatDate } = useFormatters();

  const { showNotification, showErrorNotification } = useAppNotifications();
  const { showConfirmPrompt } = usePrompt();
  const { push } = useIonRouter();

  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);

  const { loyaltyCards } = useCustomerProvider();

  const { data: milestoneReward } = useFetchRewardById(
    id,
    loyaltyCard?.loyaltyProgramId ?? '',
    loyaltyCard?.businessId ?? ''
  );

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
          loyaltyProgramMilestoneId: milestoneReward?.id ?? '',
        });
      },
    });
  };

  useEffect(() => {
    const loyaltyCard = loyaltyCards?.find(
      (card) => card.loyaltyProgramId === loyaltyProgramId
    );
    setLoyaltyCard(loyaltyCard ?? null);
  }, [loyaltyCards]);

  useEffect(() => {
    if (isSuccess) {
      showNotification('Reward claimed successfully');
      push('/rewards', 'back', 'pop');
    }
    if (isError) {
      showErrorNotification('Error claiming reward');
    }
  }, [isSuccess, isError]);

  return (
    <BasePageLayout
      title='Rewards'
      showProfileIcon={true}
      showHeader={true}
      showLogo={false}
      defaultBackButtonHref='/rewards'
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
              <h1>{milestoneReward?.reward?.name}</h1>
              <h2>{milestoneReward?.businessName}</h2>
            </IonLabel>
          </IonItem>
          {milestoneReward?.reward?.description && (
            <IonItem lines='none'>
              <IonLabel className='ion-text-center '>
                <IonText>{milestoneReward?.reward?.description}</IonText>
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
                    {milestoneReward?.points} points
                  </p>
                </IonCol>
                <IonCol size='6' className='ion-text-end ion-no-padding'>
                  {milestoneReward?.reward.validUntilDate && (
                    <p>
                      <IonText color='medium'>Valid Until</IonText> <br />
                      {formatDate(milestoneReward?.reward.validUntilDate)}
                    </p>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>

          {milestoneReward?.reward?.termsAndConditions && (
            <IonItem lines='none'>
              <IonLabel>
                <h2>Terms and Conditions</h2>
                <p>{milestoneReward?.reward?.termsAndConditions}</p>
              </IonLabel>
            </IonItem>
          )}
        </IonList>
        <ActionButton
          isLoading={isPending}
          isDisabled={false}
          expand='full'
          onClick={() => handleClaimReward()}
          label={'Claim Reward'}
        />
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerRewardsDetailsPage;
