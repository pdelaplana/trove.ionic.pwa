import { db } from '@src/infrastructure/firebase/firebase.config';
import { useMutation } from '@tanstack/react-query';
import { deleteDoc, doc, writeBatch } from 'firebase/firestore';

interface BatchDeleteItem {
  id: string;
  collectionName: string;
}

const useBatchDeleteDocument = () => {
  const batchDelete = async (items: BatchDeleteItem[]) => {
    if (!items.length) {
      throw new Error('No items provided for batch deletion');
    }

    const batch = writeBatch(db);

    items.forEach(({ id, collectionName }) => {
      if (!id) throw new Error('Document ID is required for deletion');
      const docRef = doc(db, collectionName, id);
      batch.delete(docRef);
    });

    await batch.commit();
    return items;
  };

  return useMutation({
    mutationFn: batchDelete,
  });
};

export default useBatchDeleteDocument;
