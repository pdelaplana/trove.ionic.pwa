import {
  IonList,
  IonItem,
  IonLabel,
  IonRouterLink,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { useAuth } from '@src/features/auth/AuthProvider';
import useFetchCustomerByEmail from '@src/features/queries/useFetchCustomerByEmail';
import { InputFormField } from '@src/pages/components/form';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import ActionButton from '@src/pages/components/ui/ActionButton';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface CustomerOnboardingFormData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CustomerOnboardingPageProps {
  email: string;
}
const CustomerOnboardingPage: React.FC<CustomerOnboardingPageProps> = ({
  email,
}) => {
  const { setProfileData } = useAuth();
  const { data: customer } = useFetchCustomerByEmail(email);
  const { showNotification } = useAppNotifications();
  const { push } = useIonRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isLoading, isSubmitSuccessful },
  } = useForm<CustomerOnboardingFormData>();

  const onSubmit: SubmitHandler<CustomerOnboardingFormData> = async (
    formData
  ) => {
    setProfileData({ key: 'customerId', value: formData.id });
  };

  useEffect(() => {
    if (customer) {
      reset({ ...customer });
    }
  }, [customer]);

  useEffect(() => {
    showNotification('Thanks for confirming your details.');
    push('/home', 'forward', 'replace');
  }, [isSubmitSuccessful]);

  return (
    <BasePageLayout
      title='Onboarding'
      showProfileIcon={false}
      showHeader={true}
    >
      <CenterContainer>
        <div className='ion-margin'>
          <h1 color='primary'>Confirm your Details</h1>
          <p color='medium'>
            Let's confirm your details to get you started. This should only take
            a few minutes.
          </p>
        </div>
        <form id='onboarding-form' onSubmit={handleSubmit(onSubmit)}>
          <IonList lines='none'>
            <IonItem>
              <IonLabel>
                <InputFormField
                  name='firstName'
                  label='First Name'
                  placeholder='Enter your first name'
                  register={register}
                  validationRules={{ required: 'First Name is required' }}
                  error={errors?.firstName}
                  fill='outline'
                />
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <InputFormField
                  name='lastName'
                  label='Last Name'
                  placeholder='Enter your last name'
                  register={register}
                  validationRules={{ required: 'Last Name is required' }}
                  error={errors?.lastName}
                  fill='outline'
                />
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <InputFormField
                  name='email'
                  label='Email'
                  placeholder='Enter your email'
                  register={register}
                  validationRules={{ required: 'Email is required' }}
                  error={errors?.email}
                  fill='outline'
                />
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <InputFormField
                  name='phone'
                  label='Phone'
                  placeholder='Enter your phone number'
                  register={register}
                  validationRules={{ required: 'Phone number is required' }}
                  error={errors?.phone}
                  fill='outline'
                />
              </IonLabel>
            </IonItem>
          </IonList>
        </form>

        <div className='ion-padding'>
          <IonText color='medium'>
            <small className='ion-margin-bottom'>
              By continuing, you agree to our{' '}
              <IonRouterLink> Terms of Service</IonRouterLink> and{' '}
              <IonRouterLink> Privacy Policy</IonRouterLink>.
            </small>
          </IonText>
          <ActionButton
            expand='full'
            type='submit'
            size='default'
            form='onboarding-form'
            className='ion-margin-top'
            isLoading={isLoading}
            isDisabled={false}
            label='Continue'
          />
        </div>
      </CenterContainer>
    </BasePageLayout>
  );
};
export default CustomerOnboardingPage;
