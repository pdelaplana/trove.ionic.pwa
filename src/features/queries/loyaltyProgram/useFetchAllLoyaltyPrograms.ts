import { Business, LoyaltyProgram } from '@src/domain';
import { db } from '@src/infrastructure/firebase/firebase.config';
import { useQuery } from '@tanstack/react-query';
import { collection, collectionGroup, getDocs } from 'firebase/firestore';

const useFetchAllLoyaltyPrograms = () => {
  return useQuery({
    queryKey: ['allLoyaltyPrograms'],
    queryFn: async () => {
      const snapshot = await getDocs(collectionGroup(db, 'loyaltyPrograms'));

      const allPrograms: LoyaltyProgram[] = snapshot.docs
        .map((doc) => {
          const business = { ...doc.data(), id: doc.id } as Business;
          return (
            business.loyaltyPrograms.map(
              (program) => ({ ...program, id: program.id }) as LoyaltyProgram
            ) || []
          );
        })
        .flat()
        .filter(Boolean);

      return allPrograms;
    },
  });
};
export default useFetchAllLoyaltyPrograms;
