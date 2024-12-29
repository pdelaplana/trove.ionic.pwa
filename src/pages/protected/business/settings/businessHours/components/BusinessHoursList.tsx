import { IonList, IonItem, IonLabel } from '@ionic/react';
import { OperatingHours } from '@src/domain';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { ellipsisVerticalOutline } from 'ionicons/icons';

interface BusinessHoursListProps {
  onSelectHours: (operatingHours: OperatingHours) => Promise<void>;
}

const ShopHoursList: React.FC<BusinessHoursListProps> = ({ onSelectHours }) => {
  const { business } = useBusiness();

  return (
    <IonList lines='none' className='ion-margin-top'>
      {business?.operatingHours?.map((hours) => (
        <IonItem
          key={hours.day}
          lines='full'
          button
          detail
          detailIcon={ellipsisVerticalOutline}
          onClick={async () => onSelectHours(hours)}
        >
          <IonLabel>
            <h2>{hours.day}</h2>
            <p>
              {hours.openAt} to {hours.closeAt}
            </p>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};
export default ShopHoursList;
