import {
    CDC_LAB,
    HIGHEST_TIER,
    IS_MASTERY,
    RDC_LAB,
    RPC_MASTERY,
    SS_LAB,
    WS_CARD,
    WS_MASTERY,
} from "@/data/constants";
import type { AverageRewards, fleetRewards, PlayerBuild, TierConfig } from "@/types";

const calculateWaveSkip = (inputs: PlayerBuild): number => {
    const WSCard = WS_CARD[inputs.WSCardLevel] / 100;
    const WSMastery = WS_MASTERY[inputs.WSMasteryLevel] / 100;

    const WSBase = WSCard / (1 - WSCard);
    const WSPlusMulti = WSBase * (1 + WSMastery);
    const WSMulti = 1 / (1 - WSPlusMulti);

    return WSMulti;
};

export const calculateDMS = (inputs: PlayerBuild): number => {
    const highestTier = HIGHEST_TIER[inputs.highestTier];
    const effectiveDMS = (highestTier + inputs.DMSValue) * 6;

    return effectiveDMS;
};

export const calculateDropChances = (inputs: PlayerBuild): number => {
    const SSValue = 1 + SS_LAB[inputs.SSValue] / 100;
    const CDCValue = CDC_LAB[inputs.CDCValue] / 100;
    const RDCValue = RDC_LAB[inputs.RDCValue] / 100;
    const WSMulti = calculateWaveSkip(inputs);
    const waveValue = (inputs.waveValue/100) * (86400 /30.14) * 5

    const CDC = ((waveValue* WSMulti) / inputs.wavesPerBoss) * SSValue *(CDCValue * 5)
    const RDC = inputs.shattersRares ? ((waveValue* WSMulti) / inputs.wavesPerBoss) * SSValue *(RDCValue * 10) : 0;

    const total = CDC+RDC

    return total;
};

export const calculateFetch = (inputs: PlayerBuild): number => {
    const SSValue = 1+SS_LAB[inputs.SSValue]/100
    const simulation = getAverageFetchRewards(inputs)

    const moduleDrops = (simulation.avgCommonModules * 5 + simulation.avgRareModules*10) * SSValue

    const total = inputs.hasFetch ? simulation.avgTotalShards + moduleDrops : 0;
    return total;
};

export const calculateRPC = (inputs: PlayerBuild): number => {
    const SSValue = 1 + SS_LAB[inputs.SSValue] / 100;
    const RPCValue = inputs.RPCValue / 100;
    const RPCMastery = RPC_MASTERY[inputs.RPCMastery] / 100;
    const waveValue = (inputs.waveValue/100) * (86400 /30.14) * 5

    const effectiveRPC = inputs.hasRPC ? waveValue * RPCValue * RPCMastery * 5 * SSValue : 0;
    return effectiveRPC;
};

export const calculateDailyShards = (inputs: PlayerBuild): number => {
    const effectiveDMS = calculateDMS(inputs);

    const dropChances = calculateDropChances(inputs);

    const effectiveRPC = calculateRPC(inputs);

    const effectiveFetch = calculateFetch(inputs);

    const total = effectiveDMS + dropChances + effectiveRPC + effectiveFetch;
    return total;
};

function getFleetReward(wave: number, config: fleetRewards): number {
    const currentWave = Math.min(Math.max(0, wave), config.maxWaveLimit);
    const steps = Math.floor(currentWave / config.waveStep);
    return Math.min(config.baseReward + steps, config.maxReward);
}

export const enemyRewardRules: fleetRewards = {
    baseReward: 5,
    maxReward: 25,
    waveStep: 250,
    maxWaveLimit: 5000,
};

const gameTiers: Record<number, TierConfig> = {
    14: { tierNumber: 14, firstSpawn: 2495, frequency: 1000 },
    15: { tierNumber: 15, firstSpawn: 1495, frequency: 750 },
    16: { tierNumber: 16, firstSpawn: 995, frequency: 500 },
    17: { tierNumber: 17, firstSpawn: 495, frequency: 250 },
    18: { tierNumber: 18, firstSpawn: 95, frequency: 100 },
    19: { tierNumber: 19, firstSpawn: 45, frequency: 50 },
    20: { tierNumber: 20, firstSpawn: 5, frequency: 10 },
    21: { tierNumber: 21, firstSpawn: 5, frequency: 10, count: 2 },
};

