import { LoyaltyProgram } from '@src/domain';
import { useQuery } from '@tanstack/react-query';
import { getDocs, query } from 'firebase/firestore';
import { getLoyaltyProgramsSubcollectionRef } from '../helpers';

const useFetchLoyaltyProgramsByBusinessId = (businessId: string) => {
  return useQuery({
    queryKey: ['useFetchLoyaltyProgramByBusinessId', businessId],
    queryFn: async () => {
      const loyaltyProgramsSubcollectionRef =
        getLoyaltyProgramsSubcollectionRef(businessId); //
      const querySnapshot = await getDocs(
        query(loyaltyProgramsSubcollectionRef)
      );

      const loyaltyPrograms: LoyaltyProgram[] = [];
      querySnapshot.forEach((doc) => {
        loyaltyPrograms.push({
          ...doc.data(),
          id: doc.id,
          businessId: doc.ref.parent.parent?.id,
        } as LoyaltyProgram);
      });

      return loyaltyPrograms;
    },
  });
};

export default useFetchLoyaltyProgramsByBusinessId;
