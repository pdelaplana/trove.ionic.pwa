import { IonRouterOutlet } from '@ionic/react';
import ProtectedRoute from '@src/pages/components/routing/ProtectedRoute';
import { Switch } from 'react-router';
import DiscoverRewardsPage from './DiscoverRewardsPage';

const DiscoverRewardsRoutes: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Switch>
        {/* Rewards Routes */}

        <ProtectedRoute path='/discover'>
          <DiscoverRewardsPage />
        </ProtectedRoute>
      </Switch>
    </IonRouterOutlet>
  );
};

export default DiscoverRewardsRoutes;
