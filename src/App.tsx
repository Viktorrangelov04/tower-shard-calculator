import { useEffect, useState } from "react";
import type { PlayerBuild } from "./types";
import BaseShardMenu from "./components/BaseShardMenu";
import OverviewCard from "./components/OverviewCard";
import { calculateDailyShards, enemyRewardRules, simulateDeterministicRun} from "./utils/calculations";
import { ModeToggle } from "./components/mode-toggle";


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
    const [activeTab, setActiveTab] = useState<string | null>(null);
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

    const dailyShards = calculateDailyShards({
        ...build,
    });

    const simResult = simulateDeterministicRun(build.farmingTier, build.farmingWave, enemyRewardRules, build);


    return (
        <>
            <div className="w-4/5 mx-auto flex flex-col gap-4 p-8">
                <div className="flex items-center justify-between">
                    <h1 className="my-8">Tower shard calculator</h1>{" "}
                    <ModeToggle />
                </div>
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
                </div>

                <BaseShardMenu data={build} setBuild={setBuild} />
            </div>
        </>
    );
}

export default App;
