import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';
import { useParams } from 'react-router-dom';

interface CustomerRewardsDetailsPageProps {}

const CustomerRewardsDetailsPage: React.FC = () => {
  const { rewardId } = useParams<{ rewardId: string }>();

  return (
    <BasePageLayout title='Rewards' showProfileIcon={true} showHeader={true}>
      <CenterContainer>
        <h1>Rewards</h1>
      </CenterContainer>
    </BasePageLayout>
  );
};

export default CustomerRewardsDetailsPage;
