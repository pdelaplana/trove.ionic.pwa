import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import ProtectedRoute from '@src/pages/components/routing/ProtectedRoute';
import { Switch } from 'react-router';
import CustomerHomePage from './home/CustomerHomePage';
import UnderConstructionPage from '@src/pages/public/UnderConstructionPage';
import { useAuth } from '@src/features/auth/AuthProvider';
import { BusinessProvider } from '@src/features/business/BusinessProvider';
import { homeOutline, ellipsisHorizontalOutline } from 'ionicons/icons';
import BusinessRoutes from '../business/BusinessRoutes';
import { CustomerProvider } from '@src/features/customer/CustomerProvider';
import CustomerOnboardingPage from './onboarding/CustomerOnboardingPage';

interface CustomerRoutesProps {}

const TabRoutes = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          <ProtectedRoute path='/home'>
            <CustomerHomePage />
          </ProtectedRoute>
          <ProtectedRoute path='/dashboard' exact>
            <UnderConstructionPage />
          </ProtectedRoute>
        </Switch>
      </IonRouterOutlet>
      <IonTabBar slot='bottom'>
        <IonTabButton tab='home' href='/home'>
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

const CustomerRoutes: React.FC<CustomerRoutesProps> = ({}) => {
  const { isAuthenticated, authStateLoading, user } = useAuth();

  if (!authStateLoading && !user?.customerId) {
    return <CustomerOnboardingPage email={user?.email ?? ''} />;
  }

  return (
    <CustomerProvider customerId={user?.customerId ?? ''}>
      {' '}
      <TabRoutes />
    </CustomerProvider>
  );
};

export default CustomerRoutes;
