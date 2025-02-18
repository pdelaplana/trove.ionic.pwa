import { Business, LoyaltyProgram } from '@src/domain';
import { toLoyaltyCard } from '@src/features/mappers/toLoyaltyCard';
import {
  getDoc,
  doc,
  query,
  collectionGroup,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import {
  getBusinessRef,
  getLoyaltyCardsSubcollectionRef,
  getLoyaltyProgramsSubcollectionRef,
} from './references';

export const getBusinessById = async (businessId: string) => {
  const businessRef = getBusinessRef(businessId);
  const businessSnapshot = await getDoc(businessRef);

  return {
    ...businessSnapshot.data(),
    id: businessSnapshot.id,
  } as Business;
};

export const getLoyaltyCardById = async (
  loyaltyCardId: string,
  businessId: string
) => {
  const loyaltyCardRef = doc(
    getLoyaltyCardsSubcollectionRef(businessId),
    loyaltyCardId
  );
  const loyaltyCardSnapshot = await getDoc(loyaltyCardRef);

  return toLoyaltyCard(loyaltyCardSnapshot?.id, loyaltyCardSnapshot?.data());
};

export const getLoyaltyCardByMembershipNo = async (membershipNo: string) => {
  const loyaltyCardQueryRef = query(
    collectionGroup(db, 'loyaltyCards'),
    where('membershipNumber', '==', membershipNo)
  );
  const loyaltyCardQuerySnapshot = await getDocs(loyaltyCardQueryRef);

  if (loyaltyCardQuerySnapshot.empty) {
    return null;
  }

  return toLoyaltyCard(
    loyaltyCardQuerySnapshot.docs[0].id,
    loyaltyCardQuerySnapshot.docs[0].data()
  );
};

export const getLoyaltyProgramByCode = async (code: string) => {
  const loyaltyProgramQueryRef = query(
    collectionGroup(db, 'loyaltyPrograms'),
    where('uniqueCode', '==', code)
  );
  const loyaltyProgramQuerySnapshot = await getDocs(loyaltyProgramQueryRef);

  return {
    ...loyaltyProgramQuerySnapshot.docs[0].data(),
    id: loyaltyProgramQuerySnapshot.docs[0].id,
    businessId: loyaltyProgramQuerySnapshot.docs[0].ref.parent.parent?.id,
  } as LoyaltyProgram;
};

export const getLoyaltyProgramById = async (
  loyaltyProgramId: string,
  businessId: string
) => {
  const loyaltyProgramRef = doc(
    getLoyaltyProgramsSubcollectionRef(businessId),
    loyaltyProgramId
  );
  const loyaltyProgramSnapshot = await getDoc(loyaltyProgramRef);

  return {
    ...loyaltyProgramSnapshot.data(),
    id: loyaltyProgramSnapshot.id,
    businessId: loyaltyProgramSnapshot.ref.parent.parent?.id,
  } as LoyaltyProgram;
};
