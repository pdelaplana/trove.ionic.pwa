import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonRouterLink,
  IonText,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { Address, Business } from '@src/domain';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useAuth } from '@src/features/auth/AuthProvider';
import { defaultOperatingHours } from '@src/features/business/defaultValues';
import useUpsertBusiness from '@src/features/business/mutations/useUpsertBusiness';
import BusinessInformationForm from '../components/BusinessInformationForm';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import NiceButton from '@src/pages/components/ui/NiceButton';
import { CenterContainer } from '@src/pages/components/layouts';

interface BusinessOnboardingPageForm {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  website: string;
  phone: string;
  email: string;
  address: Address;
}

const BusinessOnboardingPage: React.FC = () => {
  const [shop, setShop] = useState<Business>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BusinessOnboardingPageForm>();

  const { setProfileData } = useAuth();

  const {
    mutateAsync: upsertBusinessAsync,
    error,
    isSuccess,
    isError,
    isPending,
  } = useUpsertBusiness();

  const router = useIonRouter();

  const { showNotification, showErrorNotification } = useAppNotifications();

  const [present] = useIonToast();

  const onSubmit: SubmitHandler<BusinessOnboardingPageForm> = async (
    formData
  ) => {
    const business = await upsertBusinessAsync({
      id: '',
      name: formData.name,
      description: formData.description,
      website: formData.website,
      phone: formData.phone,
      email: formData.email,
      logoUrl: '',
      address: {
        streetAddress1: '',
        streetAddress2: '',
        cityOrSuburb: '',
        stateOrProvince: '',
        postCode: '',
      },
      operatingHours: defaultOperatingHours,
    });
    setProfileData({ key: 'businessId', value: business.id });
  };

  useEffect(() => {
    if (isSuccess) {
      showNotification('Shop created successfully!');
      router.push('/home', 'forward', 'replace');
    }
    if (isError) {
      showErrorNotification('Failed to create shop');
    }
  }, [isSuccess, isError, shop]);

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent>
        <CenterContainer>
          <div className='ion-margin'>
            <h1 color='primary'>Set up your Business in Minutes</h1>
            <p color='medium'>
              We just need a few details to help you get started. You can edit
              these details later in your shop settings.
            </p>
          </div>

          <form id='onboarding-form' onSubmit={handleSubmit(onSubmit)}>
            <BusinessInformationForm register={register} errors={errors} />
          </form>

          <div className='ion-padding'>
            <IonText color='medium'>
              <small className='ion-margin-bottom'>
                By continuing, you agree to our{' '}
                <IonRouterLink> Terms of Service</IonRouterLink> and{' '}
                <IonRouterLink> Privacy Policy</IonRouterLink>.
              </small>
            </IonText>
            <NiceButton
              expand='full'
              type='submit'
              size='default'
              form='onboarding-form'
              className='ion-margin-top'
              isLoading={isPending}
              isDisabled={isPending}
            >
              Continue
            </NiceButton>
          </div>
        </CenterContainer>
      </IonContent>
    </IonPage>
  );
};

export default BusinessOnboardingPage;