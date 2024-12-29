import { IonList, IonItem, IonLabel } from '@ionic/react';
import { useAddressValidationRules } from '@src/domain/valueTypes/address';
import InputFormField from '@src/pages/components/form/InputFormField';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface BusinessAddressFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors?: FieldErrors<{
    streetAddress1: string;
    streetAddress2: string;
    cityOrSuburb: string;
    stateOrProvince: string;
    postCode: string;
  }>;
}

const BusinessAddressForm: React.FC<BusinessAddressFormProps> = ({
  register,
  setValue,
  errors,
}) => {
  const validationRules = useAddressValidationRules();
  return (
    <IonList lines='none'>
      <IonItem lines='none'>
        <IonLabel>
          <InputFormField
            name='address.streetAddress1'
            label='Street'
            register={register}
            setValue={setValue}
            type='text'
            fill='outline'
            validationRules={validationRules.streetAddress1}
            error={errors?.streetAddress1}
          />
        </IonLabel>
      </IonItem>
      <IonItem lines='none'>
        <IonLabel>
          <InputFormField
            name='address.streetAddress2'
            label='Unit / Apt / Other (Optional)'
            register={register}
            setValue={setValue}
            type='text'
            fill='outline'
            //validationRules={validationRules.streetAddress2}
            error={errors?.streetAddress2}
          />
        </IonLabel>
      </IonItem>
      <IonItem lines='none'>
        <IonLabel>
          <InputFormField
            name='address.cityOrSuburb'
            label='City'
            register={register}
            setValue={setValue}
            type='text'
            fill='outline'
            validationRules={validationRules.cityOrSuburb}
            error={errors?.cityOrSuburb}
          />
        </IonLabel>
      </IonItem>
      <IonItem lines='none'>
        <IonLabel>
          <InputFormField
            name='address.stateOrProvince'
            label='Province'
            register={register}
            setValue={setValue}
            type='text'
            fill='outline'
            validationRules={validationRules.stateOrProvince}
            error={errors?.stateOrProvince}
          />
        </IonLabel>
      </IonItem>
      <IonItem lines='none'>
        <IonLabel>
          <InputFormField
            name='address.postCode'
            label='Post Code'
            register={register}
            setValue={setValue}
            type='text'
            fill='outline'
            //validationRules={validationRules.postCode}
            error={errors?.postCode}
          />
        </IonLabel>
      </IonItem>
    </IonList>
  );
};

export default BusinessAddressForm;
