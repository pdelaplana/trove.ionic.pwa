import { db } from '@infrastructure/firebase/firebase.config';
import { useMutation } from '@tanstack/react-query';
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
  deleteDoc,
} from 'firebase/firestore';

interface DeleteParams {
  id: string;
  collectionName: string;
}

interface BatchDeleteParams {
  collectionName: string;
  field: string;
  operator: '==' | '<' | '<=' | '>' | '>=';
  value: any;
}

const useDeleteLoyaltyCard = () => {
  const batchDeleteDocuments = async ({
    collectionName,
    field,
    operator,
    value,
  }: BatchDeleteParams) => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(field, operator, value));

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return 0; // No documents to delete
    }

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return snapshot.size; // Return number of deleted documents
  };

  const deleteDocument = async ({ id, collectionName }: DeleteParams) => {
    if (!id) throw new Error('Document ID is required for deletion');

    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return id;
  };

  const deleteLoyaltyCard = async ({
    id,
    businessId,
  }: {
    id: string;
    businessId: string;
  }) => {
    try {
      await batchDeleteDocuments({
        field: 'loyaltyCardId',
        operator: '==',
        value: id,
        collectionName: `businesses/${businessId}/loyaltyCardTransactions`,
      });
      await batchDeleteDocuments({
        field: 'loyaltyCardId',
        operator: '==',
        value: id,
        collectionName: `businesses/${businessId}/customerRewards`,
      });
      await deleteDocument({
        id,
        collectionName: `businesses/${businessId}/loyaltyCards`,
      });
    } catch (error) {
      console.error('Failed to delete loyalty card', error);
      throw new Error('Failed to delete loyalty card ' + error);
    }
  };

  return useMutation({
    mutationFn: deleteLoyaltyCard,
  });
};

export default useDeleteLoyaltyCard;
