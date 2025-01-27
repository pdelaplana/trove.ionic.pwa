import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';

const CustomerHomePage: React.FC = () => {
  return (
    <BasePageLayout title='Home' showProfileIcon={true} showHeader={true}>
      <CenterContainer>
        <h1>Home</h1>
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerHomePage;
