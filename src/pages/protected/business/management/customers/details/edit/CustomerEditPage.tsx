import { IonList, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { Customer } from '@src/domain';
import useDeleteDocument from '@src/features/mutations/useDeleteDocument';
import useUpsertDocument from '@src/features/mutations/useUpsertDocument';
import useFetchCustomerById from '@src/features/queries/useFetchCustomerById';
import { InputFormField, SelectFormField } from '@src/pages/components/form';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import ActionButton from '@src/pages/components/ui/ActionButton';
import DestructiveButton from '@src/pages/components/ui/DestructiveButton';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

interface CustomerEditForm {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday?: Date;
  gender: 'male' | 'female' | 'other' | 'preferNotToSay';
}

const CustomerEditPage: React.FC = () => {
  const { id, customerId } = useParams<{ id: string; customerId: string }>();
  const { data, refetch } = useFetchCustomerById(customerId);

  const { mutate: deleteDocument } = useDeleteDocument();
  const { push } = useIonRouter();

  const { showNotification, showErrorNotification } = useAppNotifications();

  const {
    mutate: upsertCustomer,
    isSuccess,
    isError,
    isPending,
  } = useUpsertDocument<Customer>('customers');

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<CustomerEditForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  const onSubmit: SubmitHandler<CustomerEditForm> = async (formData) => {
    if (formData) {
      upsertCustomer({
        id: formData.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
      });
    }
  };

  const onDelete = () => {
    if (getValues('id')) {
      deleteDocument({ id: getValues('id'), collectionName: 'customers' });
      showNotification('Customer deleted successfully');
      push(`/manage/customers`, 'back', 'pop');
    }
  };

  useEffect(() => {
    if (data) {
      reset({ ...data });
    }
  }, [data]);

  useEffect(() => {
    const updateEffect = async () => {
      if (!isPending && isSuccess) {
        showNotification('Customer details updated successfully');
        await refetch();
      } else if (!isPending && isError) {
        showErrorNotification('Failed to update customer details');
      }
    };
    updateEffect();
  }, [isSuccess, isError, isPending]);

  return (
    <BasePageLayout
      title='Edit Customer'
      defaultBackButtonHref={`/manage/customers/${id}`}
    >
      <CenterContainer>
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
        <ActionButton
          label='Save'
          type='submit'
          expand='full'
          className='ion-margin'
          isLoading={isSubmitting}
          isDisabled={!isDirty}
          onClick={handleSubmit(onSubmit)}
        />
        {getValues('id') && (
          <DestructiveButton
            label='Delete'
            prompt='Delete this customer?'
            expand='full'
            className='ion-margin'
            onClick={() => onDelete()}
          />
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerEditPage;
