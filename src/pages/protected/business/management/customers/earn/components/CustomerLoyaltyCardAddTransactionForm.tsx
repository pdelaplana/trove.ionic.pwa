import { IonItem, IonLabel, IonList } from '@ionic/react';
import useEarnPointsFunction from '@src/features/cloudFunctions/useEarnPointsFunction';
import { InputFormField } from '@src/pages/components/form';
import ActionButton from '@src/pages/components/ui/ActionButton';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CustomerEarnPointsPageState } from '../CustomerEarnPointsPage';
import { LoyaltyCardTransaction } from '@src/domain';

interface CustomerLoyaltyCardAddTransactionFormProps {
  membershipNumber?: string;
  onTransactionCompleted: (
    loyaltyCardTransaction: LoyaltyCardTransaction
  ) => void;
  onPageStateChange: (pageState: CustomerEarnPointsPageState) => void;
}

const CustomerLoyaltyCardAddTransactionForm: React.FC<
  CustomerLoyaltyCardAddTransactionFormProps
> = ({ membershipNumber, onTransactionCompleted, onPageStateChange }) => {
  const { mutateAsync: earnPointsAsync } = useEarnPointsFunction();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<{ membershipNumber: string; amount: string }>({
    defaultValues: {
      membershipNumber: '',
      amount: '',
    },
  });

  const onSubmit: SubmitHandler<{
    membershipNumber: string;
    amount: string;
  }> = async (formData) => {
    if (formData) {
      const result = await earnPointsAsync({
        membershipNumber: formData.membershipNumber,
        amount: parseFloat(formData.amount),
      });
      onTransactionCompleted(result.transaction);
      onPageStateChange(CustomerEarnPointsPageState.RESULT);
      console.log(result);
    }
  };

  useEffect(() => {
    if (membershipNumber) {
      setValue('membershipNumber', membershipNumber);
    }
  }, [membershipNumber]);

  return (
    <>
      <form>
        <IonList lines='none'>
          <IonItem>
            <IonLabel>
              <InputFormField
                label='Purchase Amount'
                placeholder='Enter purchase amount to earn points'
                name='amount'
                fill='outline'
                register={register}
                setValue={setValue}
                type='number'
              />
            </IonLabel>
          </IonItem>
        </IonList>

        <div className='ion-flex ion-justify-content-between'>
          <ActionButton
            label='Search Again'
            fill='clear'
            onClick={() =>
              onPageStateChange(CustomerEarnPointsPageState.SEARCH)
            }
            isLoading={false}
            isDisabled={false}
          />
          <ActionButton
            label='Add Transaction'
            className='ion-margin'
            isLoading={isSubmitting}
            isDisabled={!isDirty}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </>
  );
};

export default CustomerLoyaltyCardAddTransactionForm;
