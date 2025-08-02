"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  setAllPresentationData,
  setCurrentEntityType,
  setCurrentEntityId,
  setSelectedUnitId,
  setUnitDetailDrawerOpen,
} from "@redux/appSlice";
import LoadingComponent from "@components/LoadingComponent";
import { EntityTypeEnum } from "@enums/EntityTypeEnum";

export default function DataProvider({
  children,
  presentationInitResponse,
  presentationResponse,
  tabBarContentResponse,
  rightBarContentResponse,
  currentEntityType,
  currentEntityId,
  selectedUnitId,
}: {
  children: React.ReactNode;
  presentationInitResponse: any;
  presentationResponse: any;
  tabBarContentResponse: any;
  rightBarContentResponse: any;
  currentEntityType?: EntityTypeEnum;
  currentEntityId?: string | number;
  selectedUnitId?: number | null;
}) {
  const dispatch = useDispatch();
  const [isDataSet, setIsDataSet] = useState(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      dispatch(
        setAllPresentationData({
          presentationInitResponse: presentationInitResponse || null,
          presentationResponse: presentationResponse || null,
          tabBarContentResponse: tabBarContentResponse || null,
          rightBarContentResponse: rightBarContentResponse || null,
        })
      );

      if (currentEntityType !== undefined) {
        dispatch(setCurrentEntityType(currentEntityType));
      }
      if (currentEntityId !== undefined) {
        dispatch(setCurrentEntityId(currentEntityId?.toString()));
      }
      if (selectedUnitId !== null && selectedUnitId !== undefined) {
        dispatch(setSelectedUnitId(selectedUnitId));
        dispatch(setUnitDetailDrawerOpen(true));
      }

      isInitialized.current = true;
      setIsDataSet(true);
    }
  }, [
    dispatch,
    presentationInitResponse,
    presentationResponse,
    tabBarContentResponse,
    rightBarContentResponse,
    currentEntityType,
    currentEntityId,
    selectedUnitId,
  ]);

  if (!isDataSet) {
    return <LoadingComponent open />;
  }

  return <>{children}</>;
}
