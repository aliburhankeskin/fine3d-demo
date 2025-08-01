"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setAllPresentationData } from "@redux/appSlice";
import LoadingComponent from "@components/LoadingComponent";

export default function DataProvider({
  children,
  presentationInitResponse,
  presentationResponse,
  tabBarContentResponse,
  rightBarContentResponse,
}: {
  children: React.ReactNode;
  presentationInitResponse: any;
  presentationResponse: any;
  tabBarContentResponse: any;
  rightBarContentResponse: any;
}) {
  const dispatch = useDispatch();
  const [isDataSet, setIsDataSet] = useState(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (
      !isInitialized.current &&
      presentationInitResponse &&
      presentationResponse &&
      tabBarContentResponse &&
      rightBarContentResponse
    ) {
      dispatch(
        setAllPresentationData({
          presentationInitResponse: presentationInitResponse,
          presentationResponse: presentationResponse,
          tabBarContentResponse: tabBarContentResponse,
          rightBarContentResponse: rightBarContentResponse,
        })
      );

      isInitialized.current = true;
      setIsDataSet(true);
    }
  }, []);

  if (!isDataSet) {
    return <LoadingComponent open />;
  }

  return <>{children}</>;
}
