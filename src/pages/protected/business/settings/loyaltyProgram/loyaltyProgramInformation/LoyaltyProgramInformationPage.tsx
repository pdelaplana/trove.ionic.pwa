import { IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import {
  LoyaltyProgram,
  LoyaltyProgramType,
  useLoyaltyProgramValidationRules,
} from '@src/domain/entities/loyaltyProgram';
import getCurrency from '@src/domain/valueTypes/currency';
import { useBusiness } from '@src/features/business/BusinessProvider';
import {
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@src/pages/components/form';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import ActionButton from '@src/pages/components/ui/ActionButton';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface LoyaltyProgramForm {
  id: string;
  name: string;
  description: string;
  type: LoyaltyProgramType;
  pointsPerSpend: number;
  stampsPerVisit: number;
}

interface LoyaltyProgramInformationPageProps {}

const LoyaltyProgramInformationPage: React.FC<
  LoyaltyProgramInformationPageProps
> = ({}) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const { business, upsertLoyaltyProgram } = useBusiness();

  const [rewardTypes, setRewardTypes] = useState<
    { label: string; value: string }[]
  >([]);

  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram | null>();

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<LoyaltyProgramForm>({
    defaultValues: {
      id: loyaltyProgram?.id ?? '',
      name: loyaltyProgram?.name ?? 'Customer Rewards',
      description: loyaltyProgram?.description ?? '',
      type: loyaltyProgram?.type ?? 'pointsPerSpend',
      pointsPerSpend: loyaltyProgram?.pointsPerSpend ?? 1,
      stampsPerVisit: loyaltyProgram?.stampsPerPurchase ?? 0,
    },
  });

  const { showNotification } = useAppNotifications();

  const validationRules = useLoyaltyProgramValidationRules();

  const onSubmit: SubmitHandler<LoyaltyProgramForm> = async (formData) => {
    console.log('Loyalty program form data:', formData);
    if (!formData.id) formData.id = uuidv4();
    const loyaltyProgram: LoyaltyProgram = {
      ...formData,
      milestones: [],
      tiers: [],
    };
    await upsertLoyaltyProgram(loyaltyProgram);
    showNotification('Loyalty program saved successfully');
  };

  useEffect(() => {
    if (business) {
      setRewardTypes([
        {
          label: t('types.loyaltyProgramType.pointsPerSpend', {
            currency: getCurrency(business.currency)?.shortName,
          }),
          value: 'pointsPerSpend',
        },
        {
          label: t('types.loyaltyProgramType.stampsPerPurchase'),
          value: 'stampsPerPurchase',
        },
      ]);
    }
  }, [business]);

  useEffect(() => {
    if (business) {
      const program = business.loyaltyPrograms.find((p) => p.id === id);
      setLoyaltyProgram(program ?? null);
    }
  }, [id, business]);

  useEffect(() => {
    reset({ ...loyaltyProgram });
  }, [loyaltyProgram]);

  return (
    <BasePageLayout
      title='Loyalty Program'
      showProfileIcon={false}
      defaultBackButtonHref='/settings'
    >
      <CenterContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='ion-padding'>
            {loyaltyProgram?.id
              ? 'Edit Program'
              : 'Start a New Loyalty Program'}
          </div>

          <IonList lines='full'>
            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='name'
                  label='Program Name'
                  fill='outline'
                  type='text'
                  register={register}
                  setValue={setValue}
                  validationRules={validationRules.name}
                  error={errors?.name}
                />
              </IonLabel>
            </IonItem>
            <IonItem lines='none'>
              <IonLabel>
                <TextAreaFormField
                  name='description'
                  label='Program Description'
                  fill='outline'
                  register={register}
                  setValue={setValue}
                  validationRules={validationRules.description}
                  error={errors?.description}
                />
              </IonLabel>
            </IonItem>
            <IonItem lines='none'>
              <IonLabel>
                <SelectFormField
                  name='type'
                  label='Earning Type'
                  fill='outline'
                  register={register}
                  setValue={setValue}
                  getValues={getValues}
                  optionsList={rewardTypes}
                />
              </IonLabel>
            </IonItem>
            {watch('type') === 'pointsPerSpend' && (
              <IonItem lines='none'>
                <IonLabel>
                  <InputFormField
                    name='pointsPerSpend'
                    label='Earned Points Per Spend'
                    fill='outline'
                    type='number'
                    register={register}
                    setValue={setValue}
                    validationRules={validationRules.pointsPerSpend}
                    error={errors?.pointsPerSpend}
                  />
                </IonLabel>
              </IonItem>
            )}
            {watch('type') === 'stampsPerPurchase' && (
              <IonItem lines='none'>
                <IonLabel>
                  <InputFormField
                    name='stampsPerVisit'
                    label='Earned Stamps Per Purchase'
                    fill='outline'
                    type='number'
                    register={register}
                    setValue={setValue}
                    validationRules={validationRules.stampsPerVisit}
                    error={errors?.stampsPerVisit}
                  />
                </IonLabel>
              </IonItem>
            )}
          </IonList>

          <ActionButton
            label='Save'
            type='submit'
            color='primary'
            isLoading={status === 'pending'}
            isDisabled={!isDirty}
            className='ion-margin'
            expand='full'
          />
        </form>
      </CenterContainer>
    </BasePageLayout>
  );
};

export default LoyaltyProgramInformationPage;
