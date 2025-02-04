import { doc, collection } from 'firebase/firestore';
import { db } from './firebase.config';

export const getBusinessRef = (id: string) => doc(db, 'businesses', id);

export const getLoyaltyCardsSubcollectionRef = (businessId: string) => {
  const businessRef = getBusinessRef(businessId);
  return collection(businessRef, 'loyaltyCards');
};

export const getLoyaltyCardTransactionsSubcollectionRef = (
  businessId: string
) => {
  const businessRef = getBusinessRef(businessId);
  return collection(businessRef, 'loyaltyCardTransactions');
};

export const getLoyaltyProgramsSubcollectionRef = (businessId: string) => {
  const businessRef = getBusinessRef(businessId);
  return collection(businessRef, 'loyaltyPrograms');
};

export const getLoyaltyMilestoneRewardSubcollectionRef = (
  loyaltyProgramId: string,
  businessId: string
) => {
  const loyaltyProgramRef = doc(
    getLoyaltyProgramsSubcollectionRef(businessId),
    loyaltyProgramId
  );
  return collection(loyaltyProgramRef, 'milestoneRewards');
};
