import { IonItem, IonLabel, IonList, useIonRouter } from '@ionic/react';
import {
  LoyaltyProgramReward,
  useLoyaltyProgramMilestoneValidationRules,
} from '@src/domain/entities/loyaltyProgram';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { InputFormField, SelectFormField } from '@src/pages/components/form';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import {
  BasePageLayout,
  CenterContainer,
  ContentSection,
} from '@src/pages/components/layouts';
import ActionButton from '@src/pages/components/ui/ActionButton';
import DestructiveButton from '@src/pages/components/ui/DestructiveButton';
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';

interface LoyaltyProgramMilestoneForm {
  id: string;
  tierId: string;
  points: number;
  expiryInDays?: number;
  reward: LoyaltyProgramReward;
}

const LoyaltyProgramMilestonePage: React.FC = () => {
  const { t } = useTranslation();

  const { id, milestoneId } = useParams<{ id: string; milestoneId: string }>();
  const {
    business,
    upsertLoyaltyProgramMilestone,
    deleteLoyaltyProgramMilestone,
  } = useBusiness();

  const router = useIonRouter();
  const { showNotification } = useAppNotifications();

  const tiersSelectOptions = useMemo(() => {
    const program = business?.loyaltyPrograms?.find((l) => l.id === id);
    let tiers = [{ label: 'No Tier', value: '' }];
    if (program) {
      tiers = [
        ...tiers,
        ...program.tiers.map((t) => ({
          label: t.name,
          value: t.id,
        })),
      ];
    }
    return tiers;
  }, [id, business]);

  const rewardTypesSelectOptions = useMemo(() => {
    return [
      {
        value: 'discountPercentage',
        label: t('types.loyaltyProgramRewardType.discountPercentage'),
      },
      {
        value: 'discountFixedAmount',
        label: t('types.loyaltyProgramRewardType.discountFixedAmount'),
      },
      {
        value: 'freeProduct',
        label: t('types.loyaltyProgramRewardType.freeProduct'),
      },
      {
        value: 'pointsBonus',
        label: t('types.loyaltyProgramRewardType.pointsBonus'),
      },
    ];
  }, []);

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<LoyaltyProgramMilestoneForm>({
    defaultValues: {
      points: 0,
      reward: undefined,
    },
  });

  const validationRules = useLoyaltyProgramMilestoneValidationRules();

  const onSubmit: SubmitHandler<LoyaltyProgramMilestoneForm> = async (
    formData
  ) => {
    if (!formData.id) formData.id = uuidv4();
    upsertLoyaltyProgramMilestone(id, { ...formData });
    showNotification('Loyalty program saved successfully');
    router.push(`/settings/loyalty/${id}`, 'back', 'pop');
  };

  const onDelete = () => {
    if (getValues('id')) {
      deleteLoyaltyProgramMilestone(id, getValues('id'));
      showNotification('Loyalty program milestone deleted successfully');
      router.push(`/settings/loyalty/${id}`, 'back', 'pop');
    }
  };

  useEffect(() => {
    if (milestoneId) {
      const program = business?.loyaltyPrograms?.find((l) => l.id === id);
      if (program) {
        const foundMilestone = program.milestones.find(
          (m) => m.id === milestoneId
        );
        foundMilestone && reset({ ...foundMilestone });
      }
    } else {
      reset({
        id: '',
        tierId: '',
        points: 0,
        expiryInDays: 30,
        reward: undefined,
      });
    }
  }, [id, milestoneId, business]);

  return (
    <BasePageLayout
      title='Reward Milestones'
      defaultBackButtonHref={`/settings/loyalty/${id}`}
    >
      <CenterContainer>
        <ContentSection className='ion-margin'>
          <h1>Reward Milestones</h1>
          <p>
            Reward Milestones are a great way to reward your customers for their
            loyalty. You can create milestones that reward customers with points
            or perks when they reach a certain spending threshold.
          </p>
        </ContentSection>

        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem lines='none'>
            <IonLabel>
              <SelectFormField
                name='reward.rewardType'
                label='Type of reward'
                fill='outline'
                register={register}
                setValue={setValue}
                getValues={getValues}
                optionsList={rewardTypesSelectOptions}
                validationRules={validationRules.reward.rewardType}
                error={errors.reward?.rewardType}
              />
            </IonLabel>
          </IonItem>
          {watch('reward.rewardType') === 'discountPercentage' && (
            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='reward.discountPercentage'
                  label='Percentage Off'
                  fill='outline'
                  type='number'
                  register={register}
                  setValue={setValue}
                  validationRules={validationRules.reward.discountPercentage}
                  error={errors.reward?.discountPercentage}
                />
              </IonLabel>
            </IonItem>
          )}
          {watch('reward.rewardType') === 'discountFixedAmount' && (
            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='reward.discountFixedAmount'
                  label='Amount Off'
                  fill='outline'
                  type='number'
                  register={register}
                  setValue={setValue}
                  validationRules={validationRules.reward.discountFixedAmount}
                  error={errors.reward?.discountFixedAmount}
                />
              </IonLabel>
            </IonItem>
          )}
          {watch('reward.rewardType') === 'freeProduct' && (
            <>
              <IonItem lines='none'>
                <IonLabel>
                  <InputFormField
                    name='reward.freeProduct'
                    label='Product Name'
                    fill='outline'
                    register={register}
                    setValue={setValue}
                    validationRules={validationRules.reward.freeProduct}
                    error={errors.reward?.freeProduct}
                  />
                </IonLabel>
              </IonItem>
              <IonItem lines='none'>
                <IonLabel>
                  <InputFormField
                    name='reward.freeProductQuantity'
                    label='Quantity'
                    fill='outline'
                    type='number'
                    register={register}
                    setValue={setValue}
                    validationRules={validationRules.reward.freeProductQuantity}
                    error={errors.reward?.freeProductQuantity}
                  />
                </IonLabel>
              </IonItem>
            </>
          )}
          {watch('reward.rewardType') === 'pointsBonus' && (
            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='reward.pointsBonus'
                  label='Points Bonus'
                  fill='outline'
                  type='number'
                  register={register}
                  setValue={setValue}
                  validationRules={validationRules.reward.pointsBonus}
                  error={errors.reward?.pointsBonus}
                />
              </IonLabel>
            </IonItem>
          )}

          <IonList>
            <IonItem lines='none'>
              <IonLabel>
                <SelectFormField
                  name='tierId'
                  label='Tier (optional)'
                  fill='outline'
                  register={register}
                  setValue={setValue}
                  getValues={getValues}
                  optionsList={tiersSelectOptions ?? []}
                />
              </IonLabel>
            </IonItem>
            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='points'
                  label='Points Required'
                  type='number'
                  fill='outline'
                  register={register}
                  setValue={setValue}
                  validationRules={validationRules.points}
                  error={errors.points}
                />
              </IonLabel>
            </IonItem>

            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='expiryInDays'
                  label='Expires after (days)'
                  fill='outline'
                  type='number'
                  register={register}
                  setValue={setValue}
                  validationRules={validationRules.expiryInDays}
                  error={errors?.expiryInDays}
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
          />
          {getValues('id') && (
            <DestructiveButton
              label='Delete'
              prompt='Delete this milestone?'
              expand='full'
              className='ion-margin'
              onClick={() => onDelete()}
            />
          )}
        </form>
      </CenterContainer>
    </BasePageLayout>
  );
};
export default LoyaltyProgramMilestonePage;
