import { OperatingHours } from '@src/domain';
import { useBusiness } from '@src/features/business/BusinessProvider';
import NiceButton from '@src/pages/components/ui/NiceButton';
import { useBusinessHoursFormModal } from './components/BusinessHoursFormModal';
import BusinessHoursList from './components/BusinessHoursList';
import { BasePageLayout, CenterContainer } from '@src/pages/components/layouts';

const BusinessHoursPage: React.FC = () => {
  const { business, upsertOperatingHours, deleteOperatingHours } =
    useBusiness();
  const { open: openBusinessHoursFormModal } = useBusinessHoursFormModal();

  const handleOpenShopServiceFormModal = async (selected?: OperatingHours) => {
    const { updated, role } = await openBusinessHoursFormModal(selected);
    if (business) {
      if (role === 'confirm') {
        upsertOperatingHours(updated);
      } else if (role === 'delete') {
        deleteOperatingHours(updated);
      }
    }
  };

  return (
    <BasePageLayout
      title='Operating Hours'
      defaultBackButtonHref='/manage'
      showProfileIcon={false}
    >
      <CenterContainer>
        <BusinessHoursList onSelectHours={handleOpenShopServiceFormModal} />
        <NiceButton
          onClick={handleOpenShopServiceFormModal}
          expand='full'
          color='primary'
          isLoading={false}
          isDisabled={false}
          className='ion-margin'
        >
          Add
        </NiceButton>
      </CenterContainer>
    </BasePageLayout>
  );
};
export default BusinessHoursPage;
