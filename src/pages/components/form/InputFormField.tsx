import { IonInput } from '@ionic/react';
import ValidationError from './ValidationError';
import { FieldError, UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface InputFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  readonly?: boolean;
  fill?: 'outline' | 'solid';
  register?: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  validationRules?: any;
  error?: FieldError;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  onChange?: (e: CustomEvent) => void;
}

const InputFormField: React.FC<InputFormFieldProps> = ({
  name,
  label,
  placeholder,
  fill,
  register,
  setValue,
  validationRules,
  error,
  type = 'text',
  readonly = false,
}) => (
  <>
    <IonInput
      placeholder={placeholder ?? label}
      label={label}
      labelPlacement='floating'
      type={type}
      readonly={readonly}
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

export default InputFormField;
