import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface Props{
    name: string;
    value: string;
    onClick?: () => void; 
    active?: boolean;
    prefix?: string;
}

export default function OverviewCard({ name, value, onClick, active, prefix}: Props) {
  return (
    <Card 
      onClick={onClick} 
      className={`cursor-pointer transition-all ${
        active 
          ? "ring-2 ring-primary shadow-md border-white" 
          : "hover:border-white"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold my-auto">{prefix}{value}</div>
        

      </CardContent>
    </Card>
  );
}