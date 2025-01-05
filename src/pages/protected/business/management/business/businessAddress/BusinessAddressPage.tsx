import { Address } from '@src/domain';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import NiceButton from '@src/pages/components/ui/NiceButton';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import BusinessPage from '../../../BusinessPage';
import BusinessAddressForm from '../../../components/BusinessAddressForm';
import { CenterContainer } from '@src/pages/components/layouts';

interface BusinessAddressForm {
  id: string;
  address: Address;
}

const BusinessAddressPage: React.FC = () => {
  const { business, upsertAsync, status } = useBusiness();

  const { showNotification } = useAppNotifications();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<BusinessAddressForm>({
    defaultValues: {
      id: business?.id ?? '',
      address: {
        streetAddress1: business?.address.streetAddress1 ?? '',
        streetAddress2: business?.address.streetAddress2 ?? '',
        cityOrSuburb: business?.address.cityOrSuburb ?? '',
        stateOrProvince: business?.address.stateOrProvince ?? '',
        postCode: business?.address.postCode ?? '',
      },
    },
  });

  const onSubmit: SubmitHandler<BusinessAddressForm> = async (formData) => {
    upsertAsync({
      ...business!,
      address: {
        ...formData.address,
      },
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
      title='Address'
      defaultBackButtonHref='/manage'
      showProfileIcon={false}
    >
      <CenterContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <BusinessAddressForm register={register} setValue={setValue} />
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

export default BusinessAddressPage;
