import type { PlayerBuild } from "@/types";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import {
    calculateDMS,
    calculateDropChances,
    calculateRPC,
} from "@/utils/calculations";

interface ShardBreakdownProps {
    data: PlayerBuild;
    totalShards: number;
    simResult: number;
}

export default function ShardBreakdown({
    data,
    totalShards,
    simResult,
}: ShardBreakdownProps) {

    const DMS = calculateDMS({ ...data })
    const DMSpercent = (DMS / totalShards) * 100;

    const DropChances = calculateDropChances({ ...data })
    const DropChancesPercent = (DropChances / totalShards) * 100;

    const RPC = calculateRPC({ ...data })
    const RPCpercent = (RPC / totalShards) * 100;

    const FleetPercent = (simResult / totalShards) * 100;

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex">
                        <Label className="pr-4">Daily Mission Shards: </Label>
                        <span className="pr-2">{DMS}</span>
                        <span>Shards</span>
                    </div>
                   
                    <div className="w-1/2 flex items-center">
                        <span className="pr-4">{DMSpercent.toFixed(2)}%</span>
                        <Progress value={DMSpercent} className="h-2"></Progress>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex">
                        <Label className="pr-4">Common/Rare Drop Chances</Label>
                        <span className="pr-2">{DropChances.toFixed()}</span>
                        <span>Shards</span>
                    </div>
                    
                    <div className="w-1/2 flex items-center">
                        <span className="pr-4">{DropChancesPercent.toFixed(2)}%</span>
                        <Progress
                            value={DropChancesPercent}
                            className="h-2"
                        ></Progress>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex">
                        <Label className="pr-4">Recovery Package Mastery</Label>
                        <span className="pr-2">{RPC.toFixed()}</span>
                        <span>Shards</span>
                    </div>
                    
                    <div className="w-1/2 flex items-center">
                        <span className="pr-4">{RPCpercent.toFixed(2)}%</span>
                        <Progress value={RPCpercent} className="h-2"></Progress>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex">
                        <Label className="pr-4">Fleet Farming: </Label>
                        <span className="pr-2">{simResult.toFixed()} </span>
                        <span>Shards</span>
                    </div>

                    <div className="w-1/2 flex items-center">
                        <span className="pr-4">{FleetPercent.toFixed(2)}%</span>
                        <Progress
                            value={FleetPercent}
                            className="h-2"
                        ></Progress>
                    </div>
                </div>
            </div>
        </>
    );
}
