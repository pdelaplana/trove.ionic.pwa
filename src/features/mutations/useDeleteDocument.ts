import { db } from '@src/infrastructure/firebase/firebase.config';
import { useMutation } from '@tanstack/react-query';
import { deleteDoc, doc } from 'firebase/firestore';

interface DeleteParams {
  id: string;
  collectionName: string;
}

const useDeleteDocument = () => {
  const deleteDocument = async ({ id, collectionName }: DeleteParams) => {
    if (!id) throw new Error('Document ID is required for deletion');

    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return id;
  };

  return useMutation({
    mutationFn: deleteDocument,
  });
};

export default useDeleteDocument;
