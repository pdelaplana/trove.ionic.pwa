import { IonRouterOutlet } from '@ionic/react';
import ProtectedRoute from '@src/pages/components/routing/ProtectedRoute';
import { Switch } from 'react-router';
import CustomerRewardsDetailsPage from './details/CustomerRewardsDetailsPage';
import CustomerRewardsPage from './CustomerRewardsPage';

const CustomerRewardsRoutes: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Switch>
        {/* Rewards Routes */}
        <ProtectedRoute exact path='/rewards/details'>
          <CustomerRewardsDetailsPage />
        </ProtectedRoute>

        <ProtectedRoute path='/rewards'>
          <CustomerRewardsPage />
        </ProtectedRoute>
      </Switch>
    </IonRouterOutlet>
  );
};

export default CustomerRewardsRoutes;
