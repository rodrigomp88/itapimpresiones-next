"use client";

import React from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileNavigation from "./MobileNavigation";

const MobileNavigationWrapper = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return <MobileNavigation />;
};

export default MobileNavigationWrapper;
