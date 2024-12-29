// src/pages/UnderConstruction.tsx
import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/react';

const UnderConstructionPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Under Construction</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <h2>🚧 This page is currently under construction 🚧</h2>
        <p>Please check back later.</p>
      </IonContent>
    </IonPage>
  );
};

export default UnderConstructionPage;
