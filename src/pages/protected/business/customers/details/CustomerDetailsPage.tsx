import { IonList, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { LoyaltyProgram } from '@src/domain';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { useDeleteLoyaltyCard } from '@src/features/mutations';
import useBatchDeleteDocument from '@src/features/mutations/useBatchDeleteDocument';
import {
  useFetchLoyaltyCardWithCustomerInfoById,
  useFetchLoyaltyProgramsByBusinessId,
} from '@src/features/queries';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import useFormatters from '@src/pages/components/hooks/useFormatters';
import { usePrompt } from '@src/pages/components/hooks/usePrompt';
import {
  BasePageLayout,
  CenterContainer,
  Gap,
} from '@src/pages/components/layouts';
import ActionSheetButton, {
  ActionOption,
} from '@src/pages/components/ui/ActionSheetButton';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface CustomerDetailsPageValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday?: Date;
  gender: 'male' | 'female' | 'other' | 'preferNotToSay';

  id: string;
  membershipNumber: string;
  customerId: string;
  businessId: string;
  loyaltyProgramId: string;
  tierId?: string;
  tierName?: string;
  points: number;
  stamps: number;
  membershipDate: Date;
  expiryDate?: Date;

  loyaltyProgramName?: string;
}

const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { business } = useBusiness();
  const { data: loyaltyPrograms } = useFetchLoyaltyProgramsByBusinessId(
    business?.id ?? ''
  );
  const { data } = useFetchLoyaltyCardWithCustomerInfoById(
    id,
    business?.id ?? ''
  );

  const [customerDetailsPageValues, setCustomerDetailsPageValues] =
    useState<CustomerDetailsPageValues>();

  const {
    mutate: batchDelete,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
    isPending: isDeletePending,
  } = useBatchDeleteDocument();

  const { mutate: deleteLoyaltyCard } = useDeleteLoyaltyCard();

  const { push } = useIonRouter();
  const { showConfirmPrompt } = usePrompt();
  const { showNotification, showErrorNotification } = useAppNotifications();
  const { formatNumber, formatDate } = useFormatters();

  const handleDelete = async () => {
    deleteLoyaltyCard(
      { id, businessId: business!.id },
      {
        onSuccess: () => {
          showNotification('Customer and related data deleted successfully');
          push('/customers', 'back', 'pop');
        },
        onError: (error) => {
          showErrorNotification('Failed to delete customer');
        },
      }
    );

    /*
    const itemsToDelete = [
      {
        id: customerDetailsPageValues!.id,
        collectionName: `businesses/${business?.id}/loyaltyCards`,
      },
      {
        id: customerDetailsPageValues!.customerId,
        collectionName: 'customers',
      },
    ];

    batchDelete(itemsToDelete, {
      onSuccess: () => {
        showNotification('Customer and related data deleted successfully');
        push('/customers', 'back', 'pop');
      },
      onError: (error) => {
        showErrorNotification('Failed to delete customer');
      },
    });
    */
  };

  const handleActionComplete = (action: ActionOption) => {
    switch (action.data) {
      case 'delete':
        showConfirmPrompt({
          title: 'Delete Customer',
          message:
            'Are you sure you want to delete loyalty card of this customer?',
          onConfirm: handleDelete,
        });
        break;
      case 'edit':
        push(`/customers/${id}/edit`, 'forward');
        break;
      case 'activity':
        push(`/customers/${id}/activity`, 'forward');
        break;
    }
  };

  const footer = (
    <CenterContainer>
      <Gap size='.65rem' />
      <ActionSheetButton
        buttonLabel={'Options...'}
        sheetTitle='Options...'
        expand='full'
        fill='solid'
        className='ion-no-margin'
        options={[
          {
            text: 'Delete Card and Customer',
            role: 'destructive',
            data: 'delete',
          },
          {
            text: 'Edit Customer',
            role: 'destructive',
            data: 'edit',
          },
          {
            text: 'View Activity',
            data: 'activity',
          },
        ]}
        onActionComplete={handleActionComplete}
      />
    </CenterContainer>
  );

  useEffect(() => {
    if (data) {
      setCustomerDetailsPageValues(
        (prevData) => ({ ...prevData, ...data }) as CustomerDetailsPageValues
      );
    }
  }, [data]);

  useEffect(() => {
    if (business && data) {
      const program = loyaltyPrograms?.find(
        (lp: LoyaltyProgram) => lp.id === data.loyaltyProgramId
      );

      const tier = program?.tiers.find((t) => t.id === data.tierId);

      setCustomerDetailsPageValues(
        (prevData) =>
          ({
            ...prevData,
            loyaltyProgramName: program?.name,
            tierName: tier?.name,
          }) as CustomerDetailsPageValues
      );
    }
  }, [business, data]);

  useEffect(() => {
    if (!isDeletePending && isDeleteSuccess) {
      showNotification('Customer details deleted successfully');
      push('/manage/customers', 'back', 'pop');
    } else if (!isDeletePending && isDeleteSuccess) {
      showNotification('Failed to delete customer details');
    }
  }, [isDeleteSuccess, isDeleteError, isDeletePending]);

  return (
    <BasePageLayout
      title='Details'
      defaultBackButtonHref='/customers'
      footer={footer}
    >
      <CenterContainer>
        <div className='ion-margin'>Membership Information</div>

        <IonList lines='full' className='ion-margin'>
          <IonItem>
            <IonLabel>
              <h2>Member Name</h2>
              <p>{`${data?.firstName} ${data?.lastName}`}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Membership No</h2>
              <p>{data?.membershipNumber}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Member Since</h2>
              <p>{formatDate(data?.membershipDate)}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Loyalty Program</h2>
              <p>{customerDetailsPageValues?.loyaltyProgramName}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Tier</h2>
              <p>{customerDetailsPageValues?.tierName}</p>
            </IonLabel>
          </IonItem>
          <IonItem lines='none'>
            <IonLabel>
              <h2>Points</h2>
              <p>{formatNumber(customerDetailsPageValues?.points ?? 0)}</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <div className='ion-margin'>Contact Information</div>
        <IonList lines='full' className='ion-margin'>
          <IonItem>
            <IonLabel>
              <h2>Email</h2>
              <p>{customerDetailsPageValues?.email}</p>
            </IonLabel>
          </IonItem>
          <IonItem lines='none'>
            <IonLabel>
              <h2>Phone</h2>
              <p>{customerDetailsPageValues?.phone}</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </CenterContainer>
    </BasePageLayout>
  );
};
export default CustomerDetailsPage;
