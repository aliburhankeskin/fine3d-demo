import axiosInstance from "@network/axiosInstance";
import { OpsApiRoutes } from "@network/OpsApiRoutes";
import getAcceptLanguage from "@helpers/Auth/getAcceptLanguage";
import { EntityTypeEnum } from "@enums/EntityTypeEnum";
import AppLayout from "@/layout/AppLayout";
import EtapDrawerContent from "@/layout/EtapDrawerContent";
import MainContent from "@/layout/MainContent";
import Canvas from "./Canvas";
import { IPresentationInitResponse } from "@/types/IPresentationInitResponse";
import { IBaseResponse } from "@/types/IBaseResponse";
import { IPresentationResponse } from "@/types/IPresentationResponse";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; tenantId: string; projectSlug: string }>;
}) {
  const { locale, tenantId, projectSlug } = await params;
  const TenantId = decodeURIComponent(tenantId);
  const ProjectSlug = decodeURIComponent(projectSlug);

  const PresentationInitResponse = await axiosInstance.get<
    IBaseResponse<IPresentationInitResponse>
  >(OpsApiRoutes.GetPresentationInit, {
    params: {
      TenantId,
      ProjectSlug,
    },
    headers: {
      "Accept-Language": getAcceptLanguage(locale),
    },
  });

  if (!PresentationInitResponse?.data?.isSuccess) {
    return <div>Error loading presentation</div>;
  }

  const initData = PresentationInitResponse?.data?.data;

  const GeneralParams = {
    TenantId,
    ProjectSlug,
    ProjectId: initData?.projectId,
    EntityType: EntityTypeEnum.Project,
    EntityId: initData?.projectId,
  };

  const PresentationResponse = await axiosInstance.get<
    IBaseResponse<IPresentationResponse>
  >(OpsApiRoutes.GetPresentations, {
    params: GeneralParams,
    headers: {
      "Accept-Language": getAcceptLanguage(locale),
    },
  });

  const TabBarContentResponse = await axiosInstance.get(
    OpsApiRoutes.GetPresentationTabBar,
    {
      params: GeneralParams,
      headers: {
        "Accept-Language": getAcceptLanguage(locale),
      },
    }
  );

  const RigthBarContentResponse = await axiosInstance.get(
    OpsApiRoutes.GetPresentationRightBar,
    {
      params: GeneralParams,
      headers: {
        "Accept-Language": getAcceptLanguage(locale),
      },
    }
  );

  return (
    <AppLayout drawer={<EtapDrawerContent blokSayisi={6} daireSayisi={132} />}>
      <Canvas workspaceItems={PresentationResponse?.data?.data?.tags || []} />
    </AppLayout>
  );
}
