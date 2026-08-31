"use client";

import { useState } from "react";
import { DynamicChart } from "./dynamic-chart";
import { GenerativeInsightInput } from "./generative-insight-input";
import { GenerativeChart } from "../schemas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GenerativeInsightPanel() {
  const [insight, setInsight] = useState<GenerativeChart | null>(null);

  const renderInsight = () => {
    if (!insight) return null;

    return <DynamicChart {...insight} />;
  };

  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>Generative Insight</CardTitle>
        <CardDescription className="mb-4">Masukkan perintah dan dapatkan insight cepat dari AI</CardDescription>
        <GenerativeInsightInput
          onGetResult={(data) => {
            setInsight(data);
          }}
        />
      </CardHeader>
      <CardContent className="grow">
        <div className="size-full border rounded-lg">{renderInsight()}</div>
      </CardContent>
    </Card>
  );
}
