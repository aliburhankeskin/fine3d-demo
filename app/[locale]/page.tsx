"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingComponent from "@components/LoadingComponent";
import AppLayout from "@/layout/AppLayout";
import EtapDrawerContent from "@/layout/EtapDrawerContent";
import MainContent from "@/layout/MainContent";
import Canvas from "./Canvas";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [workspaceItems, setWorkspaceItems] = useState([]);
  useEffect(() => {
    axios
      .get(
        "https://api-d.milvasoft.com/fineapi/v1/workspaces/workspace?ProjectId=21&EntityType=0&EntityId=21",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyZWQiOiIyNS4wNy4yMDI1IDIwOjE0OjI2IiwidW5pcXVlX25hbWUiOiJyb290dXNlciIsInJvbGUiOiJBcHAuU3VwZXJBZG1pbiIsInV0IjoiTWFuYWdlciIsIm5iZiI6MTc1MzQ3MjY2NiwiZXhwIjoxNzUzNDc0NDY2LCJpYXQiOjE3NTM0NzI2NjZ9.o8jHU70RhoI0t2-yRG5BC7cTqAmuKJtU8ovTiZWB7R0",
          },
        }
      )
      .then((response) => {
        if (response?.data?.isSuccess) {
          setWorkspaceItems(response?.data?.data?.items || []);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching workspace items:", error);
      });
  }, []);

  return (
    <AppLayout drawer={<EtapDrawerContent blokSayisi={6} daireSayisi={132} />}>
      <MainContent>
        {loading ? (
          <LoadingComponent open />
        ) : (
          <Canvas workspaceItems={workspaceItems} />
        )}
      </MainContent>
    </AppLayout>
  );
}
