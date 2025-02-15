import { LoyaltyCard } from '@src/domain';

export const toLoyaltyCard = (id: string, data: any): LoyaltyCard => {
  return {
    ...data,
    id: id,
    membershipDate: data.membershipDate.toDate(),
    validUntilDate: data.validUntilDate ? data.validUntilDate.toDate() : null,
    expiryDate: data.expiryDate?.toDate(),
  } as LoyaltyCard;
};
