import { useIonRouter } from '@ionic/react';

import { useBusiness } from '@src/features/business/BusinessProvider';
import { useLoyaltyProgram } from '@src/features/loyaltyProgram/LoyaltyProgramProvider';

import { useAppNotifications } from '@src/pages/components/hooks/useAppNotifications';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';

import { SubmitHandler } from 'react-hook-form';
import LoyaltyProgramForm, {
  LoyaltyProgramFormData,
} from '../../components/LoyaltyProgramForm';

interface LoyaltyProgramInformationPageProps {
  returnPath?: string;
}

const LoyaltyProgramInformationPage: React.FC<
  LoyaltyProgramInformationPageProps
> = ({ returnPath }) => {
  const { business } = useBusiness();
  const { loyaltyProgram, upsertLoyaltyProgram } = useLoyaltyProgram();

  const { showNotification } = useAppNotifications();

  const router = useIonRouter();

  const onSubmit: SubmitHandler<LoyaltyProgramFormData> = async (formData) => {
    upsertLoyaltyProgram({
      ...formData,
      businessId: business?.id ?? '',
      milestones: loyaltyProgram?.milestones ?? [],
      tiers: loyaltyProgram?.tiers ?? [],
    });
    showNotification('Loyalty program saved successfully');
    router.push(
      returnPath
        ? returnPath.replace(':id', loyaltyProgram?.id ?? '')
        : '/manage',
      'back',
      'pop'
    );
  };

  return (
    <BasePageLayout
      title='Loyalty Program'
      showProfileIcon={false}
      defaultBackButtonHref='/manage'
    >
      <CenterContainer>
        <LoyaltyProgramForm
          business={business}
          loyaltyProgram={loyaltyProgram}
          onSubmit={onSubmit}
        />
      </CenterContainer>
    </BasePageLayout>
  );
};

export default LoyaltyProgramInformationPage;
