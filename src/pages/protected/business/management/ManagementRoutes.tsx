import { IonRouterOutlet } from '@ionic/react';
import ProtectedRoute from '@src/pages/components/routing/ProtectedRoute';
import BusinessInformationPage from './business/businesInformation/BusinessInformationPage';
import BusinessSettingsPage from './ManagementPage';
import BusinessAddressPage from './business/businessAddress/BusinessAddressPage';

import BusinessAdvanceSettingsPage from './business/businessAdvanceSettings/BusinessAdvanceSettingsPage';
import LoyaltyProgramInformationPage from './loyaltyProgram/details/loyaltyProgramInformation/LoyaltyProgramInformationPage';
import CustomerEnrollmentPage from './customers/enrollment/CustomerEnrollmentPage';
import BusinessHoursPage from './business/businessHours/BusinessHoursPage';
import CustomersListPage from './customers/list/CustomersListPage';
import { Switch } from 'react-router';
import CustomerEarnPointsPage from './customers/earn/CustomerEarnPointsPage';
import { LoyaltyProgramRoutes } from './loyaltyProgram/LoyaltyProgramRoutes';
import { CustomerDetailsRoutes } from './customers/CustomerDetailsRoutes';
import NewLoyaltyProgramPage from './loyaltyProgram/new/NewLoyaltyProgramPage';

const ManagementRoutes: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Switch>
        {/* Business Routes */}
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

        {/* Loyalty Program Routes */}
        <ProtectedRoute exact path='/manage/loyalty/new'>
          <NewLoyaltyProgramPage />
        </ProtectedRoute>
        <ProtectedRoute path='/manage/loyalty/:id'>
          <LoyaltyProgramRoutes />
        </ProtectedRoute>

        {/* Customer Routes */}
        <ProtectedRoute path='/manage/customers/enroll' exact>
          <CustomerEnrollmentPage />
        </ProtectedRoute>

        {/* Customer Earn Points */}
        <ProtectedRoute path='/manage/customers/earn' exact>
          <CustomerEarnPointsPage />
        </ProtectedRoute>

        {/* Customer Details */}
        <ProtectedRoute path='/manage/customers/:id'>
          <CustomerDetailsRoutes />
        </ProtectedRoute>

        <ProtectedRoute path='/manage/customers' exact>
          <CustomersListPage />
        </ProtectedRoute>

        <ProtectedRoute path='/manage' exact>
          <BusinessSettingsPage />
        </ProtectedRoute>
      </Switch>
    </IonRouterOutlet>
  );
};

export default ManagementRoutes;
