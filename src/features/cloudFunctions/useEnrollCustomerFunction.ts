import { useMutation } from '@tanstack/react-query';

const useEnrollCustomerFunction = () => {
  const apiUrl = import.meta.env.VITE_CLOUD_FUNCTIONS_ENROLLCUSTOMER_URL;
  return useMutation({
    mutationFn: async ({
      name,
      email,
      phone,
      loyaltyProgramNumber,
    }: {
      name: string;
      email: string;
      phone: string;
      loyaltyProgramNumber: string;
    }) => {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            loyaltyProgramNumber,
          }),
        });
        return await response.json();
      } catch (error) {
        throw new Error('Error adding document: ' + error);
      }
    },
    onSuccess: (data) => {},
    onError: (error: unknown) => {
      console.error('Error adding document: ', error);
    },
  });
};

export default useEnrollCustomerFunction;
