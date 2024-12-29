import {
  IonList,
  IonItem,
  IonLabel,
  useIonModal,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonDatetime,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonButton,
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import {
  DayOfWeek,
  OperatingHours,
  operatingHoursValidationSchema,
} from '@src/domain/valueTypes/operatingHours';
import InputFormField from '@src/pages/components/form/InputFormField';
import { usePrompt } from '@src/pages/components/hooks/usePrompt';
import {
  CenterContainer,
  FixedBottomContainer,
} from '@src/pages/components/layouts';
import ModalPage from '@src/pages/components/modal/ModalPage';
import NiceButton from '@src/pages/components/ui/NiceButton';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useHoursSelector } from './HoursSelectorModal';
import { SelectFormField } from '@src/pages/components/form';

interface BusinessHoursForm {
  day: DayOfWeek;
  openAt: string;
  closeAt: string;
  isClosed: boolean;
}

interface BusinessHoursFormModalProps {
  hours?: OperatingHours;
  onDismiss: (data?: any, role?: string) => void;
}

const BusinessHoursFormModal: React.FC<BusinessHoursFormModalProps> = ({
  hours,
  onDismiss,
}) => {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<BusinessHoursForm>({
    defaultValues: {
      day: hours?.day ?? 'Monday',
      openAt: hours?.openAt ?? '',
      closeAt: hours?.closeAt ?? '',
      isClosed: hours?.isClosed ?? false,
    },
  });

  const { open: selectHours } = useHoursSelector();

  const { showConfirmPrompt } = usePrompt();

  const confirmAndDelete = async () => {
    showConfirmPrompt({
      title: 'Confirm Delete',
      message:
        'Cannot be undone. Are you sure you want to delete this service?',
      onConfirm: () => onDismiss(hours, 'delete'),
      onCancel: () => console.log('Alert canceled'),
    });
  };

  const onSubmit: SubmitHandler<BusinessHoursForm> = async (formData) => {
    onDismiss(formData, 'confirm');
  };

  const onDelete = async () => {
    confirmAndDelete();
  };

  const onOpenHoursSelector = async (
    field: 'openAt' | 'closeAt',
    title: string,
    initialTime?: string
  ) => {
    const { selectedTime, role } = await selectHours(title, initialTime);
    if (role === 'confirm') {
      setValue(field, selectedTime, { shouldDirty: true });
    }
  };

  return (
    <ModalPage title={'Add Operating Hours'} onDismiss={onDismiss}>
      <CenterContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonList lines='none'>
            <IonItem lines='full'>
              <IonLabel>
                <SelectFormField
                  name='day'
                  label='Day'
                  register={register}
                  setValue={setValue}
                  getValues={getValues}
                  validationRules={operatingHoursValidationSchema.day}
                  error={errors?.day}
                  optionsList={[
                    { label: 'Monday', value: 'Monday' },
                    { label: 'Tuesday', value: 'Tuesday' },
                    { label: 'Wednesday', value: 'Wednesday' },
                    { label: 'Thursday', value: 'Thursday' },
                    { label: 'Friday', value: 'Friday' },
                    { label: 'Saturday', value: 'Saturday' },
                    { label: 'Sunday', value: 'Sunday' },
                  ]}
                />
              </IonLabel>
            </IonItem>
            <IonItem lines='full'>
              <IonLabel>
                <InputFormField
                  name='openAt'
                  label='Opens At'
                  register={register}
                  setValue={setValue}
                  validationRules={operatingHoursValidationSchema.openAt}
                  error={errors?.openAt}
                  readonly={true}
                />
              </IonLabel>
              <IonButton
                slot='end'
                onClick={() =>
                  onOpenHoursSelector(
                    'openAt',
                    'Set Opening Time',
                    getValues('openAt')
                  )
                }
              >
                Select Hours
              </IonButton>
            </IonItem>
            <IonItem lines='full'>
              <IonLabel>
                <InputFormField
                  name='closeAt'
                  label='Closes At'
                  register={register}
                  setValue={setValue}
                  validationRules={operatingHoursValidationSchema.closeAt}
                  error={errors?.closeAt}
                  readonly={true}
                />
              </IonLabel>
              <IonButton
                slot='end'
                onClick={() =>
                  onOpenHoursSelector(
                    'closeAt',
                    'Set Closing Time',
                    getValues('closeAt')
                  )
                }
              >
                Select Hours
              </IonButton>
            </IonItem>
            <IonItem lines='full'>
              <IonLabel>
                <IonCheckbox
                  checked={getValues('isClosed')}
                  onIonChange={(e) => setValue('isClosed', e.detail.checked)}
                >
                  Closed Today
                </IonCheckbox>
              </IonLabel>
            </IonItem>
          </IonList>

          <NiceButton
            type='submit'
            disabled={!isDirty}
            className='ion-margin'
            isLoading={false}
            isDisabled={false}
            expand='full'
          >
            Save
          </NiceButton>
          {hours && hours.day && (
            <NiceButton
              expand='full'
              color='danger'
              className='ion-margin'
              isLoading={false}
              isDisabled={false}
              fill='clear'
              size='small'
              onClick={onDelete}
            >
              Delete
            </NiceButton>
          )}
        </form>
      </CenterContainer>
    </ModalPage>
  );
};

export default BusinessHoursFormModal;

export const useBusinessHoursFormModal = (): {
  open: (
    hours?: OperatingHours
  ) => Promise<{ updated: OperatingHours; role: string }>;
} => {
  const [inputs, setInputs] = useState<{
    hours: OperatingHours;
  }>();

  const [present, dismiss] = useIonModal(BusinessHoursFormModal, {
    hours: inputs?.hours,
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  return {
    open: (hours?: OperatingHours) => {
      setInputs({
        hours: hours ?? {
          day: 'Monday',
          openAt: '',
          closeAt: '',
          isClosed: false,
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
