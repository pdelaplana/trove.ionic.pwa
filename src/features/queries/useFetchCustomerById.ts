import { Customer } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';

const useFetchCustomerById = (id: string) => {
  return useQuery({
    queryKey: ['useFetchCustomerById', id],
    queryFn: async () => {
      const docRef = doc(db, 'customers', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as Customer;
      } else {
        console.log('No such document!');
        return null;
      }
    },
  });
};
export default useFetchCustomerById;
