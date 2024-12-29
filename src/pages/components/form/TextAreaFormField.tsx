import { IonTextarea } from '@ionic/react';
import { FieldError, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import ValidationError from './ValidationError';

interface TextAreaFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  register?: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  validationRules?: any;
  error?: FieldError;
  fill?: 'outline' | 'solid';
}

const TextAreaFormField: React.FC<TextAreaFormFieldProps> = ({
  name,
  label,
  placeholder,
  register,
  setValue,
  validationRules,
  error,
  fill,
}) => {
  return (
    <>
      <IonTextarea
        placeholder={placeholder ?? label}
        label={label}
        labelPlacement='floating'
        autoGrow={true}
        rows={5}
        {...(fill ? { fill } : {})}
        {...(register ? register(name, validationRules) : {})}
        {...(setValue
          ? {
              onIonChange: (e) =>
                setValue(name, e.detail.value, { shouldDirty: true }),
            }
          : {})}
      />
      <ValidationError error={error} />
    </>
  );
};

export default TextAreaFormField;
