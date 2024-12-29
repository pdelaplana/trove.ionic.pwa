import { IonLabel, IonList, IonItem, IonIcon } from '@ionic/react';
import { idCardOutline } from 'ionicons/icons';
import { useAuth } from '@src/features/auth/AuthProvider';
import {
  BasePageLayout,
  CenterContainer,
  ContentSection,
} from '@src/pages/components/layouts';
import ProfilePhoto from '@src/pages/components/ui/ProfilePhoto';

const ProfilePage: React.FC = () => {
  const { user, signout, updatePhotoUrl } = useAuth();
  return (
    <BasePageLayout
      title='Profile'
      defaultBackButtonHref='/'
      showProfileIcon={false}
      showSignoutButton={true}
    >
      <CenterContainer>
        <ContentSection marginTop={'10px'}>
          <div className='ion-padding ion-flex ion-justify-content-center'>
            <ProfilePhoto
              name={`${user?.displayName}`}
              photoUrl={user?.photoURL ?? ''}
              updatePhotoUrl={updatePhotoUrl}
              storagePath={`users/${user?.uid}/profile`}
            />
          </div>
          <IonLabel className='ion-text-center'>
            <h1 className='dark'>{user?.displayName}</h1>
          </IonLabel>
          <IonLabel className='ion-text-center'>
            <h2>{user?.email}</h2>
          </IonLabel>
        </ContentSection>

        <ContentSection marginTop={'50px'}>
          <IonList lines='none' className='ion-margin-top'>
            <IonItem
              lines='full'
              detail
              button
              routerLink='/profile/info'
              className='ion-border-top'
            >
              <IonIcon slot='start' icon={idCardOutline}></IonIcon>
              <IonLabel>
                <h2>Personal Info</h2>
                <p>Update your phone and email</p>
              </IonLabel>
            </IonItem>
          </IonList>
        </ContentSection>
      </CenterContainer>
    </BasePageLayout>
  );
};

export default ProfilePage;
