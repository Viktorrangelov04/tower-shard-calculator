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
import type { fleetRewards, PlayerBuild, TierConfig } from "@/types";

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

    const effectiveCDC =
        ((inputs.waveValue * WSMulti) / inputs.wavesPerBoss) *
        CDCValue *
        5 *
        SSValue;
    const effectiveRDC =
        ((inputs.waveValue * WSMulti) / inputs.wavesPerBoss) *
        RDCValue *
        10 *
        SSValue;

    const total = effectiveCDC + effectiveRDC;

    return total;
};

export const calculateRPC = (inputs: PlayerBuild):number =>{
    const SSValue = 1 + SS_LAB[inputs.SSValue] / 100;
    const RPCValue = inputs.RPCValue / 100;
    const RPCMastery = RPC_MASTERY[inputs.RPCMastery] / 100;
    const effectiveRPC = inputs.waveValue * RPCValue * RPCMastery * 5 * SSValue;
    return effectiveRPC;
}

export const calculateDailyShards = (inputs: PlayerBuild): number => {
    const effectiveDMS = calculateDMS(inputs);

    const dropChances = calculateDropChances(inputs)

    const effectiveRPC = calculateRPC(inputs)

    const total = effectiveDMS + dropChances + effectiveRPC;
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
    // let totalSpawns = 0;
    const spawnCountMultiplier = tier.count ?? 1;

    for (let wave = 1; wave <= maxWave; wave++) {
        if (wave >= ISMastery) {
            if (wave >= tier.firstSpawn) {
                if ((wave - tier.firstSpawn) % tier.frequency === 0) {
                    const spawnsThisWave = spawnCountMultiplier;
                    const rewardPerFleet = getFleetReward(wave, rewardConfig);

                    // totalSpawns += spawnsThisWave;
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
