import { db } from '@src/infrastructure/firebase/firebase.config';
import { collection, doc } from 'firebase/firestore';

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
