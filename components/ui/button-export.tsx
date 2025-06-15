"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ButtonExport() {
  const { id } = useParams();

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/projects/${id}/export`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `project-${id}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <Button variant="ghost" onClick={handleExport}>
      <Download /> Export
    </Button>
  );
}
