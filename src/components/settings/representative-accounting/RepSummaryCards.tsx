
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, BarChart2 } from "lucide-react";
import { RepWithCompany } from "./types";

type RepSummaryCardsProps = {
  representatives: RepWithCompany[];
};

export const RepSummaryCards = ({ representatives }: RepSummaryCardsProps) => {
  const promoReps = representatives.filter((r) => r.type === "promo");
  const companyReps = representatives.filter((r) => r.type === "company");

  const totals = {
    promo: {
      count: promoReps.length,
      value: promoReps.reduce((sum, rep) => sum + (rep.value || 0), 0),
    },
    company: {
      count: companyReps.length,
      value: companyReps.reduce((sum, rep) => sum + (rep.value || 0), 0),
    },
    all: {
      count: representatives.length,
      value: representatives.reduce((sum, rep) => sum + (rep.value || 0), 0),
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-[#F2FCE2]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promo Representatives</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totals.promo.count}</div>
          <p className="text-xs text-muted-foreground">
            Total Value: ${totals.promo.value.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#D3E4FD]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Company Representatives</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totals.company.count}</div>
          <p className="text-xs text-muted-foreground">
            Total Value: ${totals.company.value.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-[#F1F0FB]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Representatives</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totals.all.count}</div>
          <p className="text-xs text-muted-foreground">
            Total Value: ${totals.all.value.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
