import { IonList, IonItem, IonLabel } from '@ionic/react';
import { Business } from '@src/domain';
import {
  LoyaltyProgram,
  LoyaltyProgramType,
  useLoyaltyProgramValidationRules,
} from '@src/domain/entities/loyaltyProgram';
import getCurrency from '@src/domain/valueTypes/currency';
import {
  InputFormField,
  TextAreaFormField,
  SelectFormField,
} from '@src/pages/components/form';
import ActionButton from '@src/pages/components/ui/ActionButton';
import { ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface LoyaltyProgramFormData {
  id: string;
  businessId: string;
  name: string;
  description: string;
  uniqueCode: string;
  type: LoyaltyProgramType;
  pointsPerSpend: number;
  stampsPerVisit: number;
}

interface LoyaltyProgramFormProps {
  business: Business | undefined;
  loyaltyProgram: LoyaltyProgram | undefined;
  onSubmit: (data: LoyaltyProgramFormData) => void;
}

const LoyaltyProgramForm: React.FC<LoyaltyProgramFormProps> = ({
  business,
  loyaltyProgram,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<LoyaltyProgramFormData>({
    defaultValues: {
      id: loyaltyProgram?.id ?? '',
      businessId: loyaltyProgram?.businessId ?? '',
      name: loyaltyProgram?.name ?? 'Customer Rewards',
      description: loyaltyProgram?.description ?? '',
      type: loyaltyProgram?.type ?? 'pointsPerSpend',
      pointsPerSpend: loyaltyProgram?.pointsPerSpend ?? 1,
      stampsPerVisit: loyaltyProgram?.stampsPerPurchase ?? 0,
    },
  });

  const validationRules = useLoyaltyProgramValidationRules();

  const [rewardTypes, setRewardTypes] = useState<
    { label: string; value: string }[]
  >([]);

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
    reset({ ...loyaltyProgram });
  }, [loyaltyProgram]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='ion-padding'>
        {loyaltyProgram?.id ? 'Edit Program' : 'Start a New Loyalty Program'}
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
        {loyaltyProgram?.uniqueCode && (
          <IonItem lines='none'>
            <IonLabel>
              <InputFormField
                name='uniqueCode'
                label='Unique Code'
                fill='outline'
                type='text'
                register={register}
                setValue={setValue}
                readonly={true}
              />
            </IonLabel>
          </IonItem>
        )}

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
  );
};
export default LoyaltyProgramForm;
export type { LoyaltyProgramFormData };
