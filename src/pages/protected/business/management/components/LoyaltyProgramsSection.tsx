import { IonList, IonItem, IonIcon, IonLabel } from '@ionic/react';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { ribbonOutline, addCircleOutline } from 'ionicons/icons';

const LoyaltyProgramsSection = () => {
  const { business } = useBusiness();
  return (
    <>
      <div className='ion-padding'>Loyalty Programs</div>
      <IonList className='ion-outline'>
        {business?.loyaltyPrograms.map((program) => (
          <IonItem
            key={program.id}
            button={true}
            detail={true}
            lines='none'
            routerLink={`/manage/loyalty/${program.id}`}
          >
            <IonIcon
              icon={ribbonOutline}
              slot='start'
              color='primary'
            ></IonIcon>
            <IonLabel>
              <h2>{program.name}</h2>
              <p>
                {program.type} - {program.pointsPerSpend} points per spend
              </p>
            </IonLabel>
          </IonItem>
        ))}

        <IonItem
          button={true}
          detail={true}
          lines='none'
          routerLink='/manage/loyalty/new'
        >
          <IonIcon
            icon={addCircleOutline}
            slot='start'
            color='primary'
          ></IonIcon>
          <IonLabel>
            <h2>Add New Program</h2>
            <p>Create a new loyalty program and reward your customers</p>
          </IonLabel>
        </IonItem>
      </IonList>
    </>
  );
};

export default LoyaltyProgramsSection;
