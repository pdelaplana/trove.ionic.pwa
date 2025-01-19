import { LoyaltyCard } from '@src/domain';

type LoyaltyCstfContextType = {
  loyaltyCard?: LoyaltyCard;
  updateLoyaltyCard: (loyaltyCard: LoyaltyCard) => void;
  deleteLoyaltyCard: (loyaltyCardId: string) => void;
};
