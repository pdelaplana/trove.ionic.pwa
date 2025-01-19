import { useMutation } from '@tanstack/react-query';
import { getLoyaltyProgramsSubcollectionRef } from '../queries/helpers';
import { LoyaltyProgram } from '@src/domain';
import {
  addDoc,
  getDoc,
  doc,
  updateDoc,
  CollectionReference,
  DocumentData,
  getDocs,
} from 'firebase/firestore';
import { useUniqueNumberGenerator } from '@src/pages/components/hooks/useUniqueNumberGenerator';

const useUpsertLoyaltyProgram = () => {
  const { generateUniqueNumber } = useUniqueNumberGenerator();
  const insert = async <T extends { id?: string; businessId?: string }>(
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
      businessId: docSnapshot.ref.parent.parent?.id,
    };
  };

  const update = async <T extends { id: string; businessId: string }>(
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
      businessId: updatedDocSnapshot.ref.parent.parent?.id,
    };
  };

  return useMutation({
    mutationFn: async (data: LoyaltyProgram) => {
      const loyaltyProgramsSubcollectionRef =
        getLoyaltyProgramsSubcollectionRef(data.businessId);
      if (data.uniqueCode === undefined || data.uniqueCode === '') {
        const usedNumbers = new Set(
          (await getDocs(loyaltyProgramsSubcollectionRef)).docs.map(
            (doc) => doc.data().uniqueCode
          )
        );
        data.uniqueCode = generateUniqueNumber(6, usedNumbers);
      }

      try {
        if (data.id) {
          return await update<LoyaltyProgram>(
            data,
            loyaltyProgramsSubcollectionRef
          );
        } else {
          return await insert<LoyaltyProgram>(
            data,
            loyaltyProgramsSubcollectionRef
          );
        }
      } catch (error) {
        throw new Error('Error adding document: ' + error);
      }
    },
    onSuccess: (data) => {
      console.log('Document written with ID: ', data.id);
    },
    onError: (error: unknown) => {
      console.error('Error adding document: ', error);
    },
  });
};
export default useUpsertLoyaltyProgram;
