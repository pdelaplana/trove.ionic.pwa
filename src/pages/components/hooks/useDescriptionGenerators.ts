import {
  LoyaltyProgramReward,
  LoyaltyProgramTierPerk,
} from '@src/domain/entities/loyaltyProgram';
import getCurrency from '@src/domain/valueTypes/currency';

const useDescriptionGenerators = () => {
  const generateRewardDescription = (
    reward: LoyaltyProgramReward,
    currency: string = ''
  ) => {
    switch (reward.rewardType) {
      case 'discountPercentage':
        return `${reward.discountPercentage}% discount on next purchase`;
      case 'discountFixedAmount':
        return `${getCurrency(currency)?.code}${reward.discountFixedAmount} off next purchase`;
      case 'freeProduct':
        return `Get ${reward.freeProduct} (qty: ${reward.freeProductQuantity})`;
      case 'pointsBonus':
        return `${reward.pointsBonus} bonus points on next purchase`;
      default:
        return '';
    }
  };

  const generatePerkDescription = (perk: LoyaltyProgramTierPerk) => {
    switch (perk.perkType) {
      case 'discount':
        return `${perk.discountPercentage}% discount on all purchases`;
      case 'freeProduct':
        return `Free product: ${perk.freeProduct}`;
      case 'pointsBonus':
        return `${perk.pointsBonus} additional points on all purchases`;
      default:
        return '';
    }
  };

  return {
    generateRewardDescription,
    generatePerkDescription,
  };
};

export default useDescriptionGenerators;