export function simulateDeterministicRun(
    tierKey: number,
    maxWave: number,
    rewardConfig: fleetRewards,
    build: PlayerBuild
): number {
    const ISMastery = IS_MASTERY[build.ISMastery];
    const tier = gameTiers[tierKey];

    const WSMulti = calculateWaveSkip(build);

    if (!tier) throw new Error(`Tier key ${tierKey} does not exist.`);

    let totalRewards = 0;
    const spawnCountMultiplier = tier.count ?? 1;

    for (let wave = 1; wave <= maxWave; wave++) {
        if (wave >= ISMastery) {
            if (wave >= tier.firstSpawn) {
                if ((wave - tier.firstSpawn) % tier.frequency === 0) {
                    const spawnsThisWave = spawnCountMultiplier;
                    const rewardPerFleet = getFleetReward(wave, rewardConfig);

                    totalRewards += rewardPerFleet * spawnsThisWave;
                }
            }
        }
    }

    const dailyRewards =
        (((build.waveValue * WSMulti) / (maxWave - ISMastery / WSMulti + 180)) *
            totalRewards) /
        5;
    return dailyRewards;
}

const CANNON = 3;
const ARMOR = 4;
const GENERATOR = 5;
const CORE = 6;
const COMMON = 7;
const RARE = 8;

const BASE_CHANCES = [0.04, 0.02, 0.03, 0.01, 0.01, 0.01, 0.01, 0.004, 0.001, 0.865];
const CAPS = [20, 10, -1, -1, -1, -1, -1, 5, 2, -1];

function simulateOneDayFast(build: PlayerBuild): [number, number, number] {
  const inGameSecondsInDay = 24 * 60 * 60 * 5; 
  const totalTriggers = Math.floor(inGameSecondsInDay / build.fetchCD);
  
  const findChance = build.fetchFC > 1 ? build.fetchFC / 100 : build.fetchFC;
  const doubleFindChance = build.fetchDFC > 1 ? build.fetchDFC / 100 : build.fetchDFC;

  const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const activeChances = [...BASE_CHANCES];
  const cumulative = new Float64Array(10);
  let needsRecomp = true;

  for (let trigger = 0; trigger < totalTriggers; trigger++) {
    if (Math.random() > findChance) {
      continue;
    }

    const countToFind = Math.random() < doubleFindChance ? 2 : 1;

    for (let i = 0; i < countToFind; i++) {
      if (needsRecomp) {
        // Sum up all active, uncapped chances (including Coins and Reroll Shards)
        let totalActiveSum = 0;
        for (let j = 0; j < 10; j++) {
          totalActiveSum += activeChances[j];
        }
        
        // Dynamically scale remaining items to fill exactly 100% space
        let runningSum = 0;
        for (let j = 0; j < 10; j++) {
          if (totalActiveSum > 0) {
            runningSum += activeChances[j] / totalActiveSum;
          }
          cumulative[j] = runningSum;
        }
        needsRecomp = false;
      }

      const roll = Math.random();
      let rolledIdx = 9; 
      for (let j = 0; j < 10; j++) {
        if (roll <= cumulative[j]) {
          rolledIdx = j;
          break;
        }
      }

      counts[rolledIdx]++;

      const cap = CAPS[rolledIdx];
      if (cap !== -1 && counts[rolledIdx] >= cap) {
        activeChances[rolledIdx] = 0;
        needsRecomp = true;
      }
    }
  }

  const baseShardDrops = counts[CANNON] + counts[ARMOR] + counts[GENERATOR] + counts[CORE];
  
  const shardsFromDrops = baseShardDrops * 3;

  return [shardsFromDrops, counts[COMMON], counts[RARE]];
}

export function getAverageFetchRewards(build: PlayerBuild): AverageRewards {
  let totalShards = 0;
  let totalCommonModules = 0;
  let totalRareModules = 0;
  const iterations = 1000; 

  for (let d = 0; d < iterations; d++) {
    const [shards, common, rare] = simulateOneDayFast(build);
    totalShards += shards;
    totalCommonModules += common;
    totalRareModules += rare;
  }

  return {
    avgTotalShards: Number((totalShards / iterations).toFixed(2)),
    avgCommonModules: Number((totalCommonModules / iterations).toFixed(2)),
    avgRareModules: Number((totalRareModules / iterations).toFixed(2)),
  };
}