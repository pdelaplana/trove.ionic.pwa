import ProtectedRoute from '@src/pages/components/routing/ProtectedRoute';
import { Switch } from 'react-router-dom';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import {
  ellipsisHorizontalOutline,
  homeOutline,
  peopleOutline,
} from 'ionicons/icons';
import { useAuth } from '@src/features/auth/AuthProvider';
import BusinessOnboardingPage from './onboarding/BusinessOnboardingPage';
import { BusinessProvider } from '@src/features/business/BusinessProvider';
import BusinessDashboardPage from './dashboard/BusinessDashboardPage';
import BusinessSettingsRoutes from './management/ManagementRoutes';

interface BusinessRoutesProps {}

const TabRoutes = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          <ProtectedRoute path='/manage'>
            <BusinessSettingsRoutes />
          </ProtectedRoute>
          <ProtectedRoute path='/dashboard' exact>
            <BusinessDashboardPage />
          </ProtectedRoute>
        </Switch>
      </IonRouterOutlet>
      <IonTabBar slot='bottom'>
        <IonTabButton tab='home' href='/dashboard'>
          <IonIcon aria-hidden='true' icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab='manage' href='/manage'>
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
      <TabRoutes />
    </BusinessProvider>
  );
};

export default BusinessRoutes;
