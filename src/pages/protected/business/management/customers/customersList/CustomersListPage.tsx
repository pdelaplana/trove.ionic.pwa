import { IonButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import { Customer, LoyaltyCard } from '@src/domain';
import { useBusiness } from '@src/features/business/BusinessProvider';
import useFetchLoyaltyCardsByBusinessId from '@src/features/queries/useFetchLoyaltyCardsByBusinessId';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { bus, walletOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';

const CustomersListPage: React.FC = () => {
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
    <BasePageLayout title={'Customers'} defaultBackButtonHref='/manage'>
      <CenterContainer>
        <div className='ion-margin'>Manage Customers</div>
        <IonList className='ion-outline'>
          {loyaltyCards?.map((card) => (
            <IonItem
              key={card.id}
              lines='none'
              detail={true}
              routerLink={`/manage/customers/details/${card.id}`}
            >
              <IonIcon slot='start' icon={walletOutline} color='primary' />
              <IonLabel>
                <h2>{`${card.firstName} ${card.lastName}`}</h2>
                <h3>{card.membershipNumber}</h3>
                <p>{`Points: ${card.points}`}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
        {hasNextPage && (
          <IonButton
            expand='full'
            fill='clear'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </IonButton>
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};
export default CustomersListPage;
