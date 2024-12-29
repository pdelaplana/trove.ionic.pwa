import { IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { LoyaltyProgramTierPerk } from '@src/domain/entities/loyaltyProgram';
import useDescriptionGenerators from '@src/pages/components/hooks/useDescriptionGenerators';
import { addCircleOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

type LoyaltyProgramTierPerksListProps = {
  perks: LoyaltyProgramTierPerk[];
  onAddUpdateDeletePerk: (perk?: LoyaltyProgramTierPerk) => void;
};

const LoyaltyProgramTierPerksList = ({
  perks,
  onAddUpdateDeletePerk,
}: LoyaltyProgramTierPerksListProps) => {
  const { t } = useTranslation();
  const { generatePerkDescription } = useDescriptionGenerators();
  return (
    <>
      <div className='ion-padding'>Available Perks</div>
      <IonList className='ion-outline ion-margin'>
        {perks.map((perk) => (
          <IonItem
            key={perk.perkType}
            button
            lines='none'
            onClick={() => onAddUpdateDeletePerk(perk)}
          >
            <IonLabel>
              <h2>{t(`types.loyaltyProgramTierPerkType.${perk.perkType}`)}</h2>
              <p>{generatePerkDescription(perk)}</p>
            </IonLabel>
          </IonItem>
        ))}

        <IonItem
          button
          detail={false}
          lines='none'
          onClick={() => onAddUpdateDeletePerk()}
          className='no-border'
        >
          <IonIcon
            icon={addCircleOutline}
            slot='start'
            color='primary'
          ></IonIcon>
          <IonLabel>
            <h2>Add Perk</h2>
          </IonLabel>
        </IonItem>
      </IonList>
    </>
  );
};

export default LoyaltyProgramTierPerksList;
