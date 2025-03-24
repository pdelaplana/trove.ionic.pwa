import {
  IonBadge,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  useIonRouter,
} from '@ionic/react';
import getCurrency from '@src/domain/valueTypes/currency';
import { useBusiness } from '@src/features/business/BusinessProvider';
import { useLoyaltyProgram } from '@src/features/loyaltyProgram/LoyaltyProgramProvider';

import useDescriptionGenerators from '@src/pages/components/hooks/useDescriptionGenerators';
import { usePrompt } from '@src/pages/components/hooks/usePrompt';
import {
  BasePageLayout,
  CenterContainer,
  ContentSection,
} from '@src/pages/components/layouts';
import ActionSheetButton, {
  ActionOption,
} from '@src/pages/components/ui/ActionSheetButton';
import { addCircleOutline } from 'ionicons/icons';

import { useTranslation } from 'react-i18next';

interface LoyaltyProgramPageProps {}

const LoyaltyProgramPage: React.FC<LoyaltyProgramPageProps> = ({}) => {
  const { t } = useTranslation();
  const { business } = useBusiness();
  const { loyaltyProgram, loyaltyRewardMilestones } = useLoyaltyProgram();
  const { generateRewardDescription, generatePerkDescription } =
    useDescriptionGenerators();
  const { showConfirmPrompt } = usePrompt();
  const { push } = useIonRouter();

  const currentCurrency = getCurrency(business?.currency ?? '')?.shortName;

  const handleDelete = () => {};

  const handleActionComplete = (action: ActionOption) => {
    switch (action.data) {
      case 'delete':
        showConfirmPrompt({
          title: 'Delete Customer',
          message: 'Are you sure you want to delete this customer?',
          onConfirm: handleDelete,
        });
        break;
      case 'edit':
        push(`/manage/loyalty/${loyaltyProgram?.id}/edit`, 'forward');
        break;
      case 'add-tier':
        push(`/manage/loyalty/${loyaltyProgram?.id}/tiers/new`, 'forward');
        break;
      case 'add-milestone':
        push(`/manage/loyalty/${loyaltyProgram?.id}/milestones/new`, 'forward');
        break;
    }
  };

  return (
    <BasePageLayout
      title='Loyalty Program'
      showProfileIcon={false}
      defaultBackButtonHref='/manage'
    >
      <CenterContainer>
        <div className='ion-padding-vertical'>Information</div>
        <IonList>
          <IonItem lines='full'>
            <IonLabel>
              <h2>{loyaltyProgram?.name}</h2>
            </IonLabel>
          </IonItem>
          <IonItem lines='full'>
            <IonLabel>
              <h2>
                {t(`types.loyaltyProgramType.${loyaltyProgram?.type}`, {
                  currency: currentCurrency,
                })}
              </h2>
              <p>
                {`Earn ${loyaltyProgram?.pointsPerSpend} ${t(
                  `types.loyaltyProgramType.${loyaltyProgram?.type ?? 'pointsPerSpend'}`,
                  {
                    currency: currentCurrency,
                  }
                )}`}
              </p>
            </IonLabel>
          </IonItem>
          <IonItem lines='none'>
            <IonLabel>
              <h2>Description</h2>
              <p>{loyaltyProgram?.description}</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <ContentSection title='Tiers'>
          <IonList>
            {loyaltyProgram?.tiers.map((tier) => (
              <IonItem
                key={tier.id}
                button
                detail
                lines='full'
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

        <ContentSection title='Reward Milestones'>
          <IonList>
            {loyaltyRewardMilestones
              ?.sort((a, b) => a.points - b.points)
              .map((milestone) => (
                <IonItem
                  key={milestone.id}
                  button
                  detail
                  lines='full'
                  routerLink={`/manage/loyalty/${loyaltyProgram?.id}/milestones/${milestone.id}`}
                >
                  {milestone.tierId ? (
                    <IonBadge color='primary' slot='end'>
                      {
                        loyaltyProgram?.tiers.find(
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
        <ActionSheetButton
          buttonLabel={'Options...'}
          sheetTitle='Options...'
          expand='full'
          fill='clear'
          options={[
            {
              text: 'Delete Program',
              role: 'destructive',
              data: 'delete',
            },
            {
              text: 'Edit Program',
              role: 'destructive',
              data: 'edit',
            },
            {
              text: 'Add Reward Tier',
              data: 'add-tier',
            },
            {
              text: 'Add Reward Milestone',
              data: 'add-milestone',
            },
          ]}
          onActionComplete={handleActionComplete}
        />
      </CenterContainer>
    </BasePageLayout>
  );
};

export default LoyaltyProgramPage;
