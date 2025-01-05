import { IonBadge, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import { LoyaltyProgram } from '@src/domain/entities/loyaltyProgram';
import getCurrency from '@src/domain/valueTypes/currency';
import { useBusiness } from '@src/features/business/BusinessProvider';

import useDescriptionGenerators from '@src/pages/components/hooks/useDescriptionGenerators';
import {
  BasePageLayout,
  CenterContainer,
  ContentSection,
} from '@src/pages/components/layouts';
import { addCircleOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface LoyaltyProgramPageProps {}

const LoyaltyProgramPage: React.FC<LoyaltyProgramPageProps> = ({}) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const { business } = useBusiness();

  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram | null>();

  const { generateRewardDescription, generatePerkDescription } =
    useDescriptionGenerators();

  useEffect(() => {
    if (business) {
      const program = business.loyaltyPrograms.find((p) => p.id === id);
      setLoyaltyProgram(program ?? null);
    }
  }, [id, business]);

  return (
    <BasePageLayout
      title='Loyalty Program'
      showProfileIcon={false}
      defaultBackButtonHref='/manage'
    >
      <CenterContainer>
        <div className='ion-padding'>Information</div>
        <IonList className='ion-outline'>
          <IonItem
            lines='none'
            button
            detail
            routerLink={`/manage/loyalty/${loyaltyProgram?.id}/edit`}
          >
            <IonLabel>
              <h1>{loyaltyProgram?.name}</h1>
              <p>
                {`Earn ${loyaltyProgram?.pointsPerSpend} ${t(
                  `types.loyaltyProgramType.${loyaltyProgram?.type ?? 'pointsPerSpend'}`,
                  {
                    currency: getCurrency(business?.currency ?? '')?.shortName,
                  }
                )}`}
              </p>
              <p>{loyaltyProgram?.description}</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <ContentSection title='Tiers'>
          <IonList className='ion-outline'>
            {loyaltyProgram?.tiers.map((tier) => (
              <IonItem
                key={tier.id}
                button
                detail
                lines='none'
                routerLink={`/manage/loyalty/${loyaltyProgram?.id}/tiers/${tier.id}`}
              >
                <IonLabel>
                  <h2>{tier.name}</h2>
                  <p>
                    <span>{tier.pointsThreshold} points required </span>
                    {tier.perks?.map((perk) => (
                      <span key={perk.perkType}>
                        &middot; {generatePerkDescription(perk)}
                      </span>
                    ))}
                  </p>
                </IonLabel>
              </IonItem>
            ))}

            <IonItem
              button
              detail
              lines='none'
              routerLink={`/manage/loyalty/${loyaltyProgram?.id}/tiers/new`}
              className='no-border'
            >
              <IonIcon
                icon={addCircleOutline}
                slot='start'
                color='primary'
              ></IonIcon>
              <IonLabel>
                <h2>Add New Tier</h2>
              </IonLabel>
            </IonItem>
          </IonList>
        </ContentSection>

        <ContentSection title='Milestones'>
          <IonList className='ion-outline'>
            {loyaltyProgram?.milestones
              ?.sort((a, b) => a.points - b.points)
              .map((milestone) => (
                <IonItem
                  key={milestone.id}
                  button
                  detail
                  lines='none'
                  routerLink={`/manage/loyalty/${loyaltyProgram?.id}/milestones/${milestone.id}`}
                >
                  {milestone.tierId ? (
                    <IonBadge color='primary' slot='end'>
                      {
                        loyaltyProgram.tiers.find(
                          (t) => t.id === milestone.tierId
                        )?.name
                      }
                    </IonBadge>
                  ) : (
                    <IonBadge slot='end' color='medium'>
                      No Tier
                    </IonBadge>
                  )}

                  <IonLabel>
                    <h2 className=''>{milestone.points} Points </h2>
                    <p>
                      <span>
                        {generateRewardDescription(
                          milestone.reward,
                          business?.currency ?? ''
                        )}
                      </span>
                    </p>
                  </IonLabel>
                </IonItem>
              ))}

            <IonItem
              button
              detail
              lines='none'
              routerLink={`/manage/loyalty/${loyaltyProgram?.id}/milestones/new`}
              className='no-border'
            >
              <IonIcon
                icon={addCircleOutline}
                slot='start'
                color='primary'
              ></IonIcon>
              <IonLabel>
                <h2>Add New Milestone</h2>
              </IonLabel>
            </IonItem>
          </IonList>
        </ContentSection>
      </CenterContainer>
    </BasePageLayout>
  );
};

export default LoyaltyProgramPage;
