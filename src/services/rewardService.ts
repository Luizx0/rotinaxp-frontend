import { initialRewards } from "../data/mockData";
import { Reward, RewardDraft } from "../types/app";
import { getStoredSessionUserId, readStorage, storageKeys, writeStorage } from "./storage";

type RewardsByUser = Record<string, Reward[]>;

function getCurrentUserId() {
  const userId = getStoredSessionUserId();

  if (!userId) {
    throw new Error("Sessao de usuario nao encontrada.");
  }

  return userId;
}

function getRewardsStore() {
  return readStorage<RewardsByUser>(storageKeys.rewardsByUser, {});
}

function seedRewards(userId: string) {
  const rewardsStore = getRewardsStore();
  const storedRewards = rewardsStore[userId];

  if (Array.isArray(storedRewards)) {
    return storedRewards;
  }

  const seededRewards = userId === "user-demo" ? initialRewards : [];
  rewardsStore[userId] = seededRewards;
  writeStorage(storageKeys.rewardsByUser, rewardsStore);
  return seededRewards;
}

function persistRewards(userId: string, rewards: Reward[]) {
  const rewardsStore = getRewardsStore();
  rewardsStore[userId] = rewards;
  writeStorage(storageKeys.rewardsByUser, rewardsStore);
}

export async function getRewards(): Promise<Reward[]> {
  return seedRewards(getCurrentUserId());
}

export function createEmptyRewardDraft(): RewardDraft {
  return {
    title: "",
    description: "",
    cost: 60,
    accent: "sunrise",
  };
}

export async function createReward(draft: RewardDraft): Promise<Reward> {
  const userId = getCurrentUserId();
  const rewards = seedRewards(userId);

  const newReward: Reward = {
    id: `reward-${Date.now()}`,
    title: draft.title.trim(),
    description: draft.description.trim(),
    cost: Math.max(10, draft.cost),
    claimed: false,
    accent: draft.accent,
  };

  persistRewards(userId, [newReward, ...rewards]);
  return newReward;
}

export async function redeemReward(rewardId: string): Promise<Reward> {
  const userId = getCurrentUserId();
  const rewards = seedRewards(userId);
  const reward = rewards.find((item) => item.id === rewardId);

  if (!reward) {
    throw new Error("Recompensa nao encontrada.");
  }

  const updatedReward = {
    ...reward,
    claimed: true,
  };

  const nextRewards = rewards.map((item) => (item.id === rewardId ? updatedReward : item));
  persistRewards(userId, nextRewards);
  return updatedReward;
}
