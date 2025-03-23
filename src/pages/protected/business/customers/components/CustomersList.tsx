import { IonButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import { Customer, LoyaltyCard } from '@src/domain';
import { useFetchLoyaltyCardsByBusinessId } from '@src/features/queries';
import EmptySection from '@src/pages/components/layouts/EmptySection';
import {
  IonItemEndSlot,
  IonItemStartSlot,
} from '@src/pages/components/ui/IonItemSlot';
import { chevronForward, walletOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';

interface CustomersListProps {
  businessId: string;
  queryString: string;
}
const CustomersList: React.FC<CustomersListProps> = ({
  businessId,
  queryString,
}) => {
  const [loyaltyCards, setLoyaltyCards] =
    useState<Array<LoyaltyCard & Customer>>();

  const {
    data,
    hasNextPage,
    isLoading: isFetchingNextPage,
    fetchNextPage,
  } = useFetchLoyaltyCardsByBusinessId(businessId ?? '', queryString);

  useEffect(() => {
    if (data) {
      setLoyaltyCards(data.pages.flatMap((page) => page.cards));
    }
  }, [data]);

  return (
    <>
      {' '}
      {loyaltyCards?.length === 0 && (
        <EmptySection
          heading='No customers'
          content='You have not enroll any customers yet to this loyalty program.'
        />
      )}
      {loyaltyCards?.length! > 0 && (
        <>
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
    </>
  );
};
export default CustomersList;
