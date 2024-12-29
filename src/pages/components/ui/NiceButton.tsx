import React from 'react';
import { IonButton, IonSpinner } from '@ionic/react';

interface ButtonProps extends React.ComponentProps<typeof IonButton> {
  isLoading: boolean;
  isDisabled: boolean;
  onClick?: () => void;
}

const NiceButton: React.FC<ButtonProps> = ({
  isLoading = false,
  isDisabled = false,
  onClick = () => {},
  children,
  ...rest
}) => {
  return (
    <IonButton onClick={onClick} disabled={isLoading || isDisabled} {...rest}>
      {isLoading ? (
        <IonSpinner name='dots' /> // Show spinner while loading
      ) : (
        children
      )}
    </IonButton>
  );
};

export default NiceButton;
