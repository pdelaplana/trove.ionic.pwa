import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useParams } from 'react-router-dom';
import { useCustomerProvider } from '@src/features/customer/CustomerProvider';
import { useEffect, useState } from 'react';
import { LoyaltyCard } from '@src/domain';
import {
  IonList,
  IonItem,
  IonLabel,
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import QRCode from '@src/pages/components/ui/QRCode';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import styled from 'styled-components';

const QRCodeWrapper = styled.div`
  background-color: white;
  padding-top: 40px;
  color: black;
`;

const LoyaltyCardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);
  const { loyaltyCards } = useCustomerProvider();

  const { formatNumber } = useFormatters();

  useEffect(() => {
    const card = loyaltyCards?.find((card) => card.id === id);
    setLoyaltyCard(card ?? null);
  }, [loyaltyCards]);

  return (
    <BasePageLayout
      title={''}
      showProfileIcon={false}
      showHeader={true}
      defaultBackButtonHref='/home'
    >
      <CenterContainer>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard color={'primary'}>
                <IonCardHeader>
                  <IonCardTitle className='ion-text-center'>
                    <h2>{loyaltyCard?.businessName}</h2>
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent color='light'>
                  <QRCodeWrapper className='ion-padding'>
                    <QRCode
                      value={{
                        memberno: loyaltyCard?.membershipNumber ?? '',
                        businessid: loyaltyCard?.businessId ?? '',
                      }}
                      url={`${import.meta.env.VITE_SCANNER_APP_URL}/reward`}
                      size={250}
                      level='M'
                    />
                  </QRCodeWrapper>

                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonLabel className='text-xs'>
                          {loyaltyCard?.membershipNumber}
                        </IonLabel>
                      </IonCol>
                      <IonCol className='ion-text-end'>
                        <IonLabel className='text-xs '>
                          {formatNumber(loyaltyCard?.rewardPoints)} Points
                        </IonLabel>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList className='ion-outline ion-padding'>
          <IonItem
            lines='none'
            detail
            button
            href={`/card/${loyaltyCard?.id}/activity`}
          >
            <IonLabel>View Activity</IonLabel>
          </IonItem>
          <IonItem lines='none' detail button>
            <IonLabel>View Terms and Conditions</IonLabel>
          </IonItem>
        </IonList>
      </CenterContainer>
    </BasePageLayout>
  );
};
export default LoyaltyCardPage;
