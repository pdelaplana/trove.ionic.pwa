import { LoyaltyCard, LoyaltyProgram } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import {
  addDoc,
  collection,
  collectionGroup,
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

export const insertDocument = async <T extends { id?: string }>(
  data: T,
  collectionRef: CollectionReference<DocumentData>
) => {
  const { id, ...dataWithoutIds } = data;

  const docRef = await addDoc(collectionRef, {
    ...dataWithoutIds,
    timestamp: new Date(),
  });

  const docSnapshot = await getDoc(docRef);
  const docData = docSnapshot.data();

  if (!docData) {
    throw new Error('Failed to create document');
  }

  return {
    ...docData,
    id: docSnapshot.id,
  };
};

export const updateDocument = async <T extends { id: string }>(
  data: T,
  collectionRef: CollectionReference<DocumentData>
) => {
  const docRef = doc(collectionRef, data.id);

  const docSnapshot = await getDoc(docRef);
  if (!docSnapshot.exists()) {
    throw new Error('Document does not exist.');
  }

  const { id, ...dataWithoutIds } = data;
  await updateDoc(docRef, {
    ...(docSnapshot.data() as T),
    ...dataWithoutIds,
  });

  // Step 4: Get the updated document data
  const updatedDocSnapshot = await getDoc(docRef);

  return {
    ...updatedDocSnapshot.data(),
    id: updatedDocSnapshot.id,
  };
};

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

export const getLoyaltyCardByMembershipNo = async (membershipNo: string) => {
  const loyaltyCardQueryRef = query(
    collectionGroup(db, 'loyaltyCards'),
    where('membershipNumber', '==', membershipNo)
  );
  const loyaltyCardQuerySnapshot = await getDocs(loyaltyCardQueryRef);

  if (loyaltyCardQuerySnapshot.empty) {
    return null;
  }

  return {
    ...loyaltyCardQuerySnapshot.docs[0].data(),
    id: loyaltyCardQuerySnapshot.docs[0].id,
    membershipDate: loyaltyCardQuerySnapshot.docs[0]
      .data()
      .membershipDate.toDate(),
    expiryDate: loyaltyCardQuerySnapshot.docs[0].data().expiryDate?.toDate(),
    businessId: loyaltyCardQuerySnapshot.docs[0].ref.parent.parent?.id,
  } as LoyaltyCard;
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
