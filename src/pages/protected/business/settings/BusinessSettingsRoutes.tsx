import { IonRouterOutlet } from '@ionic/react';
import ProtectedRoute from '@src/pages/components/routing/ProtectedRoute';
import BusinessInformationPage from './businesInformation/BusinessInformationPage';
import BusinessSettingsPage from './BusinessSettingsPage';
import BusinessAddressPage from './businessAddress/BusinessAddressPage';
import BusinessHoursPage from './businessHours/BusinessHoursPage';
import LoyaltyProgramPage from './loyaltyProgram/LoyaltyProgramPage';
import BusinessAdvanceSettingsPage from './businessAdvanceSettings/BusinessAdvanceSettingsPage';
import LoyaltyProgramInformationPage from './loyaltyProgram/loyaltyProgramInformation/LoyaltyProgramInformationPage';
import LoyaltyProgramTierPage from './loyaltyProgram/loyaltyProgramTiers/LoyaltyProgramTierPage';
import LoyaltyProgramMilestonePage from './loyaltyProgram/loyaltyProgramMilestones/LoyaltyProgramMilestonePage';

const BusinessSettingsRoutes: React.FC = () => {
  return (
    <IonRouterOutlet>
      <ProtectedRoute exact path='/settings/business/information'>
        <BusinessInformationPage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/settings/business/address'>
        <BusinessAddressPage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/settings/business/hours'>
        <BusinessHoursPage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/settings/business/advance'>
        <BusinessAdvanceSettingsPage />
      </ProtectedRoute>

      <ProtectedRoute exact path='/settings/loyalty/:id/edit'>
        <LoyaltyProgramInformationPage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/settings/loyalty/:id/tiers/new'>
        <LoyaltyProgramTierPage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/settings/loyalty/:id/tiers/:tierId'>
        <LoyaltyProgramTierPage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/settings/loyalty/:id/milestones/new'>
        <LoyaltyProgramMilestonePage />
      </ProtectedRoute>
      <ProtectedRoute
        exact
        path='/settings/loyalty/:id/milestones/:milestoneId'
      >
        <LoyaltyProgramMilestonePage />
      </ProtectedRoute>

      <ProtectedRoute exact path='/settings/loyalty/:id'>
        <LoyaltyProgramPage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/settings/loyalty/new'>
        <LoyaltyProgramInformationPage />
      </ProtectedRoute>

      <ProtectedRoute path='/settings' exact>
        <BusinessSettingsPage />
      </ProtectedRoute>
    </IonRouterOutlet>
  );
};

export default BusinessSettingsRoutes;
