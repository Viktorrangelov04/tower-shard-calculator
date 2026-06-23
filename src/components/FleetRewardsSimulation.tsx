import type { fleetRewards, TierConfig } from "@/types";




function getFleetReward(wave: number, config: fleetRewards): number {
  const currentWave = Math.min(Math.max(0, wave), config.maxWaveLimit);
  const steps = Math.floor(currentWave / config.waveStep);
  return Math.min(config.baseReward + steps, config.maxReward);
}



export default function FleetSimulation(tierKey: number,
  maxWave: number,
  rewardConfig: fleetRewards
): SimulationResult {
 const tier = gameTiers[tierKey];
  if (!tier) throw new Error(`Tier key ${tierKey} does not exist.`);

  let totalRewards = 0;
  let totalSpawns = 0;
  const spawnCountMultiplier = tier.count ?? 1;

  for (let wave = 1; wave <= maxWave; wave++) {
    // 1. Check if we have reached or passed the first spawn wave
    if (wave >= tier.firstSpawn) {
      // 2. Check if the current wave falls exactly on the frequency interval
      if ((wave - tier.firstSpawn) % tier.frequency === 0) {
        const spawnsThisWave = spawnCountMultiplier;
        const rewardPerFleet = getFleetReward(wave, rewardConfig);

        totalSpawns += spawnsThisWave;
        totalRewards += rewardPerFleet * spawnsThisWave;
      }
    }
  }

  return {
    tierNumber: tier.tierNumber,
    totalWaves: maxWave,
    totalSpawns,
    totalRewards,
  };
}
