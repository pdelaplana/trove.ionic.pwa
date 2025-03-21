import { useMutation } from '@tanstack/react-query';

const useGenerateApiKeyFunction = () => {
  const apiUrl = import.meta.env.VITE_CLOUD_FUNCTIONS_GENERATEAPIKEY_URL;
  return useMutation({
    mutationFn: async ({ businessId }: { businessId: string }) => {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            businessId,
          }),
        });
        return await response.json();
      } catch (error) {
        throw new Error('useGenerateApiKeyFunction: ' + error);
      }
    },
    //onSuccess: (data) => {},
    onError: (error: unknown) => {
      console.error(error);
    },
  });
};

export default useGenerateApiKeyFunction;
