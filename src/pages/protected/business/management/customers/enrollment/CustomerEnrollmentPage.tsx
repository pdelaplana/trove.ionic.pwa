import { IonList, IonItem, IonLabel, useIonRouter } from '@ionic/react';
import { LoyaltyProgram } from '@src/domain';
import { useBusiness } from '@src/features/business/BusinessProvider';
import useEnrollCustomerFunction from '@src/features/cloudFunctions/useEnrollCustomerFunction';
import {
  useFetchAllLoyaltyPrograms,
  useFetchLoyaltyProgramsByBusinessId,
} from '@src/features/queries';
import { InputFormField, SelectFormField } from '@src/pages/components/form';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import ActionButton from '@src/pages/components/ui/ActionButton';
import { useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface CustomerEnrollmentForm {
  name: string;
  email: string;
  phone: string;
  loyaltyProgramNumber: string;
}
const CustomerEnrollmentPage: React.FC = () => {
  const { business } = useBusiness();
  const { data: loyaltyPrograms } = useFetchLoyaltyProgramsByBusinessId(
    business?.id ?? ''
  );
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CustomerEnrollmentForm>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      loyaltyProgramNumber: '',
    },
  });

  const {
    mutateAsync: enrollCustomer,
    error,
    isPending,
    isSuccess,
  } = useEnrollCustomerFunction();

  const { showNotification, showErrorNotification } = useAppNotifications();

  const { push } = useIonRouter();

  const loyaltyProgramOptions = useMemo(() => {
    return (
      loyaltyPrograms?.map((lp: LoyaltyProgram) => ({
        value: lp.uniqueCode,
        label: lp.name,
      })) ?? []
    );
  }, [business, loyaltyPrograms]);

  const onSubmit: SubmitHandler<CustomerEnrollmentForm> = async (formData) => {
    enrollCustomer({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      loyaltyProgramNumber: formData.loyaltyProgramNumber,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      showNotification('Customer enrolled successfully');
      push('/manage/customers', 'back', 'pop');
    } else if (!isPending && error) {
      showErrorNotification('Failed to enroll customer');
    }
  }, [isSuccess, error]);

  return (
    <BasePageLayout
      title='Enroll Customers'
      defaultBackButtonHref='/manage/customers'
    >
      <CenterContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonList>
            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='name'
                  label='Name'
                  type='text'
                  fill='outline'
                  register={register}
                  setValue={setValue}
                  validationRules={{
                    required: 'Name is required',
                    minLength: {
                      value: 3,
                      message: 'Name must be at least 3 characters long',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Name must be less than 50 characters',
                    },
                  }}
                  error={errors?.name}
                />
              </IonLabel>
            </IonItem>
            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='email'
                  label='Email'
                  type='email'
                  fill='outline'
                  register={register}
                  setValue={setValue}
                  validationRules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid email address',
                    },
                  }}
                  error={errors?.email}
                />
              </IonLabel>
            </IonItem>
            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='phone'
                  label='Phone Number'
                  type='tel'
                  fill='outline'
                  register={register}
                  setValue={setValue}
                  /*
                  validationRules={{
                    required: 'Phone is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid phone address',
                    },
                  }}
                  */
                  error={errors?.phone}
                />
              </IonLabel>
            </IonItem>
            <IonItem lines='none'>
              <IonLabel>
                <SelectFormField
                  name='loyaltyProgramNumber'
                  label='Loyalty Program'
                  fill='outline'
                  register={register}
                  setValue={setValue}
                  optionsList={loyaltyProgramOptions}
                  error={errors?.loyaltyProgramNumber}
                  validationRules={{ required: 'Loyalty program is required' }}
                />
              </IonLabel>
            </IonItem>
          </IonList>
          <ActionButton
            label='Enroll Customer'
            type='submit'
            expand='block'
            isLoading={isPending}
            isDisabled={!isDirty}
            className='ion-margin'
          />
        </form>
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerEnrollmentPage;
function fetchLoyaltyProgramsByBusinessId(arg0: string) {
  throw new Error('Function not implemented.');
}
