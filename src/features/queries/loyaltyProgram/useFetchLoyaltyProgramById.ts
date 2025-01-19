import { LoyaltyProgram } from '@src/domain';
import { useQuery } from '@tanstack/react-query';
import { getDoc, doc } from 'firebase/firestore';
import { getLoyaltyProgramsSubcollectionRef } from '../helpers';

const useFetchLoyaltyProgramById = (id: string, businessId: string) => {
  return useQuery({
    queryKey: ['useFetchLoyaltyProgramById', id],
    queryFn: async () => {
      const loyaltyProgramsSubcollectionRef =
        getLoyaltyProgramsSubcollectionRef(businessId);
      const loyaltyProgramSnapshot = await getDoc(
        doc(loyaltyProgramsSubcollectionRef, id)
      );

      if (loyaltyProgramSnapshot.exists()) {
        const loyaltyProgram = {
          ...loyaltyProgramSnapshot.data(),
          id: loyaltyProgramSnapshot.id,
          businessId: loyaltyProgramSnapshot.ref.parent.parent?.id,
        } as LoyaltyProgram;

        return loyaltyProgram;
      } else {
        console.log('No such document!');
        return null;
      }
    },
  });
};

export default useFetchLoyaltyProgramById;
