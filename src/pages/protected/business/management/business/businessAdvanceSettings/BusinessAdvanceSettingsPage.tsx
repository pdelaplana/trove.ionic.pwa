import { SubmitHandler, useForm } from 'react-hook-form';
import NiceButton from '@src/pages/components/ui/NiceButton';
import { useEffect } from 'react';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import BusinessPage from '../../../BusinessPage';
import { CenterContainer } from '@src/pages/components/layouts';
import { currencies, CurrencyCode } from '@src/domain/valueTypes/currency';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import { SelectFormField } from '@src/pages/components/form';

interface BusinessAdvanceSettingsPageProps {}

interface BusinessAdvanceSettingsForm {
  currency: CurrencyCode;
}

const BusinessAdvanceSettingsPage: React.FC<
  BusinessAdvanceSettingsPageProps
> = ({}) => {
  const { business, upsertAsync, status } = useBusiness();

  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors, isDirty },
    reset,
  } = useForm<BusinessAdvanceSettingsForm>({
    defaultValues: {
      currency: business?.currency ?? 'USD',
    },
  });

  const { showNotification } = useAppNotifications();

  const onSubmit: SubmitHandler<BusinessAdvanceSettingsForm> = async (
    formData
  ) => {
    upsertAsync({
      ...business!,
      currency: formData.currency,
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
      title='Regional Settings'
      defaultBackButtonHref='/manage/'
      showProfileIcon={false}
    >
      <CenterContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonList lines='none'>
            <IonItem lines='none'>
              <IonLabel>
                <SelectFormField
                  name='currency'
                  label='Preferred Currency'
                  fill='outline'
                  register={register}
                  setValue={setValue}
                  getValues={getValues}
                  optionsList={Object.entries(currencies).map(
                    ([code, { name }]) => {
                      return { value: code, label: name };
                    }
                  )}
                />
              </IonLabel>
            </IonItem>
          </IonList>
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

export default BusinessAdvanceSettingsPage;