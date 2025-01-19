import { useBusiness } from '@src/features/business/BusinessProvider';
import useUpsertLoyaltyProgram from '@src/features/mutations/useUpsertLoyaltyProgram';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { SubmitHandler } from 'react-hook-form';
import LoyaltyProgramForm, {
  LoyaltyProgramFormData,
} from '../components/LoyaltyProgramForm';
import { useIonRouter } from '@ionic/react';
import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';

const NewLoyaltyProgramPage = () => {
  const { business } = useBusiness();
  const { mutateAsync: upsertLoyaltyProgram } = useUpsertLoyaltyProgram();

  const { showNotification } = useAppNotifications();

  const { push } = useIonRouter();

  const onSubmit: SubmitHandler<LoyaltyProgramFormData> = async (formData) => {
    upsertLoyaltyProgram({
      ...formData,
      businessId: business?.id ?? '',
      milestones: [],
      tiers: [],
    });
    showNotification('Loyalty program saved successfully');
    push('/manage', 'back', 'pop');
  };

  return (
    <BasePageLayout
      title='New Loyalty Program'
      showProfileIcon={false}
      defaultBackButtonHref='/manage'
    >
      <CenterContainer>
        <LoyaltyProgramForm
          business={business}
          loyaltyProgram={undefined}
          onSubmit={onSubmit}
        />
      </CenterContainer>
    </BasePageLayout>
  );
};

export default NewLoyaltyProgramPage;
