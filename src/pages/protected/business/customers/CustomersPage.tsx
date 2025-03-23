import { IonSearchbar } from '@ionic/react';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useState } from 'react';
import CustomersList from './components/CustomersList';

const CustomersPage: React.FC = () => {
  const [queryString, setQueryString] = useState<string | undefined>(undefined);
  const { business } = useBusiness();

  const handleSearchInput = (event: Event) => {
    const target = event.target as HTMLIonSearchbarElement;
    if (target && target.value!.length > 3)
      setQueryString(target.value!.toLowerCase());
  };

  return (
    <BasePageLayout title={'Customers'} showBackButton={false}>
      <CenterContainer>
        <IonSearchbar
          placeholder='Search customers'
          className='ion-no-margin ion-no-padding ion-margin-vertical'
          debounce={2000}
          onIonInput={(event) => handleSearchInput(event)}
          onIonClear={() => setQueryString(undefined)}
        ></IonSearchbar>
        <CustomersList
          businessId={business?.id ?? ''}
          queryString={queryString ?? ''}
        />
      </CenterContainer>
    </BasePageLayout>
  );
};
export default CustomersPage;
