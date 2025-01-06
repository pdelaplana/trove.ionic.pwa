import { IonRouterOutlet } from '@ionic/react';
import ProtectedRoute from '@src/pages/components/routing/ProtectedRoute';
import BusinessInformationPage from './business/businesInformation/BusinessInformationPage';
import BusinessSettingsPage from './ManagementPage';
import BusinessAddressPage from './business/businessAddress/BusinessAddressPage';

import LoyaltyProgramPage from './loyaltyProgram/LoyaltyProgramPage';
import BusinessAdvanceSettingsPage from './business/businessAdvanceSettings/BusinessAdvanceSettingsPage';
import LoyaltyProgramInformationPage from './loyaltyProgram/loyaltyProgramInformation/LoyaltyProgramInformationPage';
import LoyaltyProgramTierPage from './loyaltyProgram/loyaltyProgramTiers/LoyaltyProgramTierPage';
import LoyaltyProgramMilestonePage from './loyaltyProgram/loyaltyProgramMilestones/LoyaltyProgramMilestonePage';
import CustomerEnrollmentPage from './customers/enrollment/CustomerEnrollmentPage';
import BusinessHoursPage from './business/businessHours/BusinessHoursPage';
import CustomersListPage from './customers/customersList/CustomersListPage';
import CustomerDetailsPage from './customers/details/CustomerDetailsPage';
import CustomerTransactionsListPage from './customers/transactions/CustomerTransactionsListPage';

const ManagementRoutes: React.FC = () => {
  return (
    <IonRouterOutlet>
      <ProtectedRoute exact path='/manage/business/information'>
        <BusinessInformationPage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/manage/business/address'>
        <BusinessAddressPage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/manage/business/hours'>
        <BusinessHoursPage />
      </ProtectedRoute>
      <ProtectedRoute exact path='/manage/business/advance'>
        <BusinessAdvanceSettingsPage />
      </ProtectedRoute>

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
      <ProtectedRoute exact path='/manage/loyalty/new'>
        <LoyaltyProgramInformationPage />
      </ProtectedRoute>

      <ProtectedRoute path='/manage/customers/enroll' exact>
        <CustomerEnrollmentPage />
      </ProtectedRoute>
      <ProtectedRoute path='/manage/customers/details/:id' exact>
        <CustomerDetailsPage />
      </ProtectedRoute>
      <ProtectedRoute
        path='/manage/customers/details/:id/transactions/:customerId'
        exact
      >
        <CustomerTransactionsListPage />
      </ProtectedRoute>
      <ProtectedRoute path='/manage/customers' exact>
        <CustomersListPage />
      </ProtectedRoute>

      <ProtectedRoute path='/manage' exact>
        <BusinessSettingsPage />
      </ProtectedRoute>
    </IonRouterOutlet>
  );
};

export default ManagementRoutes;
