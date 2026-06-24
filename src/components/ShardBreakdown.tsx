import type { PlayerBuild } from "@/types";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import {
    calculateDMS,
    calculateDropChances,
    calculateRPC,
} from "@/utils/calculations";


function ShardStatRow({
    label,
    value,
    percent,
}: {
    label: string;
    value: number;
    percent: number;
}) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-baseline gap-2">
                <Label>{label}</Label>
                <span className="font-medium">{value.toFixed()}</span>
                <span className="text-muted-foreground">Shards</span>
            </div>

            <div className="flex w-full items-center gap-3 sm:w-1/2">
                <span className="w-16 shrink-0 text-right">
                    {percent.toFixed(2)}%
                </span>
                <Progress value={percent} className="h-2 flex-1" />
            </div>
        </div>
    );
}

interface ShardBreakdownProps {
    data: PlayerBuild;
    totalShards: number;
    simResult: number;
    fetchShards: number;
}

export default function ShardBreakdown({
    data,
    totalShards,
    simResult,
    fetchShards,
}: ShardBreakdownProps) {
    const DMS = calculateDMS({ ...data });
    const DMSpercent = (DMS / totalShards) * 100;

    const DropChances = calculateDropChances({ ...data });
    const DropChancesPercent = (DropChances / totalShards) * 100;

    const fetchPercent = (fetchShards / totalShards) * 100

    const RPC = calculateRPC({ ...data });
    const RPCpercent = (RPC / totalShards) * 100;

    const FleetPercent = (simResult / totalShards) * 100;

    return (
        <>
            <div className="flex flex-col gap-4">
                <ShardStatRow
                    label="Daily Mission Shards:"
                    value={DMS}
                    percent={DMSpercent}
                />
                <ShardStatRow
                    label="Common/Rare Drop Chances"
                    value={DropChances}
                    percent={DropChancesPercent}
                />
                <ShardStatRow
                    label="Fetch"
                    value={fetchShards}
                    percent={fetchPercent}
                />
                <ShardStatRow
                    label="Recovery Package Mastery"
                    value={RPC}
                    percent={RPCpercent}
                />
                <ShardStatRow
                    label="Fleet Farming:"
                    value={simResult}
                    percent={FleetPercent}
                />
            </div>
        </>
    );
}
