import { Customer } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

const useFetchCustomerByEmail = (email: string) => {
  return useQuery({
    queryKey: ['useFetchCustomerByEmail', email],
    queryFn: async () => {
      const customerRef = collection(db, 'customers');
      const q = query(customerRef, where('email', '==', email), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return null;
      }
      return {
        ...snapshot.docs[0].data(),
        id: snapshot.docs[0].id,
      } as Customer;
    },
  });
};

export default useFetchCustomerByEmail;
