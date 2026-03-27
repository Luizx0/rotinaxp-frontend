import { initialRewards } from "../data/mockData";
import { Reward } from "../types/app";
import { readStorage, storageKeys, writeStorage } from "./storage";

function seedRewards() {
  const storedRewards = readStorage<Reward[]>(storageKeys.rewards, []);

  if (storedRewards.length > 0) {
    return storedRewards;
  }

  writeStorage(storageKeys.rewards, initialRewards);
  return initialRewards;
}

export async function getRewards(): Promise<Reward[]> {
  return seedRewards();
}

export async function redeemReward(rewardId: string): Promise<Reward> {
  const rewards = seedRewards();
  const reward = rewards.find((item) => item.id === rewardId);

  if (!reward) {
    throw new Error("Recompensa nao encontrada.");
  }

  const updatedReward = {
    ...reward,
    claimed: true,
  };

  const nextRewards = rewards.map((item) => (item.id === rewardId ? updatedReward : item));
  writeStorage(storageKeys.rewards, nextRewards);
  return updatedReward;
}
