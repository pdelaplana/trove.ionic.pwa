import {
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonNote,
  IonPopover,
  IonToggle,
  useIonRouter,
} from '@ionic/react';

import { useBusiness } from '@src/features/business/BusinessProvider';
import {
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@src/pages/components/form';
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
import {
  LoyaltyProgramMilestone,
  LoyaltyProgramReward,
  LoyaltyProgramTier,
} from '@src/domain';
import { useLoyaltyProgram } from '@src/features/loyaltyProgram/LoyaltyProgramProvider';
import {
  LoyaltyProgramRewardDiscountFixedAmount,
  LoyaltyProgramRewardDiscountPercentage,
  LoyaltyProgramRewardFreeProduct,
  LoyaltyProgramRewardPointsBonus,
  LoyaltyProgramRewardPromoCode,
  LoyaltyProgramRewardType,
  useLoyaltyProgramMilestoneValidationRules,
} from '@src/domain/entities/loyaltyProgramReward';

interface LoyaltyProgramMilestoneForm {
  id: string;
  tierId: string;
  points: number;
  expiryInDays?: number;
  validUntilDate?: Date;
  name?: string;
  description?: string;
  termsAndConditions?: string;
  imageUrl?: string;
  rewardType: LoyaltyProgramRewardType;
  discountPercentage?: number;
  discountFixedAmount?: number;
  freeProduct?: string;
  freeProductQuantity?: number;
  pointsBonus?: number;
  promoCode?: string;
}

const LoyaltyProgramMilestonePage: React.FC = () => {
  const { t } = useTranslation();

  const { milestoneId } = useParams<{ milestoneId: string }>();

  const {
    loyaltyProgram,
    upsertLoyaltyProgramMilestone,
    deleteLoyaltyProgramMilestone,
  } = useLoyaltyProgram();

  const router = useIonRouter();
  const { showNotification } = useAppNotifications();

  const tiersSelectOptions = useMemo(() => {
    let tiers = [{ label: 'No Tier', value: '' }];
    if (loyaltyProgram) {
      tiers = [
        ...tiers,
        ...loyaltyProgram.tiers.map((t: LoyaltyProgramTier) => ({
          label: t.name,
          value: t.id,
        })),
      ];
    }
    return tiers;
  }, [loyaltyProgram]);

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
      {
        value: 'promoCode',
        label: t('types.loyaltyProgramRewardType.promoCode'),
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
      expiryInDays: 30,
      rewardType: 'discountPercentage',
    },
  });

  const validationRules = useLoyaltyProgramMilestoneValidationRules();

  const onSubmit: SubmitHandler<LoyaltyProgramMilestoneForm> = async (
    formData
  ) => {
    if (!formData.id) formData.id = uuidv4();

    const milestone: LoyaltyProgramMilestone = {
      id: formData.id,
      tierId: formData.tierId,
      points: formData.points,
      reward: {
        name: formData.name ?? '',
        rewardType: formData.rewardType,
        description: formData.description,
        imageUrl: '',
        termsAndConditions: formData.termsAndConditions,
        expiryInDays: formData.expiryInDays,
        validUntilDate: formData.validUntilDate
          ? new Date(formData.validUntilDate)
          : new Date(),
      },
    };

    switch (formData.rewardType) {
      case 'discountPercentage':
        milestone.reward = {
          ...milestone.reward,
          discountPercentage: formData.discountPercentage,
        } as LoyaltyProgramRewardDiscountPercentage;
        break;
      case 'discountFixedAmount':
        milestone.reward = {
          ...milestone.reward,
          discountFixedAmount: formData.discountFixedAmount,
        } as LoyaltyProgramRewardDiscountFixedAmount;
        break;
      case 'freeProduct':
        milestone.reward = {
          ...milestone.reward,
          freeProduct: formData.freeProduct,
          freeProductQuantity: formData.freeProductQuantity,
        } as LoyaltyProgramRewardFreeProduct;
        break;
      case 'pointsBonus':
        milestone.reward = {
          ...milestone.reward,
          pointsBonus: formData.pointsBonus,
        } as LoyaltyProgramRewardPointsBonus;
        break;
      case 'promoCode':
        milestone.reward = {
          ...milestone.reward,
          promoCode: formData.promoCode,
        } as LoyaltyProgramRewardPromoCode;
        break;
    }

    upsertLoyaltyProgramMilestone(milestone);
    showNotification('Loyalty program saved successfully');
    router.push(`/manage/loyalty/${loyaltyProgram?.id}`, 'back', 'pop');
  };

  const onDelete = () => {
    if (getValues('id')) {
      deleteLoyaltyProgramMilestone(getValues('id'));
      showNotification('Loyalty program milestone deleted successfully');
      router.push(`/manage/loyalty/${loyaltyProgram?.id}`, 'back', 'pop');
    }
  };

  useEffect(() => {
    if (milestoneId && milestoneId !== 'new') {
      if (loyaltyProgram) {
        const foundMilestone = loyaltyProgram.milestones.find(
          (m: LoyaltyProgramMilestone) => m.id === milestoneId
        );
        foundMilestone &&
          reset({
            id: foundMilestone.id,
            tierId: foundMilestone.tierId ?? '',
            points: foundMilestone.points,
            expiryInDays: foundMilestone.reward.expiryInDays ?? 30,
            validUntilDate: foundMilestone.reward.validUntilDate,
            rewardType: foundMilestone.reward.rewardType,
            name: foundMilestone.reward.name,
            description: foundMilestone.reward.description,
            termsAndConditions: foundMilestone.reward.termsAndConditions,
            discountFixedAmount: (
              foundMilestone.reward as LoyaltyProgramRewardDiscountFixedAmount
            ).discountFixedAmount,
            discountPercentage: (
              foundMilestone.reward as LoyaltyProgramRewardDiscountPercentage
            ).discountPercentage,
            freeProduct: (
              foundMilestone.reward as LoyaltyProgramRewardFreeProduct
            ).freeProduct,
            freeProductQuantity: (
              foundMilestone.reward as LoyaltyProgramRewardFreeProduct
            ).freeProductQuantity,
            pointsBonus: (
              foundMilestone.reward as LoyaltyProgramRewardPointsBonus
            ).pointsBonus,
            promoCode: (foundMilestone.reward as LoyaltyProgramRewardPromoCode)
              .promoCode,
          });
      }
    } else {
      reset({
        id: '',
        tierId: '',
        points: 0,
        expiryInDays: 30,
        rewardType: 'discountPercentage',
      });
    }
  }, [milestoneId, loyaltyProgram]);

  return (
    <BasePageLayout
      title='Reward Milestones'
      defaultBackButtonHref={`/manage/loyalty/${loyaltyProgram?.id}`}
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
          <IonList>
            <IonItem lines='none'>
              <IonLabel>
                <SelectFormField
                  name='rewardType'
                  label='Type of reward'
                  fill='outline'
                  register={register}
                  setValue={setValue}
                  getValues={getValues}
                  optionsList={rewardTypesSelectOptions}
                  validationRules={validationRules.reward.rewardType}
                  error={errors.rewardType}
                />
              </IonLabel>
            </IonItem>
            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='name'
                  label='Name'
                  fill='outline'
                  register={register}
                  setValue={setValue}
                  validationRules={validationRules.reward.name}
                  error={errors.name}
                />
              </IonLabel>
            </IonItem>
            <IonItem lines='none'>
              <IonLabel>
                <TextAreaFormField
                  name='description'
                  label='Description'
                  fill='outline'
                  register={register}
                  setValue={setValue}
                />
              </IonLabel>
            </IonItem>

            {watch('rewardType') === 'discountPercentage' && (
              <IonItem lines='none'>
                <IonLabel>
                  <InputFormField
                    name='discountPercentage'
                    label='Percentage Off'
                    fill='outline'
                    type='number'
                    register={register}
                    setValue={setValue}
                    validationRules={validationRules.reward.discountPercentage}
                    error={errors.discountPercentage}
                  />
                </IonLabel>
              </IonItem>
            )}
            {watch('rewardType') === 'discountFixedAmount' && (
              <IonItem lines='none'>
                <IonLabel>
                  <InputFormField
                    name='discountFixedAmount'
                    label='Amount Off'
                    fill='outline'
                    type='number'
                    register={register}
                    setValue={setValue}
                    validationRules={validationRules.reward.discountFixedAmount}
                    error={errors.discountFixedAmount}
                  />
                </IonLabel>
              </IonItem>
            )}
            {watch('rewardType') === 'freeProduct' && (
              <>
                <IonItem lines='none'>
                  <IonLabel>
                    <InputFormField
                      name='freeProduct'
                      label='Product Name'
                      fill='outline'
                      register={register}
                      setValue={setValue}
                      validationRules={validationRules.reward.freeProduct}
                      error={errors.freeProduct}
                    />
                  </IonLabel>
                </IonItem>
                <IonItem lines='none'>
                  <IonLabel>
                    <InputFormField
                      name='freeProductQuantity'
                      label='Quantity'
                      fill='outline'
                      type='number'
                      register={register}
                      setValue={setValue}
                      validationRules={
                        validationRules.reward.freeProductQuantity
                      }
                      error={errors.freeProductQuantity}
                    />
                  </IonLabel>
                </IonItem>
              </>
            )}
            {watch('rewardType') === 'pointsBonus' && (
              <IonItem lines='none'>
                <IonLabel>
                  <InputFormField
                    name='pointsBonus'
                    label='Points Bonus'
                    fill='outline'
                    type='number'
                    register={register}
                    setValue={setValue}
                    validationRules={validationRules.reward.pointsBonus}
                    error={errors.pointsBonus}
                  />
                </IonLabel>
              </IonItem>
            )}
            {watch('rewardType') === 'promoCode' && (
              <IonItem lines='none'>
                <IonLabel>
                  <InputFormField
                    name='promoCode'
                    label='Promo Code'
                    fill='outline'
                    type='text'
                    register={register}
                    setValue={setValue}
                    validationRules={validationRules.reward.pointsBonus}
                    error={errors.promoCode}
                  />
                </IonLabel>
              </IonItem>
            )}

            <IonItem lines='none'>
              <IonLabel>Criteria</IonLabel>
            </IonItem>

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
              <IonLabel>Validity</IonLabel>
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
            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='validUntilDate'
                  label='Valid Until'
                  fill='outline'
                  type='date'
                  register={register}
                  setValue={setValue}
                  error={errors?.validUntilDate}
                />
              </IonLabel>
              <IonLabel className='' slot='end'>
                <IonToggle labelPlacement='end' alignment='center'></IonToggle>{' '}
              </IonLabel>
            </IonItem>
            <IonItem lines='none'>
              <IonLabel>
                <TextAreaFormField
                  name='termsAndConditions'
                  label='Terms and Conditions'
                  fill='outline'
                  register={register}
                  setValue={setValue}
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
