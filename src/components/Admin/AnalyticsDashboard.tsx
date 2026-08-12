"use client";

import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ClockIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  avgOrderValue: number;
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    orders: number;
    conversionRate: number;
  }>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  trafficSources: Array<{
    source: string;
    visits: number;
    conversions: number;
  }>;
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  className = "",
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  // Datos simulados (en producción vendrían de Firebase Analytics/GA4)
  const mockAnalyticsData: AnalyticsData = {
    totalRevenue: 245680,
    totalOrders: 156,
    conversionRate: 3.2,
    avgOrderValue: 1575,
    topProducts: [
      {
        id: "1",
        name: "Camiseta Personalizada",
        revenue: 45600,
        orders: 28,
        conversionRate: 4.2,
      },
      {
        id: "2",
        name: "Bolsa Troquel",
        revenue: 38900,
        orders: 22,
        conversionRate: 3.8,
      },
      {
        id: "3",
        name: "Gorra Bordada",
        revenue: 32400,
        orders: 18,
        conversionRate: 3.1,
      },
      {
        id: "4",
        name: "Bolsa Manija",
        revenue: 28600,
        orders: 19,
        conversionRate: 2.9,
      },
      {
        id: "5",
        name: "Remera Algodón",
        revenue: 25100,
        orders: 16,
        conversionRate: 2.7,
      },
    ],
    revenueByDay: [
      { date: "2025-12-10", revenue: 28400, orders: 18 },
      { date: "2025-12-11", revenue: 35200, orders: 22 },
      { date: "2025-12-12", revenue: 29800, orders: 19 },
      { date: "2025-12-13", revenue: 42600, orders: 27 },
      { date: "2025-12-14", revenue: 38100, orders: 24 },
      { date: "2025-12-15", revenue: 35900, orders: 23 },
      { date: "2025-12-16", revenue: 31680, orders: 20 },
    ],
    trafficSources: [
      { source: "Búsqueda Orgánica", visits: 1240, conversions: 45 },
      { source: "Directo", visits: 890, conversions: 38 },
      { source: "Redes Sociales", visits: 567, conversions: 22 },
      { source: "Email Marketing", visits: 234, conversions: 18 },
      { source: "Referencias", visits: 189, conversions: 12 },
    ],
    deviceStats: {
      desktop: 45.2,
      mobile: 42.8,
      tablet: 12.0,
    },
  };

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData);
      setLoading(false);
    }, 1000);
  }, [dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ComponentType<any>;
    color?: string;
  }) => {
    const colorClasses = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      purple: "bg-purple-500 text-white",
      orange: "bg-orange-500 text-white",
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change !== undefined && (
              <p
                className={`text-sm mt-1 flex items-center ${
                  change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                {change >= 0 ? "+" : ""}
                {change.toFixed(1)}% vs período anterior
              </p>
            )}
          </div>
          <div
            className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard de Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            Métricas de rendimiento y conversiones
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ingresos Totales"
          value={formatCurrency(analyticsData.totalRevenue)}
          change={12.5}
          icon={CurrencyDollarIcon}
          color="green"
        />
        <MetricCard
          title="Órdenes Totales"
          value={analyticsData.totalOrders.toString()}
          change={8.3}
          icon={ShoppingCartIcon}
          color="blue"
        />
        <MetricCard
          title="Tasa de Conversión"
          value={formatPercentage(analyticsData.conversionRate)}
          change={-2.1}
          icon={ArrowTrendingUpIcon}
          color="purple"
        />
        <MetricCard
          title="Valor Promedio"
          value={formatCurrency(analyticsData.avgOrderValue)}
          change={15.7}
          icon={ChartBarIcon}
          color="orange"
        />
      </div>

      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos más vendidos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Productos Más Vendidos
          </h3>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.orders} órdenes
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(product.revenue)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatPercentage(product.conversionRate)} conversión
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fuentes de tráfico */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fuentes de Tráfico
          </h3>
          <div className="space-y-4">
            {analyticsData.trafficSources.map((source, index) => (
              <div
                key={source.source}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {source.source}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {source.visits.toLocaleString()} visitas
                  </p>
                  <p className="text-xs text-gray-500">
                    {source.conversions} conversiones
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dispositivos y tiempo real */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Dispositivos
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Desktop</span>
              <span className="text-sm font-semibold">
                {formatPercentage(analyticsData.deviceStats.desktop)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${analyticsData.deviceStats.desktop}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mobile</span>
              <span className="text-sm font-semibold">
                {formatPercentage(analyticsData.deviceStats.mobile)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${analyticsData.deviceStats.mobile}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tablet</span>
              <span className="text-sm font-semibold">
                {formatPercentage(analyticsData.deviceStats.tablet)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${analyticsData.deviceStats.tablet}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Actividad en tiempo real */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad en Tiempo Real
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                3 usuarios online ahora
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Última orden hace 12 min
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <StarIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Nueva reseña hace 1 hora
              </span>
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas</h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Stock bajo en 3 productos
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">Meta de ingresos al 78%</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">Reseñas positivas +15%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
