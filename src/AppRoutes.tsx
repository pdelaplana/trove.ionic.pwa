import { IonLoading, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router';
import LandingPage from './pages/public/landing/LandingPage';

import { useAuth } from './features/auth/AuthProvider';
import { useEffect, useState } from 'react';
import ProtectedRoute from './pages/components/routing/ProtectedRoute';
import UnderConstructionPage from './pages/public/UnderConstructionPage';
import SignupPage from './pages/public/signup/SignupPage';
import SigninPage from './pages/public/signin/SigninPage';
import BusinessRoutes from './pages/protected/business/BusinessRoutes';
import ProfileRoutes from './pages/protected/profile/ProfileRoutes';
import CustomerRoutes from './pages/protected/customer/CustomerRoutes';
import { ROUTES } from './routesDefintion';

interface AuthState {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
}

const AppRoutes: React.FC = () => {
  const { isAuthenticated, authStateLoading, user } = useAuth();
  const [authState, setAuthState] = useState<AuthState>({
    isInitialized: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isAuthenticated) {
          console.debug('Fetched role:', user?.role);

          setAuthState({
            isInitialized: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState((prev) => ({
            ...prev,
            isInitialized: true,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Failed to get user role:', error);
        setAuthState((prev) => ({
          ...prev,
          error: error as Error,
          isLoading: false,
        }));
      }
    };

    if (!authStateLoading) {
      initializeAuth();
    }
  }, [isAuthenticated, authStateLoading, user]);

  const renderRoleBasedRoutes = () => {
    console.debug('Auth state:', authState);

    if (!isAuthenticated) {
      return <Redirect to={ROUTES.SIGNIN} />;
    }
    switch (user?.role) {
      case 'businessAdmin':
      case 'businessStaff':
        return <BusinessRoutes />;
      case 'customer':
        return <CustomerRoutes />;
      default:
        console.warn('No valid role, redirecting to landing');
        return <Redirect to='/' />;
    }
  };

  if (authStateLoading || (!authState.isInitialized && authState.isLoading)) {
    return <IonLoading isOpen={authState.isLoading} message='Loading...' />;
  }

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Switch>
          {/* Public routes */}
          <Route
            exact
            path={ROUTES.NOT_FOUND}
            component={UnderConstructionPage}
          />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />

          <Route exact path={ROUTES.SIGNIN} component={SigninPage} />

          <Route
            exact
            path={ROUTES.BUSINESS_SIGNUP}
            render={() => <SignupPage role='businessAdmin' />}
          />

          <Route
            exact
            path={ROUTES.CUSTOMER_SIGNUP}
            render={() => <SignupPage role='customer' />}
          />

          {/* Protected routes */}
          <ProtectedRoute path={ROUTES.PROFILE}>
            <ProfileRoutes />
          </ProtectedRoute>

          {/* Role-based routing */}
          <Route path='/'>{renderRoleBasedRoutes()}</Route>
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default AppRoutes;
