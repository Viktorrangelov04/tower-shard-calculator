import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Props {
    name: string;
    value: number;
    value2?: any;
}

export default function TotalShardCard({name, value, value2=1} : Props){
        return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between my-auto space-y-0">
                <CardTitle className="text-sm font-medium">{name}</CardTitle>
            </CardHeader>
            <CardContent>
                
                {value2 ? (
                    <div className="text-xl font-bold">New: {value.toFixed()}</div>
                ) : (
                    <div className="text-3xl font-bold">{value.toFixed()}</div>
                )}
                   
                {value2 ? (
                    <div>
                        <div className="text-xl font-bold">
                            Old: {value2.toFixed()}
                        </div>
                        <div className={`text-lg ${value>value2 ? "text-green-500" : "text-red-300"}`}>
                            Diff: {((value/value2)*100-100).toFixed(1)}%
                        </div>
                    </div>
                ) : (
                    <span className="text-red-500">Save build to compare</span>
                )}
            </CardContent>
        </Card>
    );
}