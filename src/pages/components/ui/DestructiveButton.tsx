import { IonButton } from '@ionic/react';
import { usePrompt } from '../hooks/usePrompt';

const DestructiveButton = ({
  label,
  prompt,
  expand,
  onClick,
  ...rest
}: {
  label: string;
  prompt: string;
  expand: 'full' | 'block' | undefined;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLIonButtonElement>) => {
  const { showConfirmPrompt } = usePrompt();

  const handleClick = async () => {
    showConfirmPrompt({
      title: 'Confirm',
      message: prompt,
      onConfirm: () => onClick(),
      onCancel: () => console.log('Alert canceled'),
    });
  };

  return (
    <IonButton
      color='danger'
      fill='clear'
      size='small'
      expand={expand}
      onClick={handleClick}
      {...rest}
    >
      {label}
    </IonButton>
  );
};

export default DestructiveButton;
