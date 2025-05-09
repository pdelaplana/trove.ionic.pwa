import {
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
} from '@ionic/react';
import DOMPurify from 'dompurify';
import { LoyaltyCard } from '@src/domain';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import { useFetchCustomerRewardById } from '@src/features/queries';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import ActionButton from '@src/pages/components/ui/ActionButton';
import ResponsiveImage2 from '@src/pages/components/ui/ResponsiveImage2';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCustomerRewardQrCodeModal } from '../components/CustomerRewardQrCodeModal';
import DestructiveButton from '@src/pages/components/ui/DestructiveButton';

interface CustomerRewardsDetailsPageProps {}

const CustomerRewardsDetailsPage: React.FC = () => {
  const { id, loyaltyCardId } = useParams<{
    id: string;
    loyaltyCardId: string;
  }>();
  const { formatDate } = useFormatters();

  const { open: openRewardQrCodeModal } = useCustomerRewardQrCodeModal();

  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);

  const { loyaltyCards } = useCustomerProvider();

  const { data: customerReward } = useFetchCustomerRewardById(
    id,
    loyaltyCard?.id ?? '',
    loyaltyCard?.businessId ?? ''
  );

  const footer = (
    <CenterContainer>
      {!customerReward?.redeemedDate ? (
        <ActionButton
          isLoading={false}
          isDisabled={false}
          expand='full'
          onClick={() =>
            customerReward && openRewardQrCodeModal(customerReward)
          }
          label={'Use Now'}
        />
      ) : (
        ''
      )}
    </CenterContainer>
  );

  useEffect(() => {
    const loyaltyCard = loyaltyCards?.find((card) => card.id === loyaltyCardId);
    setLoyaltyCard(loyaltyCard ?? null);
  }, [loyaltyCards, loyaltyCardId]);

  return (
    <BasePageLayout
      title=''
      showProfileIcon={false}
      showHeader={true}
      showLogo={false}
      defaultBackButtonHref='/rewards'
      footer={footer}
    >
      <CenterContainer>
        <ResponsiveImage2
          src={'/images/trove.rewards.3.png'}
          alt={''}
          aspectRatio='2/1'
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
                <IonCol
                  size='6'
                  className='ion-text-start ion-no-padding'
                ></IonCol>
                <IonCol size='6' className='ion-text-end ion-no-padding'>
                  {customerReward?.redeemedDate != null && (
                    <p>
                      <IonText color='medium'>Redeemed On</IonText> <br />
                      {formatDate(customerReward.redeemedDate)}
                    </p>
                  )}
                  {customerReward?.expiryDate &&
                    !customerReward.redeemedDate && (
                      <p>
                        <IonText color='medium'>Expires On</IonText> <br />
                        {formatDate(customerReward.expiryDate)}
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
                <p
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      customerReward?.termsAndConditions
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

export default CustomerRewardsDetailsPage;
