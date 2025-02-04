import { useMutation } from '@tanstack/react-query';

const useClaimRewardFunction = () => {
  const apiUrl = import.meta.env.VITE_CLOUD_FUNCTIONS_CLAIMREWARD_URL;

  return useMutation({
    mutationFn: async ({
      membershipNumber,
      loyaltyProgramMilestoneId,
    }: {
      membershipNumber: string;
      loyaltyProgramMilestoneId: string;
    }) => {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_CLOUD_FUNCTIONS_API_KEY,
          },
          body: JSON.stringify({
            membershipNumber,
            loyaltyProgramMilestoneId,
          }),
        });
        return await response.json();
      } catch (error) {
        throw new Error('Error claiming reward: ' + error);
      }
    },
    onSuccess: (data) => {},
    onError: (error: unknown) => {
      console.error('Error claiming reward: ', error);
    },
  });
};

export default useClaimRewardFunction;
