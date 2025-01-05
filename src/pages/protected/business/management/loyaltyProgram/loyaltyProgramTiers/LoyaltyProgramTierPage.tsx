import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  useIonRouter,
} from '@ionic/react';
import {
  LoyaltyProgramTier,
  LoyaltyProgramTierPerk,
  useLoyaltyProgramTierValidationRules,
} from '@src/domain/entities/loyaltyProgram';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { InputFormField } from '@src/pages/components/form';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import { useEffect } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useLoyaltyProgramTierPerkModal } from './components/LoyaltyProgramTierPerkModal';
import LoyaltyProgramTierPerksList from './components/LoyaltyProgramTierPerksList';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import ActionButton from '@src/pages/components/ui/ActionButton';
import DestructiveButton from '@src/pages/components/ui/DestructiveButton';

interface LoyaltyProgramTierForm {
  id: string;
  name: string;
  pointsThreshold: number;
  perks: LoyaltyProgramTierPerk[];
}

const LoyaltyProgramTierPage: React.FC = () => {
  const { id, tierId } = useParams<{ id: string; tierId: string }>();
  const { business, upsertLoyaltyProgramTier, deleteLoyaltyProgramTier } =
    useBusiness();

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
    reset,
    control,
  } = useForm<LoyaltyProgramTierForm>({
    defaultValues: {
      id: '',
      name: '',
      pointsThreshold: 0,
      perks: [],
    },
  });

  const {
    fields: perks,
    update,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'perks',
  });

  const validationRules = useLoyaltyProgramTierValidationRules();

  const router = useIonRouter();
  const { showNotification } = useAppNotifications();

  const { open: openLoyaltyProgramTierPerkModal } =
    useLoyaltyProgramTierPerkModal();

  const onAddUpdateDeletePerk = async (perk?: LoyaltyProgramTierPerk) => {
    const { updated, role } = await openLoyaltyProgramTierPerkModal(perk);

    if (role === 'cancel') return;

    const perkIndex = perks.findIndex((p) => p.perkType === updated.perkType);
    if (role === 'delete') {
      remove(perkIndex);
      return;
    }

    if (perkIndex !== -1) {
      update(perkIndex, { ...updated });
    } else {
      append(updated);
    }
  };

  const onDelete = () => {
    if (getValues('id')) {
      deleteLoyaltyProgramTier(id, getValues('id'));
      showNotification('Loyalty program tier deleted successfully');
      router.push(`/manage/loyalty/${id}`);
    }
  };

  const onSubmit: SubmitHandler<LoyaltyProgramTierForm> = async (formData) => {
    if (!formData.id) formData.id = uuidv4();
    const loyaltyProgramTier: LoyaltyProgramTier = {
      ...formData,
    };
    upsertLoyaltyProgramTier(id, loyaltyProgramTier);
    showNotification('Loyalty program milestone saved successfully');
    router.push(`/manage/loyalty/${id}`, 'back', 'pop');
  };

  useEffect(() => {
    if (tierId) {
      const program = business?.loyaltyPrograms?.find((l) => l.id === id);
      if (program) {
        const foundTier = program.tiers.find((t) => t.id === tierId);
        reset({ ...foundTier });
      }
    } else {
      reset({
        id: '',
        name: '',
        pointsThreshold: 0,
        perks: [],
      });
    }
  }, [id, tierId, business]);

  return (
    <BasePageLayout
      title='Loyalty Program Tier'
      defaultBackButtonHref={`/manage/loyalty/${id}`}
    >
      <CenterContainer>
        <div className='ion-margin'>
          <h2>Tier</h2>
          <p>
            A tier is a level in your loyalty program that customers can reach
            by earning points. Each tier can offer unique perks and rewards,
            encouraging customers to engage more with your business.
          </p>
        </div>

        <form id='loyaltyProgramTierForm' onSubmit={handleSubmit(onSubmit)}>
          <IonList>
            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='name'
                  label='Name'
                  fill='outline'
                  type='text'
                  register={register}
                  setValue={setValue}
                  validationRules={validationRules.name}
                  error={errors.name}
                />
              </IonLabel>
            </IonItem>
            <IonItem lines='none'>
              <IonLabel>
                <InputFormField
                  name='pointsThreshold'
                  label='Points Treshold'
                  placeholder='Number of points before reaching this tier'
                  fill='outline'
                  type='number'
                  register={register}
                  setValue={setValue}
                  validationRules={validationRules.pointsThreshold}
                  error={errors.pointsThreshold}
                />
              </IonLabel>
            </IonItem>
          </IonList>
        </form>

        <LoyaltyProgramTierPerksList
          perks={perks || []}
          onAddUpdateDeletePerk={onAddUpdateDeletePerk}
        />

        <ActionButton
          label='Save'
          type='submit'
          color='primary'
          isLoading={isSubmitting}
          isDisabled={!isDirty}
          className='ion-margin'
          expand='full'
          form={'loyaltyProgramTierForm'}
        />
        {getValues('id') && (
          <DestructiveButton
            label='Delete'
            prompt='Delete this tier?'
            expand='full'
            className='ion-margin'
            onClick={() => onDelete()}
          />
        )}
      </CenterContainer>
    </BasePageLayout>
  );
};

export default LoyaltyProgramTierPage;
