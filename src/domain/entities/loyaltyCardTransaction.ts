export type LoyaltyCardTransactionType =
  | 'purchase'
  | 'refund'
  | 'bonus'
  | 'redeem'
  | 'manual';

export interface LoyaltyCardTransaction {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  businessId: string;
  businessName: string;
  businessEmail: string;
  loyaltyCardId: string;
  membershipNumber: string;
  loyaltyProgramId: string;
  loyaltyProgramName: string;
  loyaltyProgramTierId?: string;
  loyaltyProgramTierName?: string;

  transactionDate: Date;
  transactionType: LoyaltyCardTransactionType;

  currency: string;
  purchaseAmount: number;
  discountAmount: number;
  finalAmount: number;

  earnedPoints: number;
  bonusPoints: number;
  redeemedPoints: number;
  totalPoints: number;

  freeProducts?: string[];
}
