import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import ProtectedRoute from '@src/pages/components/routing/ProtectedRoute';
import { Route, Switch } from 'react-router';
import CustomerHomePage from './home/CustomerHomePage';
import { useAuth } from '@src/features/auth/AuthProvider';
import {
  homeOutline,
  ellipsisHorizontalOutline,
  giftOutline,
  telescopeOutline,
} from 'ionicons/icons';
import { CustomerProvider } from '@src/features/customer/CustomerProvider';
import CustomerOnboardingPage from './onboarding/CustomerOnboardingPage';
import CustomerRewardsRoutes from './rewards/CustomerRewardsRoutes';
import DiscoverRewardsPage from './discover/DiscoverRewardsPage';
import CustomerRewardsDetailsPage from './rewards/details/CustomerRewardsDetailsPage';
import DiscoverRewardsDetailsPage from './discover/DiscoverRewardsDetailsPage';
import LoyaltyCardPage from './loyaltyCard/LoyaltyCardPage';
import LoyaltyCardActivityDetailsPage from './loyaltyCard/activity/LoyaltyCardActivityDetailsPage';
import LoyaltyCardActivityPage from './loyaltyCard/activity/LoyaltyCardActivityPage';

interface CustomerRoutesProps {}

const TabRoutes = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Switch>
          <ProtectedRoute path='/home' exact>
            <CustomerHomePage />
          </ProtectedRoute>
          <ProtectedRoute path='/discover'>
            <DiscoverRewardsPage />
          </ProtectedRoute>
          <ProtectedRoute path='/rewards'>
            <CustomerRewardsRoutes />
          </ProtectedRoute>
        </Switch>
      </IonRouterOutlet>
      <IonTabBar slot='bottom'>
        <IonTabButton tab='home' href='/home'>
          <IonIcon aria-hidden='true' icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab='discover' href='/discover'>
          <IonIcon aria-hidden='true' icon={telescopeOutline} />
          <IonLabel>Discover</IonLabel>
        </IonTabButton>

        <IonTabButton tab='rewards' href='/rewards'>
          <IonIcon aria-hidden='true' icon={giftOutline} />
          <IonLabel>Rewards</IonLabel>
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
      <Switch>
        {/* No Tab Rewards Routes */}

        <ProtectedRoute
          exact
          path='/discover/rewards/:businessId/:loyaltyProgramId/:loyaltyProgramMilestoneId'
        >
          <DiscoverRewardsDetailsPage />
        </ProtectedRoute>

        <ProtectedRoute exact path='/rewards/:loyaltyCardId/:id'>
          <CustomerRewardsDetailsPage />
        </ProtectedRoute>

        <ProtectedRoute exact path='/card/:cardId/activity/:transactionId'>
          <LoyaltyCardActivityDetailsPage />
        </ProtectedRoute>

        <ProtectedRoute exact path='/card/:id/activity'>
          <LoyaltyCardActivityPage />
        </ProtectedRoute>

        <ProtectedRoute exact path='/card/:id'>
          <LoyaltyCardPage />
        </ProtectedRoute>

        <Route path='/'>
          <TabRoutes />
        </Route>
      </Switch>
    </CustomerProvider>
  );
};

export default CustomerRoutes;
