import { useEffect, useMemo, useState } from "react";
import type { PlayerBuild } from "./types";
import BaseShardMenu from "./components/BaseShardMenu";
import OverviewCard from "./components/OverviewCard";
import {
    calculateDailyShards,
    calculateFetch,
    enemyRewardRules,
    simulateDeterministicRun,
} from "./utils/calculations";
import { ModeToggle } from "./components/mode-toggle";
import ShardBreakdown from "./components/ShardBreakdown";
import DisclaimerBanner from "./components/DisclaimerBanner";

const CURRENT_VERSION = 1.0;
const DEFAULT_BUILD = {
    version: CURRENT_VERSION,
    waveValue: 0,
    DMSValue: 0,
    highestTier: 1,
    wavesPerBoss: 10,
    CDCValue: 0,
    RDCValue: 0,
    SSValue: 0,
    RPCValue: 30,
    RPCMastery: 0,
    WSCardLevel: 0,
    WSMasteryLevel: 0,

    fetchCD: 120,
    fetchFC: 10,
    fetchDFC: 2,

    ISMastery: 0,
    farmingTier: 14,
    farmingWave: 0,
};

function App() {
    const [activeTab, setActiveTab] = useState<string | null>("base");
    const [build, setBuild] = useState<PlayerBuild>(() => {
        const saved = localStorage.getItem("player_build");

        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                if (parsed.version === CURRENT_VERSION) {
                    return parsed;
                }

                console.warn("Old version detected, resetting to default.");
            } catch (e) {
                console.error("Error parsing storage", e);
            }
        }

        return { ...DEFAULT_BUILD, version: CURRENT_VERSION };
    });

    useEffect(() => {
        localStorage.setItem("player_build", JSON.stringify(build));
    }, [build]);

    const dailyShards = useMemo(() => {
        return calculateDailyShards({ ...build });
    }, [
        build.fetchCD,
        build.fetchFC,
        build.fetchDFC,
        build.waveValue,
        build.DMSValue,
        build.highestTier,
        build.CDCValue,
        build.RDCValue,
        build.wavesPerBoss,
        build.SSValue,
        build.RPCMastery,
        build.RPCValue,
        build.WSCardLevel,
        build.WSMasteryLevel
    ]);

    const fetch = useMemo(() => {
            return calculateFetch({ ...build });
        }, [build.fetchCD, build.fetchFC, build.fetchDFC]);
    
        
        
    const simResult = useMemo(() => {
        return simulateDeterministicRun(
            build.farmingTier,
            build.farmingWave,
            enemyRewardRules,
            build
        );
    }, [
        build.farmingTier,
        build.farmingWave,
        build.WSCardLevel,
        build.WSMasteryLevel,
        build.ISMastery
    ]);

    const total = useMemo(
        () => dailyShards + simResult,
        [dailyShards, simResult]
    );

    return (
        <>
            <div className="w-full sm:w-4/5 mx-auto flex flex-col gap-4 p-8">
                <div className="flex items-center justify-between">
                    <h1 className="my-8">Tower shard calculator</h1>{" "}
                    <ModeToggle />
                </div>
                <DisclaimerBanner />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <OverviewCard
                        name="Base Daily Shards"
                        value={dailyShards.toFixed()}
                        onClick={() => setActiveTab("base")}
                        active={activeTab === "base"}
                    />
                    <OverviewCard
                        name="Fleet Shards"
                        value={simResult.toFixed()}
                        onClick={() => setActiveTab("base")}
                        active={activeTab === "base"}
                    />
                    <OverviewCard
                        name="TotalShards (click for breakdown)"
                        value={total.toFixed()}
                        onClick={() => setActiveTab("breakdown")}
                        active={activeTab === "breakdown"}
                    />
                </div>
                <div className="rounded-xl border p-6 shadow-sm min-h-[300px] mt-8">
                    {activeTab === "base" && (
                        <BaseShardMenu data={build} setBuild={setBuild} />
                    )}

                    {activeTab === "breakdown" && (
                        <ShardBreakdown
                            data={build}
                            totalShards={total}
                            simResult={simResult}
                            fetchShards={fetch}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
