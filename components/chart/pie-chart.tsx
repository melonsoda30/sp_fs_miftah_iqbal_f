"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  PieController,
  ChartData,
  ChartOptions,
} from "chart.js";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

// ✅ REGISTER semua komponen Pie Chart
Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

export function PieChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const { id } = useParams();
  const { data, error } = useSWR(`/api/projects/${id}/analytics`, fetcher);

  useEffect(() => {
    if (!data || !ref.current) return;

    const ctx = ref.current.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = Object.keys(data.data);
    const values = Object.values(data.data).map(Number) as number[];

    const chartData: ChartData<"pie"> = {
      labels,
      datasets: [
        {
          label: "Tasks",
          data: values,
          backgroundColor: [
            "#f87171", // Red
            "#facc15", // Yellow
            "#34d399", // Green
          ],
          borderWidth: 1,
        },
      ],
    };

    const chartOptions: ChartOptions<"pie"> = {
      responsive: true,
    };

    chartRef.current = new Chart(ctx, {
      type: "pie",
      data: chartData,
      options: chartOptions,
    });
  }, [data]);

  if (error) return <p className="text-red-500">Failed to load data</p>;
  if (!data)
    return <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />;

  return <canvas ref={ref} className="max-w-md w-full h-auto" />;
}
