import { Business } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';

const useFetchBusinessById = (id: string) => {
  return useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      // Get reference to the collection
      const docRef = doc(db, 'businesses', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
        return { ...docSnap.data(), id: docSnap.id } as Business;
      } else {
        console.log('No such document!');
        return null;
      }
    },
  });
};

export default useFetchBusinessById;