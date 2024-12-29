import { IonList, IonItem, IonLabel, useIonModal } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { LoyaltyProgramTierPerk } from '@src/domain/entities/loyaltyProgram';
import { InputFormField, SelectFormField } from '@src/pages/components/form';
import { CenterContainer } from '@src/pages/components/layouts';
import ModalPage from '@src/pages/components/modal/ModalPage';
import DestructiveButton from '@src/pages/components/ui/DestructiveButton';
import NiceButton from '@src/pages/components/ui/NiceButton';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface LoyaltyProgramTierPerkForm {
  perkType: 'discount' | 'freeProduct' | 'pointsBonus';
  discountPercentage?: number;
  freeProduct?: string;
  pointsBonus?: number;
}

interface LoyaltyProgramTierPerkModalProps {
  perk?: LoyaltyProgramTierPerkForm;
  canDelete?: boolean;
  onDismiss: (data?: any, role?: string) => void;
}

const LoyaltyProgramTierPerkModal: React.FC<
  LoyaltyProgramTierPerkModalProps
> = ({ perk, canDelete, onDismiss }) => {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<LoyaltyProgramTierPerkForm>({
    defaultValues: {
      perkType: 'discount',
    },
  });

  const onSubmit: SubmitHandler<LoyaltyProgramTierPerkForm> = async (
    formData
  ) => {
    onDismiss(formData, 'confirm');
  };

  useEffect(() => {
    if (perk) {
      reset(perk);
    }
  }, [perk]);

  return (
    <ModalPage title={'Perks'} onDismiss={onDismiss}>
      <CenterContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonList>
            <IonItem lines='none'>
              <IonLabel>
                <SelectFormField
                  name={'perkType'}
                  label={'Type of Perk'}
                  fill='outline'
                  register={register}
                  setValue={setValue}
                  getValues={getValues}
                  optionsList={[
                    {
                      label: t('types.loyaltyProgramTierPerkType.discount'),
                      value: 'discount',
                    },
                    {
                      label: t('types.loyaltyProgramTierPerkType.freeProduct'),
                      value: 'freeProduct',
                    },
                    {
                      label: t(
                        'types.types.loyaltyProgramTierPerkType.pointsBonus'
                      ),
                      value: 'pointsBonus',
                    },
                  ]}
                />
              </IonLabel>
            </IonItem>
            {watch('perkType') !== undefined &&
              watch('perkType') === 'discount' && (
                <IonItem lines='none'>
                  <IonLabel>
                    <InputFormField
                      name={'discountPercentage'}
                      label={'Discount Percentage For Each Purchase'}
                      fill='outline'
                      type='number'
                      register={register}
                      setValue={setValue}
                    />
                  </IonLabel>
                </IonItem>
              )}

            {watch('perkType') !== undefined &&
              watch('perkType') === 'freeProduct' && (
                <IonItem lines='none'>
                  <IonLabel>
                    <InputFormField
                      name={'freeProduct'}
                      label={'Free Product'}
                      fill='outline'
                      type='text'
                      register={register}
                      setValue={setValue}
                    />
                  </IonLabel>
                </IonItem>
              )}
            {watch('perkType') !== undefined &&
              watch('perkType') === 'pointsBonus' && (
                <IonItem lines='none'>
                  <IonLabel>
                    <InputFormField
                      name={'pointsBonus'}
                      label={'Bonus Points Earned'}
                      fill='outline'
                      type='number'
                      register={register}
                      setValue={setValue}
                    />
                  </IonLabel>
                </IonItem>
              )}
          </IonList>
          <NiceButton
            type='submit'
            disabled={!isDirty || Object.keys(errors).length > 0}
            expand='full'
            className='ion-margin'
            isLoading={false}
            isDisabled={false}
          >
            Save
          </NiceButton>
          {canDelete && (
            <DestructiveButton
              label='Delete'
              prompt='Delete this perk?'
              expand='full'
              className='ion-margin'
              onClick={() => onDismiss({ ...getValues() }, 'delete')}
            />
          )}
        </form>
      </CenterContainer>
    </ModalPage>
  );
};

export default LoyaltyProgramTierPerkModal;

export const useLoyaltyProgramTierPerkModal = (): {
  open: (
    perk?: LoyaltyProgramTierPerk
  ) => Promise<{ updated: LoyaltyProgramTierPerk; role: string }>;
} => {
  const [inputs, setInputs] = useState<{
    perk: LoyaltyProgramTierPerk;
    canDelete: boolean;
  }>();

  const [present, dismiss] = useIonModal(LoyaltyProgramTierPerkModal, {
    perk: inputs?.perk,
    canDelete: inputs?.canDelete,
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  return {
    open: (perk?: LoyaltyProgramTierPerk) => {
      setInputs({
        canDelete: !!perk,
        perk: perk ?? {
          perkType: 'discount',
          discountPercentage: 2,
          freeProduct: '',
          pointsBonus: 0,
        },
      });
      return new Promise(async (resolve) => {
        present({
          onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
            if (ev.detail.role) {
              resolve({ updated: ev.detail.data, role: ev.detail.role });
            }
          },
        });
      });
    },
  };
};
