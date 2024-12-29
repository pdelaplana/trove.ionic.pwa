import { Address } from '@src/domain';

import { SubmitHandler, useForm } from 'react-hook-form';
import NiceButton from '@src/pages/components/ui/NiceButton';
import { useEffect } from 'react';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import BusinessInformationForm from '../../components/BusinessInformationForm';
import BusinessPage from '../../BusinessPage';
import { CenterContainer } from '@src/pages/components/layouts';
import { CurrencyCode } from '@src/domain/valueTypes/currency';

interface BusinessInformationPageProps {}

interface BusinessInformationForm {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  website: string;
  phone: string;
  email: string;
}

const BusinessInformationPage: React.FC<
  BusinessInformationPageProps
> = ({}) => {
  const { business, upsertAsync, status } = useBusiness();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<BusinessInformationForm>({
    defaultValues: {
      id: business?.id ?? '',
      name: business?.name ?? '',
      description: business?.description ?? '',
      logoUrl: business?.logoUrl ?? '',
      website: business?.website ?? '',
      phone: business?.phone ?? '',
      email: business?.email ?? '',
    },
  });

  const { showNotification } = useAppNotifications();

  const onSubmit: SubmitHandler<BusinessInformationForm> = async (formData) => {
    upsertAsync({
      ...business!,
      name: formData.name,
      description: formData.description,
      logoUrl: formData.logoUrl,
      website: formData.website,
      phone: formData.phone,
      email: formData.email,
    });
  };

  useEffect(() => {
    if (status === 'success') {
      showNotification('Shop updated successfully');
    } else if (status === 'error') {
      showNotification('Failed to update shop');
    }
  }, [status]);

  useEffect(() => {
    reset(business);
  }, [business]);

  return (
    <BusinessPage
      title='Edit Information'
      defaultBackButtonHref='/settings/'
      showProfileIcon={false}
    >
      <CenterContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <BusinessInformationForm
            register={register}
            errors={errors}
            setValue={setValue}
          />
          <NiceButton
            type='submit'
            color='primary'
            isLoading={status === 'pending'}
            isDisabled={!isDirty}
            className='ion-margin'
            expand='full'
          >
            Save
          </NiceButton>
        </form>
      </CenterContainer>
    </BusinessPage>
  );
};

export default BusinessInformationPage;
