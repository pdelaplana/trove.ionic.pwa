import { IonButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import { Customer, LoyaltyCard } from '@src/domain';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { useFetchLoyaltyCardsByBusinessId } from '@src/features/queries';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import EmptySection from '@src/pages/components/layouts/EmptySection';
import {
  IonItemEndSlot,
  IonItemStartSlot,
} from '@src/pages/components/ui/IonItemSlot';
import { chevronForward, walletOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';

const CustomersPage: React.FC = () => {
  const { business } = useBusiness();
  const {
    data,
    hasNextPage,
    isLoading: isFetchingNextPage,
    fetchNextPage,
  } = useFetchLoyaltyCardsByBusinessId(business?.id ?? '');

  const [loyaltyCards, setLoyaltyCards] =
    useState<Array<LoyaltyCard & Customer>>();
  useEffect(() => {
    if (data) {
      setLoyaltyCards(data.pages.flatMap((page) => page.cards));
    }
  }, [data]);

  return (
    <BasePageLayout title={'Customers'} showBackButton={false}>
      <CenterContainer>
        {loyaltyCards?.length === 0 && (
          <EmptySection
            heading='No customers'
            content='You have not enroll any customers yet to this loyalty program.'
          />
        )}

        {loyaltyCards?.length! > 0 && (
          <>
            <div className='ion-margin'>Manage Customers</div>
            <IonList className='ion-margin-bottom'>
              {loyaltyCards?.map((card) => (
                <IonItem
                  key={card.id}
                  lines='full'
                  button={true}
                  routerLink={`/customers/${card.id}`}
                >
                  <IonItemStartSlot slot='start'>
                    <IonIcon icon={walletOutline} color='primary' />
                  </IonItemStartSlot>
                  <IonLabel>
                    <h2>{`${card.firstName} ${card.lastName}`}</h2>
                    <h3>{card.membershipNumber}</h3>
                    <p>{`Points: ${card.rewardPoints}`}</p>
                  </IonLabel>
                  <IonItemEndSlot slot='end'>
                    <IonIcon
                      color='primary'
                      icon={chevronForward}
                      size='medium'
                    ></IonIcon>
                  </IonItemEndSlot>
                </IonItem>
              ))}
              {hasNextPage && (
                <IonItem lines='none'>
                  <IonLabel>
                    <IonButton
                      expand='full'
                      fill='clear'
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                    </IonButton>
                  </IonLabel>
                </IonItem>
              )}
            </IonList>
          </>
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};
export default CustomersPage;
