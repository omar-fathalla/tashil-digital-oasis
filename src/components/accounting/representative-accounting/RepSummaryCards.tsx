
import { CardGrid } from "@/components/ui/card-layout/CardGrid";
import { BaseCard } from "@/components/ui/card-layout/BaseCard";
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
    <CardGrid columns={3}>
      <BaseCard className="bg-[#F2FCE2]">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Promo Representatives</h3>
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{totals.promo.count}</div>
            <p className="text-xs text-muted-foreground">
              Total Value: ${totals.promo.value.toLocaleString()}
            </p>
          </div>
        </div>
      </BaseCard>

      <BaseCard className="bg-[#D3E4FD]">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Company Representatives</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{totals.company.count}</div>
            <p className="text-xs text-muted-foreground">
              Total Value: ${totals.company.value.toLocaleString()}
            </p>
          </div>
        </div>
      </BaseCard>

      <BaseCard className="bg-[#F1F0FB]">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Total Representatives</h3>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{totals.all.count}</div>
            <p className="text-xs text-muted-foreground">
              Total Value: ${totals.all.value.toLocaleString()}
            </p>
          </div>
        </div>
      </BaseCard>
    </CardGrid>
  );
};
