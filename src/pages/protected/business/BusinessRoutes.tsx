import ProtectedRoute from '@src/pages/components/routing/ProtectedRoute';
import { Route, Switch } from 'react-router-dom';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import {
  business,
  ellipsisHorizontalOutline,
  homeOutline,
  peopleOutline,
} from 'ionicons/icons';
import { useAuth } from '@src/features/auth/AuthProvider';
import BusinessOnboardingPage from './onboarding/BusinessOnboardingPage';
import { BusinessProvider } from '@src/features/business/BusinessProvider';
import BusinessDashboardPage from './dashboard/BusinessDashboardPage';
import BusinessSettingsRoutes from './management/ManagementRoutes';
import { BUSINESSADMIN_ROUTES } from '@src/routesDefintion';
import CustomerDetailsPage from './customers/details/CustomerDetailsPage';
import CustomerEditPage from './customers/edit/CustomerEditPage';
import CustomersPage from './customers/CustomersPage';
import CustomerTransactionsListPage from './customers/activity/CustomerActivitiesPage';
import CustomerActivitiesPage from './customers/activity/CustomerActivitiesPage';
import CustomerActivityDetailsPage from './customers/activity/CustomerActivityDetailsPage';

interface BusinessRoutesProps {}

const TabRoutes = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          <ProtectedRoute path={BUSINESSADMIN_ROUTES.DASHBOARD}>
            <BusinessDashboardPage />
          </ProtectedRoute>

          <ProtectedRoute path={BUSINESSADMIN_ROUTES.MANAGE}>
            <BusinessSettingsRoutes />
          </ProtectedRoute>

          <ProtectedRoute path={BUSINESSADMIN_ROUTES.CUSTOMERS} exact>
            <CustomersPage />
          </ProtectedRoute>
        </Switch>
      </IonRouterOutlet>
      <IonTabBar slot='bottom'>
        <IonTabButton tab='home' href={BUSINESSADMIN_ROUTES.DASHBOARD}>
          <IonIcon aria-hidden='true' icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab='customers' href={BUSINESSADMIN_ROUTES.CUSTOMERS}>
          <IonIcon aria-hidden='true' icon={peopleOutline} />
          <IonLabel>Customers</IonLabel>
        </IonTabButton>

        <IonTabButton tab='manage' href={BUSINESSADMIN_ROUTES.MANAGE}>
          <IonIcon aria-hidden='true' icon={ellipsisHorizontalOutline} />
          <IonLabel>Manage</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const BusinessRoutes: React.FC<BusinessRoutesProps> = ({}) => {
  const { isAuthenticated, authStateLoading, user } = useAuth();

  if (!authStateLoading && !user?.businessId) {
    return <BusinessOnboardingPage />;
  }

  return (
    <BusinessProvider businessId={user?.businessId ?? ''}>
      <Switch>
        <ProtectedRoute path={BUSINESSADMIN_ROUTES.CUSTOMER_DETAILS} exact>
          <CustomerDetailsPage />
        </ProtectedRoute>

        <ProtectedRoute path='/customers/:id/edit' exact>
          <CustomerEditPage />
        </ProtectedRoute>

        <ProtectedRoute path='/customers/:id/activity' exact>
          <CustomerActivitiesPage />
        </ProtectedRoute>

        <ProtectedRoute path='/customers/:id/activity/:transactionId' exact>
          <CustomerActivityDetailsPage />
        </ProtectedRoute>

        <Route path='/'>
          <TabRoutes />
        </Route>
      </Switch>
    </BusinessProvider>
  );
};

export default BusinessRoutes;
