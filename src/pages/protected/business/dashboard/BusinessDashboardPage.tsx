import { CenterContainer } from '@src/pages/components/layouts';
import BusinessPage from '../BusinessPage';

const BusinessDashboardPage: React.FC = () => {
  return (
    <BusinessPage title='Dashboard' showProfileIcon={true} showHeader={true}>
      <CenterContainer>
        <h1>Business Dashboard</h1>
      </CenterContainer>
    </BusinessPage>
  );
};

export default BusinessDashboardPage;
