import ProtectedRoute from '@src/pages/components/routing/ProtectedRoute';
import LoyaltyProgramInformationPage from './details/loyaltyProgramInformation/LoyaltyProgramInformationPage';
import LoyaltyProgramMilestonePage from './details/loyaltyProgramMilestones/LoyaltyProgramMilestonePage';
import LoyaltyProgramPage from './details/LoyaltyProgramPage';
import LoyaltyProgramTierPage from './details/loyaltyProgramTiers/LoyaltyProgramTierPage';
import { LoyaltyProgramProvider } from '@src/features/loyaltyProgram/LoyaltyProgramProvider';
import { useParams } from 'react-router-dom';
import { useBusiness } from '@src/features/business/BusinessProvider';

export const LoyaltyProgramRoutes: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { business } = useBusiness();

  return (
    <LoyaltyProgramProvider
      loyaltyProgramId={id}
      businessId={business?.id ?? ''}
    >
      <ProtectedRoute exact path='/manage/loyalty/:id/edit'>
        <LoyaltyProgramInformationPage returnPath='/manage/loyalty/:id' />
      </ProtectedRoute>
      <ProtectedRoute exact path='/manage/loyalty/:id/tiers/new'>
        <LoyaltyProgramTierPage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/manage/loyalty/:id/tiers/:tierId'>
        <LoyaltyProgramTierPage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/manage/loyalty/:id/milestones/new'>
        <LoyaltyProgramMilestonePage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/manage/loyalty/:id/milestones/:milestoneId'>
        <LoyaltyProgramMilestonePage />
      </ProtectedRoute>

      <ProtectedRoute exact path='/manage/loyalty/:id'>
        <LoyaltyProgramPage />
      </ProtectedRoute>
    </LoyaltyProgramProvider>
  );
};
