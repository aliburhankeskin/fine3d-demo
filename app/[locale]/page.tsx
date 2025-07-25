import axios from "axios";
import AppLayout from "@/layout/AppLayout";
import EtapDrawerContent from "@/layout/EtapDrawerContent";
import MainContent from "@/layout/MainContent";
import Canvas from "./Canvas";

export default async function Page() {
  const response = await axios.get(
    "https://api-d.milvasoft.com/fineapi/v1/workspaces/workspace?ProjectId=21&EntityType=0&EntityId=21",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyZWQiOiIyNS4wNy4yMDI1IDIwOjQ3OjE0IiwidW5pcXVlX25hbWUiOiJyb290dXNlciIsInJvbGUiOiJBcHAuU3VwZXJBZG1pbiIsInV0IjoiTWFuYWdlciIsIm5iZiI6MTc1MzQ3NDYzNCwiZXhwIjoxNzUzNDc2NDM0LCJpYXQiOjE3NTM0NzQ2MzR9.LT5idNzRFYIe1z8rMe3jYbzhNU0FQzNGEMeCZOugkE4",
      },
    }
  );

  return (
    <AppLayout drawer={<EtapDrawerContent blokSayisi={6} daireSayisi={132} />}>
      <MainContent>
        <Canvas workspaceItems={response?.data?.data?.items || []} />
      </MainContent>
    </AppLayout>
  );
}
