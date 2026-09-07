"use client";

import { useState } from "react";
import { DynamicChart } from "./dynamic-chart";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { GenerativeChart } from "../schemas";
import { GenerativeInsightInput } from "./generative-insight-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GenerativeInsightPanel() {
  const [insight, setInsight] = useState<GenerativeChart | null>(null);

  const renderInsight = () => {
    if (!insight) {
      return (
        <div className="size-full flex flex-col justify-center items-center text-center">
          <div className="bg-primary/10 text-primary size-12 rounded-full grid place-content-center mb-3">
            <HugeiconsIcon icon={SparklesIcon} size={24} color="currentColor" strokeWidth={1.5} />
          </div>
          <p className="font-semibold text-foreground">Dapatkan insight bisnis dari AI</p>
          <p className="text-muted-foreground text-sm">Masukkan perintah dan AI akan menampilkan insight berdasarkan data Anda.</p>
        </div>
      );
    }

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
