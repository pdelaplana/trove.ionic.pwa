import { db } from '@src/infrastructure/firebase/firebase.config';
import { useMutation } from '@tanstack/react-query';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';

interface BaseDocument {
  id?: string;
}

const useUpsertDocument = <T extends BaseDocument>(collectionName: string) => {
  const insert = async (data: Omit<T, 'id'>) => {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      created: new Date(),
    });
    const docSnapshot = await getDoc(docRef);
    return {
      ...docSnapshot.data(),
      id: docSnapshot.id,
    } as T;
  };

  const update = async (data: T) => {
    if (!data.id) throw new Error('Document ID is required for update');
    const docRef = doc(db, collectionName, data.id);
    const { id, ...dataWithoutId } = data;
    await updateDoc(docRef, {
      ...dataWithoutId,
      updated: new Date(),
    });
    return data;
  };

  const upsert = async (data: T) => {
    return data.id ? update(data) : insert(data);
  };

  return useMutation({
    mutationFn: upsert,
    onSuccess: (data) => {
      console.log('Document written with ID: ', data.id);
    },
    onError: (error: unknown) => {
      console.error('Error adding document: ', error);
    },
  });
};

export default useUpsertDocument;
