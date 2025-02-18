import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import BusinessSection from './components/BusinessSection';
import LoyaltyProgramsSection from './components/LoyaltyProgramsSection';
import CustomersSection from './components/CustomersSection';

const ManagementPage: React.FC = () => {
  return (
    <BasePageLayout
      title='Settings'
      showProfileIcon={true}
      showHeader={true}
      showBackButton={false}
    >
      <CenterContainer>
        <BusinessSection />
        <LoyaltyProgramsSection />
        <CustomersSection />
      </CenterContainer>
    </BasePageLayout>
  );
};

export default ManagementPage;
