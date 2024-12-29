import { IonRouterOutlet } from '@ionic/react';
import ProtectedRoute from '@src/pages/components/routing/ProtectedRoute';
import ProfilePage from './ProfilePage';
import { Switch } from 'react-router';
import ProfileInformationPage from './ProfileInformationPage';

const ProfileRoutes: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Switch>
        <ProtectedRoute path='/profile/info' exact>
          <ProfileInformationPage />
        </ProtectedRoute>

        <ProtectedRoute path='/profile'>
          <ProfilePage />
        </ProtectedRoute>
      </Switch>
    </IonRouterOutlet>
  );
};

export default ProfileRoutes;
