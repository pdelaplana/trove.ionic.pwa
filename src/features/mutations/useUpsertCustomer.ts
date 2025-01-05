import { Customer } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useMutation } from '@tanstack/react-query';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';

const useUpsertCustomer = () => {
  const insert = async <T extends { id?: string }>(
    data: T,
    collectionName: string
  ) => {
    const docRef = await addDoc(collection(db, collectionName), {
      ...(data as Omit<T, 'id'>),
      timestamp: new Date(),
    });
    const docSnapshot = await getDoc(docRef);
    return {
      ...(docSnapshot.data() as Omit<T, 'id'>),
      id: docSnapshot.id,
    };
  };

  const update = async <T extends { id: string }>(
    data: T,
    collectionName: string
  ) => {
    const docRef = doc(db, collectionName, data.id);

    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      throw new Error('Document does not exist.');
    }

    await updateDoc(docRef, {
      ...(docSnapshot.data() as T),
      ...(data as Omit<T, 'id'>),
    });

    // Step 4: Get the updated document data
    const updatedDocSnapshot = await getDoc(docRef);

    return {
      ...(updatedDocSnapshot.data() as Omit<Customer, 'id'>),
      id: updatedDocSnapshot.id,
    };
  };

  return useMutation({
    mutationFn: async (data: Customer) => {
      try {
        if (data.id) {
          return await update<Customer>(data, 'customers');
        } else {
          return await insert<Customer>(data, 'customers');
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
export default useUpsertCustomer;
