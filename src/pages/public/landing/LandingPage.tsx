import { IonButton, IonRouterLink, IonText } from '@ionic/react';
import ContentSection from '@src/pages/components/layouts/ContentSection';
import PublicPageLayout from '@src/pages/components/layouts/PublicPageLayout';

const LandingPage: React.FC = () => {
  return (
    <PublicPageLayout title='Welcome'>
      <ContentSection marginTop='5vh'>
        <IonText className='ion-text-center ion-margin-vertical'>
          <h1>A Trove of Rewards at Your Fingertips.</h1>
        </IonText>

        <IonButton expand='block' fill='outline' href='/customer/signup'>
          Create Your Account
        </IonButton>

        <IonText className='ion-text-center'>
          <p>
            Already have an account?{' '}
            <IonRouterLink href='/signin'>Sign in</IonRouterLink>
          </p>
        </IonText>
        <IonText className='ion-text-center'>
          <p>
            If you are business, sign up here.{' '}
            <IonRouterLink href='/business/signup'>Sign up</IonRouterLink>
          </p>
        </IonText>
      </ContentSection>
    </PublicPageLayout>
  );
};

export default LandingPage;
