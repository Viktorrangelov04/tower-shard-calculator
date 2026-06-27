import type { PlayerBuild } from "@/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import CardLevelPicker from "./LevelPicker";
import {
    CDC_LAB,
    FARMING_TIER,
    HIGHEST_TIER,
    IS_MASTERY,
    RDC_LAB,
    RPC_MASTERY,
    SS_LAB,
    WS_CARD,
    WS_MASTERY,
} from "@/data/constants";
import { RangeSelect } from "./RangeSelect";

interface BaseShardProps {
    data: PlayerBuild;
    setBuild: React.Dispatch<React.SetStateAction<PlayerBuild>>;
}
export default function BaseShardMenu({ data, setBuild }: BaseShardProps) {
    const updateField = (field: keyof PlayerBuild, value: any) => {
        setBuild((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <>
            <div className="w-full max-w-3xl mx-auto px-4 sm:w-4/5 flex flex-col gap-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    <Label className="sm:pr-4 sm:flex-1">
                        Non skipped waves per day
                    </Label>
                    <Input
                        className="w-full sm:w-1/5"
                        type="number"
                        id="waveInput"
                        value={data.waveValue}
                         onChange={(e) => {
                                const val = Number(e.target.value);

                                updateField("waveValue", Math.min(val, 14000));
                            }}
                    />
                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    <Label className="sm:pr-4 sm:flex-1">
                        Daily Mission Shards lab
                    </Label>
                    <Input
                        className="w-full sm:w-1/5"
                        type="number"
                        max={50}
                        value={data.DMSValue}
                        onChange={(e) => {
                            const val = Number(e.target.value);

                            updateField("DMSValue", Math.min(val, 50));
                        }}
                    />
                </div>

                <CardLevelPicker
                    label="Highest Tier Unlocked"
                    levels={HIGHEST_TIER}
                    currentLevel={data.highestTier}
                    onChange={(val) => updateField("highestTier", val)}
                    min={1}
                    unit=""
                />

                <div>
                    <Label className="pb-2">Waves/Boss</Label>
                    <RangeSelect
                        min={10}
                        max={5}
                        step={-1}
                        value={data.wavesPerBoss}
                        onChange={(val) => updateField("wavesPerBoss", val)}
                        formatLabel={(val) => `${val}`}
                    />
                </div>

                <CardLevelPicker
                    label="Common Drop Chance lab level"
                    levels={CDC_LAB}
                    currentLevel={data.CDCValue}
                    onChange={(val) => updateField("CDCValue", val)}
                    unit="%"
                    prefix=""
                />

                <CardLevelPicker
                    label="Rare Drop Chance lab level"
                    levels={RDC_LAB}
                    currentLevel={data.RDCValue}
                    onChange={(val) => updateField("RDCValue", val)}
                    unit="%"
                    prefix=""
                />

                <CardLevelPicker
                    label="Shatter Shards lab level"
                    levels={SS_LAB}
                    currentLevel={data.SSValue}
                    onChange={(val) => updateField("SSValue", val)}
                    unit="%"
                    prefix=""
                />

                <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    <Label className="sm:pr-4 sm:flex-1">
                        Recovery Package Chance
                    </Label>
                    <Input
                        className="w-full sm:w-1/5"
                        type="number"
                        id="RPCValue"
                        value={data.RPCValue}
                        onChange={(e) => {
                            const val = Number(e.target.value);

                            updateField("RPCValue", Math.min(val, 97));
                        }}
                    />
                </div>
                <CardLevelPicker
                    label="Recovery Package Chance Mastery level"
                    levels={RPC_MASTERY}
                    currentLevel={data.RPCMastery}
                    onChange={(val) => updateField("RPCMastery", val)}
                    unit="%"
                    prefix=""
                />

                <CardLevelPicker
                    label="Wave Skip Level"
                    levels={WS_CARD}
                    currentLevel={data.WSCardLevel}
                    onChange={(val) => updateField("WSCardLevel", val)}
                    unit="%"
                    prefix=""
                />

                <CardLevelPicker
                    label="Wave Skip Mastery Level"
                    levels={WS_MASTERY}
                    currentLevel={data.WSMasteryLevel}
                    onChange={(val) => updateField("WSMasteryLevel", val)}
                    unit="%"
                    prefix=""
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <Label className="pb-2">Fetch CD</Label>
                        <RangeSelect
                            min={120}
                            max={60}
                            step={-1}
                            value={data.fetchCD}
                            onChange={(val) => updateField("fetchCD", val)}
                            formatLabel={(val) => `${val}s`}
                        />
                    </div>
                    <div>
                        <Label className="pb-2">Fetch Find Chance</Label>
                        <RangeSelect
                            min={10}
                            max={50}
                            step={1}
                            value={data.fetchFC}
                            onChange={(val) => updateField("fetchFC", val)}
                            formatLabel={(val) => `${val}%`}
                        />
                    </div>
                    <div>
                        <Label className="pb-2">Fetch Double Find Chance</Label>
                        <RangeSelect
                            min={2}
                            max={50}
                            step={1}
                            value={data.fetchDFC}
                            onChange={(val) => updateField("fetchDFC", val)}
                            formatLabel={(val) => `${val}%`}
                        />
                    </div>
                </div>
                <Label className="text-xl sm:text-3xl">Fleet Farming</Label>
                <hr className="border-gray-500" />

                <CardLevelPicker
                    label="Intro Sprint Mastery"
                    levels={IS_MASTERY}
                    currentLevel={data.ISMastery}
                    onChange={(val) => updateField("ISMastery", val)}
                    unit=""
                    prefix=""
                />
                <div>
                    <div>
                        <CardLevelPicker
                            label="Farming Tier"
                            levels={FARMING_TIER}
                            currentLevel={data.farmingTier}
                            onChange={(val) =>
                                updateField("farmingTier", Math.min(val, 30000))
                            }
                            unit=""
                            prefix=""
                            min={14}
                        />
                    </div>

                    <div className="flex py-2">
                        <Label className="pr-4 mt-2">Farming Wave</Label>
                        <Input
                            className="w-1/5"
                            type="number"
                            id="farmingWave"
                            value={data.farmingWave}
                            onChange={(e) => {
                                const val = Number(e.target.value);

                                updateField("farmingWave", Math.min(val, 30000));
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
