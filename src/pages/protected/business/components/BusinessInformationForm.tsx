import { IonList, IonItem, IonLabel } from '@ionic/react';
import { useBusinessValidationRules } from '@src/domain/entities/business';
import InputFormField from '@src/pages/components/form/InputFormField';
import TextAreaFormField from '@src/pages/components/form/TextAreaFormField';
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormGetValues,
} from 'react-hook-form';

interface ShopInformationFormProps {
  register: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  getValues?: UseFormGetValues<any>;
  errors?: FieldErrors<{
    name: string;
    description: string;
    email: string;
    website: string;
    phone: string;
  }>;
}

const BusinessInformationForm: React.FC<ShopInformationFormProps> = ({
  register,
  setValue,
  errors,
}) => {
  const validationRules = useBusinessValidationRules();

  return (
    <>
      <div className='ion-padding'>Business Information</div>
      <IonList lines='none' className='ion-no-padding ion-no-margin'>
        <IonItem lines='none'>
          <IonLabel>
            <InputFormField
              name='name'
              label='Name'
              placeholder={`What's your business called`}
              register={register}
              setValue={setValue}
              validationRules={validationRules.name}
              error={errors?.name}
              fill='outline'
            />
          </IonLabel>
        </IonItem>
        <IonItem lines='none'>
          <IonLabel>
            <TextAreaFormField
              name='description'
              label='Description'
              placeholder='Tell us a little bit about what your business do (optional)'
              register={register}
              setValue={setValue}
              error={errors?.description}
              validationRules={validationRules.description}
              fill='outline'
            />
          </IonLabel>
        </IonItem>

        <IonItem lines='none'>
          <IonLabel>
            <InputFormField
              name='email'
              label='Email'
              placeholder='Where can your customers reach you'
              register={register}
              setValue={setValue}
              error={errors?.email}
              type='email'
              validationRules={validationRules.email}
              fill='outline'
            />
          </IonLabel>
        </IonItem>
        <IonItem lines='none'>
          <IonLabel>
            <InputFormField
              name='phone'
              label='Phone'
              placeholder='Add a contact number for support or enquiries'
              register={register}
              setValue={setValue}
              error={errors?.phone}
              validationRules={validationRules.phone}
              fill='outline'
            />
          </IonLabel>
        </IonItem>
        <IonItem lines='none'>
          <IonLabel>
            <InputFormField
              name='website'
              label='Website'
              placeholder='Do you have a website? This helps customers find your store online.'
              register={register}
              setValue={setValue}
              error={errors?.website}
              validationRules={validationRules.website}
              fill='outline'
            />
          </IonLabel>
        </IonItem>
      </IonList>
    </>
  );
};

export default BusinessInformationForm;
