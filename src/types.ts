export interface fleetRewards{
    baseReward: number;
    maxReward: number;
    waveStep: number;
    maxWaveLimit: number;
}

export interface TierConfig{
    tierNumber: number;
    firstSpawn: number;
    frequency: number;
    count?: number;
}



export interface PlayerBuild {
    version: number;
    waveValue: number;
    DMSValue: number;
    highestTier: number;
    wavesPerBoss: number;
    CDCValue: number;
    RDCValue: number;
    SSValue: number;
    RPCValue: number;
    RPCMastery: number;
    WSCardLevel: number;
    WSMasteryLevel: number;
    fetchCD: number;
    fetchFC: number;
    fetchDFC: number;

    ISMastery: number;
    farmingTier: number;
    farmingWave: number;
}
