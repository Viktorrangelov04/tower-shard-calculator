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
import { Button } from "./components/ui/button";
import TotalShardsCard from "./components/TotalShardsCard";

const CURRENT_VERSION = 1.0;
const DEFAULT_BUILD = {
    version: CURRENT_VERSION,
    waveValue: 0,
    DMSValue: 0,
    highestTier: 1,
    wavesPerBoss: 10,
    shattersRares: true,
    CDCValue: 0,
    hasRPC: false,
    hasWSM: false,
    RDCValue: 0,
    SSValue: 0,
    RPCValue: 30,
    RPCMastery: 0,
    WSCardLevel: 0,
    WSMasteryLevel: 0,

    hasFetch: false,
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

    const [comparisonBuild, setComparisonBuild] = useState<PlayerBuild | null>(
        () => {
            const saved = localStorage.getItem("player_build_comparison");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.version === CURRENT_VERSION) return parsed;
                } catch (e) {
                    console.error(e);
                }
            }
            return null;
        }
    );

    useEffect(() => {
        localStorage.setItem("player_build", JSON.stringify(build));
    }, [build]);

    useEffect(() => {
        if (comparisonBuild) {
            localStorage.setItem(
                "player_build_comparison",
                JSON.stringify(comparisonBuild)
            );
        } else {
            localStorage.removeItem("player_build_comparison");
        }
    }, [comparisonBuild]);

    const handleSaveComparison = () => {
        setComparisonBuild({ ...build });
    };

    const handleClearComparison = () => {
        setComparisonBuild(null);
        localStorage.removeItem("player_build_comparison");
    };

    const handleReturn = () => {
        if (comparisonBuild !== null) {
            setBuild({ ...comparisonBuild });
        }
    };

    // Calculate current values
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
        build.WSMasteryLevel,
        build.shattersRares,
        build.hasRPC,
        build.hasFetch
    ]);

    const fetch = useMemo(() => {
        return calculateFetch({ ...build });
    }, [build.fetchCD, build.fetchFC, build.fetchDFC, build.hasFetch]);

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

    // Calculate comparison values
    const dailyShards2 = useMemo(() => {
        if (!comparisonBuild) return null;
        return calculateDailyShards({ ...comparisonBuild });
    }, [comparisonBuild]);

    const simResult2 = useMemo(() => {
        if (!comparisonBuild) return null;
        return simulateDeterministicRun(
            comparisonBuild.farmingTier,
            comparisonBuild.farmingWave,
            enemyRewardRules,
            comparisonBuild
        );
    }, [comparisonBuild]);

    const total2 = useMemo(() => {
        if (dailyShards2 === null || simResult2 === null) return null;
        return dailyShards2 + simResult2;
    }, [dailyShards2, simResult2]);

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
                    <TotalShardsCard
                        name="Total Shards"
                        value={total}
                        value2={total2}
                    />
                </div>

                <div className="controls flex justify-center mt-4">
                    <Button className="mx-3" onClick={handleSaveComparison}>
                        {comparisonBuild
                            ? "Update Snapshot"
                            : "Save for Comparison"}
                    </Button>
                    {comparisonBuild && (
                        <div>
                            <Button className="mx-3" variant="outline" onClick={handleClearComparison}>
                                Close Comparison
                            </Button>
                            <Button className="mx-3" variant="secondary" onClick={handleReturn}>
                                Undo Changes
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                        <div className="rounded-xl border p-6 shadow-sm min-h-[300px] mt-8">
                            <BaseShardMenu data={build} setBuild={setBuild} />
                        </div>
                        
               

                        <div className="rounded-xl border p-6 shadow-sm min-h-[200px] mt-8">
                            <ShardBreakdown
                            data={build}
                            totalShards={total}
                            simResult={simResult}
                            fetchShards={fetch}
                        />
                        </div>
                        
                   
                </div>
            </div>
        </>
    );
}

export default App;
