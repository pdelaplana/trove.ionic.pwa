import {
  CollectionReference,
  DocumentData,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  collection,
} from 'firebase/firestore';
import { db } from '../firebase.config';

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

export const getCustomerRewardsSubcollectionRef = (
  businessId: string,
  loyaltyCardId: string
) => {
  const businessRef = getBusinessRef(businessId);
  const loyaltyCardRef = doc(
    collection(businessRef, 'loyaltyCards'),
    loyaltyCardId
  );
  return collection(loyaltyCardRef, 'customerRewards');
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
