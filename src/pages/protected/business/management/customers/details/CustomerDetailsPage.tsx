import { IonList, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { Customer, LoyaltyCard, LoyaltyProgram } from '@src/domain';
import { useBusiness } from '@src/features/business/BusinessProvider';
import useBatchDeleteDocument from '@src/features/mutations/useBatchDeleteDocument';
import useDeleteDocument from '@src/features/mutations/useDeleteDocument';
import useUpsertDocument from '@src/features/mutations/useUpsertDocument';
import useFetchLoyaltyCardWithCustomerInfoById from '@src/features/queries/useFetchLoyaltyCardWithCustomerInfoById';
import { InputFormField, SelectFormField } from '@src/pages/components/form';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import { usePrompt } from '@src/pages/components/hooks/usePrompt';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import ActionButton from '@src/pages/components/ui/ActionButton';
import ActionSheetButton, {
  ActionOption,
} from '@src/pages/components/ui/ActionSheetButton';
import { format } from 'date-fns';
import { use } from 'i18next';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

interface CustomerDetailsForm {
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
  points: number;
  stamps: number;
  membershipDate: Date;
  expiryDate?: Date;

  loyaltyProgramName: string;
}

const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { business } = useBusiness();
  const { data, refetch } = useFetchLoyaltyCardWithCustomerInfoById(id);
  const {
    mutate: upsertCustomer,
    isSuccess,
    isError,
    isPending,
  } = useUpsertDocument<Customer>('customers');
  const {
    mutate: batchDelete,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
    isPending: isDeletePending,
  } = useBatchDeleteDocument();

  const { push } = useIonRouter();
  const { showConfirmPrompt } = usePrompt();
  const { showNotification, showErrorNotification } = useAppNotifications();

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<CustomerDetailsForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  const onSubmit: SubmitHandler<CustomerDetailsForm> = async (formData) => {
    if (formData) {
      upsertCustomer({
        id: formData.customerId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
      });
    }
  };

  const handleDelete = () => {
    const itemsToDelete = [
      { id: getValues('id'), collectionName: 'loyaltyCards' },
      { id: getValues('customerId'), collectionName: 'customers' },
    ];

    batchDelete(itemsToDelete, {
      onSuccess: () => {
        showNotification('Customer and related data deleted successfully');
        push('/manage/customers', 'back', 'pop');
      },
      onError: (error) => {
        showErrorNotification('Failed to delete customer');
      },
    });
  };

  const handleActionComplete = (action: ActionOption) => {
    switch (action.data) {
      case 'delete':
        showConfirmPrompt({
          title: 'Delete Customer',
          message: 'Are you sure you want to delete this customer?',
          onConfirm: handleDelete,
        });
      case 'transaction-history':
        break;
    }
  };

  useEffect(() => {
    if (data) {
      reset({ ...data });
    }
  }, [data]);

  useEffect(() => {
    if (business && data) {
      const program = business.loyaltyPrograms.find(
        (lp: LoyaltyProgram) => lp.id === data.loyaltyProgramId
      );
      reset({ ...data, loyaltyProgramName: program?.name ?? '' });
    }
  }, [business, data]);

  useEffect(() => {
    const updateEffect = async () => {
      if (!isPending && isSuccess) {
        showNotification('Customer details updated successfully');
        await refetch();
      } else if (!isPending && isError) {
        showNotification('Failed to update customer details');
      }
    };
    updateEffect();
  }, [isSuccess, isError, isPending]);

  useEffect(() => {
    if (!isDeletePending && isDeleteSuccess) {
      showNotification('Customer details deleted successfully');
      push('/manage/customers', 'back', 'pop');
    } else if (!isDeletePending && isDeleteSuccess) {
      showNotification('Failed to delete customer details');
    }
  }, [isDeleteSuccess, isDeleteError, isDeletePending]);

  return (
    <BasePageLayout title='Details' defaultBackButtonHref='/manage/customers'>
      <CenterContainer>
        <div className='ion-margin'>Customer Details</div>
        <IonList lines='none'>
          <IonItem>
            <IonLabel>
              <InputFormField
                name='firstName'
                label='First Name'
                fill='outline'
                register={register}
                setValue={setValue}
              />
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <InputFormField
                name='lastName'
                label='Last Name'
                fill='outline'
                register={register}
                setValue={setValue}
              />
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <InputFormField
                name='email'
                label='Email'
                fill='outline'
                register={register}
                setValue={setValue}
              />
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <InputFormField
                name='phone'
                label='Phone'
                fill='outline'
                register={register}
                setValue={setValue}
              />
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <SelectFormField
                name='gender'
                label='Gender'
                fill='outline'
                register={register}
                setValue={setValue}
                getValues={getValues}
                optionsList={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'preferNotToSay', label: 'Prefer Not to Say' },
                ]}
              />
            </IonLabel>
          </IonItem>
        </IonList>

        <div className='ion-margin'>Card Details</div>
        <IonList lines='none'>
          <IonItem>
            <IonLabel>
              <InputFormField
                name='membershipNumber'
                label='Membership No (Generated)'
                fill='outline'
                register={register}
                readonly={true}
              />
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <InputFormField
                name='membershipDate'
                label='Member Since (Generated)'
                fill='outline'
                register={register}
                getValues={getValues}
                transformValue={(value) =>
                  value ? format(new Date(value), 'MMM dd, yyyy') : ''
                }
                readonly={true}
              />
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <InputFormField
                name='loyaltyProgramName'
                label='Loyalty Program'
                fill='outline'
                register={register}
                readonly={true}
              />
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <InputFormField
                name='points'
                label='Points'
                fill='outline'
                register={register}
                readonly={true}
              />
            </IonLabel>
          </IonItem>
        </IonList>

        <ActionButton
          label='Save'
          type='submit'
          expand='full'
          className='ion-margin'
          isLoading={isSubmitting}
          isDisabled={!isDirty}
          onClick={handleSubmit(onSubmit)}
        />

        <ActionSheetButton
          buttonLabel={'More...'}
          sheetTitle='More...'
          expand='full'
          fill='clear'
          options={[
            {
              text: 'Delete Customer',
              role: 'destructive',
              data: 'delete',
            },
            {
              text: 'Transaction History',
              data: 'transaction-history',
            },
          ]}
          onActionComplete={handleActionComplete}
        />
      </CenterContainer>
    </BasePageLayout>
  );
};
export default CustomerDetailsPage;
