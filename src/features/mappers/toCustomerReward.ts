import { CustomerReward } from '@src/domain';

export const toCustomerReward = (id: string, data: any): CustomerReward => {
  return {
    ...data,
    id: id,
    expiryDate: data.expiryDate ? data.expiryDate.toDate() : null,
    validUntilDate: data.validUntilDate ? data.validUntilDate.toDate() : null,
    redeemedDate: data.redeemedDate ? data.redeemedDate.toDate() : null,
    claimedDate: data.claimedDate ? data.claimedDate.toDate() : null,
  } as CustomerReward;
};
