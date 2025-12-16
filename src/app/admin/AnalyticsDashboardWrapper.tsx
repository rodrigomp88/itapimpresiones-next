'use client';

import { lazyLoad } from "@/components/LazyLoad";

// Lazy load del AnalyticsDashboard para mejor performance
const AnalyticsDashboard = lazyLoad(() => import("@/components/Admin/AnalyticsDashboard"));

const AnalyticsDashboardWrapper: React.FC = () => {
  return <AnalyticsDashboard />;
};

export default AnalyticsDashboardWrapper;
