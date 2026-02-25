import { useState, useMemo } from "react"
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts"

// Datos para diferentes períodos
const dataByPeriod = {
  "7d": {
    trend: [
      { day: "Lun", defectos: 78, aprobacion: 93.1, throughput: 2840 },
      { day: "Mar", defectos: 65, aprobacion: 93.8, throughput: 2920 },
      { day: "Mie", defectos: 71, aprobacion: 93.5, throughput: 2780 },
      { day: "Jue", defectos: 58, aprobacion: 94.0, throughput: 3010 },
      { day: "Vie", defectos: 52, aprobacion: 94.5, throughput: 3100 },
      { day: "Sab", defectos: 45, aprobacion: 94.8, throughput: 2650 },
      { day: "Dom", defectos: 63, aprobacion: 94.2, throughput: 2500 },
    ],
    comparison: [
      { month: "Sem 1", planta1: 92.8, planta2: 92.3 },
      { month: "Sem 2", planta1: 93.2, planta2: 92.7 },
      { month: "Sem 3", planta1: 93.5, planta2: 93.0 },
      { month: "Sem 4", planta1: 94.0, planta2: 93.4 },
    ],
    metrics: {
      improvement: "+1.2%",
      reduction: "-15.2%",
      throughput: "2,840/dia",
      comparisonText: "vs. semana anterior",
    },
    trendTitle: "Ultima semana",
    trendSubtitle: "Tendencia diaria",
  },
  "30d": {
    trend: [
      { day: "Sem 1", defectos: 485, aprobacion: 93.2, throughput: 19800 },
      { day: "Sem 2", defectos: 452, aprobacion: 93.5, throughput: 20100 },
      { day: "Sem 3", defectos: 428, aprobacion: 93.8, throughput: 20500 },
      { day: "Sem 4", defectos: 395, aprobacion: 94.1, throughput: 20800 },
    ],
    comparison: [
      { month: "Sem 1", planta1: 92.8, planta2: 92.3 },
      { month: "Sem 2", planta1: 93.2, planta2: 92.7 },
      { month: "Sem 3", planta1: 93.5, planta2: 93.0 },
      { month: "Sem 4", planta1: 94.0, planta2: 93.4 },
    ],
    metrics: {
      improvement: "+1.8%",
      reduction: "-18.3%",
      throughput: "2,828/dia",
      comparisonText: "vs. mes anterior",
    },
    trendTitle: "Ultimo mes",
    trendSubtitle: "Tendencia semanal",
  },
  "90d": {
    trend: [
      { day: "Mes 1", defectos: 1850, aprobacion: 92.5, throughput: 85200 },
      { day: "Mes 2", defectos: 1720, aprobacion: 93.1, throughput: 86800 },
      { day: "Mes 3", defectos: 1580, aprobacion: 93.8, throughput: 88200 },
    ],
    comparison: [
      { month: "Mes 1", planta1: 92.5, planta2: 92.0 },
      { month: "Mes 2", planta1: 93.1, planta2: 92.6 },
      { month: "Mes 3", planta1: 93.8, planta2: 93.2 },
    ],
    metrics: {
      improvement: "+2.1%",
      reduction: "-20.5%",
      throughput: "2,867/dia",
      comparisonText: "vs. hace 3 meses",
    },
    trendTitle: "Ultimos 3 meses",
    trendSubtitle: "Tendencia mensual",
  },
  "6m": {
    trend: [
      { day: "Sep", defectos: 1850, aprobacion: 92.1, throughput: 85200 },
      { day: "Oct", defectos: 1720, aprobacion: 92.5, throughput: 86800 },
      { day: "Nov", defectos: 1650, aprobacion: 93.0, throughput: 87500 },
      { day: "Dic", defectos: 1580, aprobacion: 93.2, throughput: 88200 },
      { day: "Ene", defectos: 1520, aprobacion: 93.8, throughput: 89000 },
      { day: "Feb", defectos: 1420, aprobacion: 94.2, throughput: 89500 },
    ],
    comparison: [
      { month: "Sep", planta1: 92.1, planta2: 91.8 },
      { month: "Oct", planta1: 92.5, planta2: 92.0 },
      { month: "Nov", planta1: 93.0, planta2: 92.3 },
      { month: "Dic", planta1: 93.2, planta2: 92.8 },
      { month: "Ene", planta1: 93.8, planta2: 93.1 },
      { month: "Feb", planta1: 94.2, planta2: 93.5 },
    ],
    metrics: {
      improvement: "+2.1%",
      reduction: "-23.2%",
      throughput: "2,878/dia",
      comparisonText: "vs. hace 6 meses",
    },
    trendTitle: "Ultimos 6 meses",
    trendSubtitle: "Tendencia mensual",
  },
}

const defectTrendByLine = [
  { line: "A1", ene: 45, feb: 38 },
  { line: "A2", ene: 32, feb: 28 },
  { line: "A3", ene: 51, feb: 42 },
  { line: "B1", ene: 28, feb: 22 },
  { line: "B2", ene: 19, feb: 15 },
  { line: "C1", ene: 38, feb: 35 },
  { line: "C2", ene: 42, feb: 31 },
  { line: "D1", ene: 25, feb: 20 },
  { line: "D2", ene: 33, feb: 27 },
]

const hourlyPattern = [
  { hour: "06", defects: 8 },
  { hour: "07", defects: 12 },
  { hour: "08", defects: 15 },
  { hour: "09", defects: 11 },
  { hour: "10", defects: 9 },
  { hour: "11", defects: 7 },
  { hour: "12", defects: 14 },
  { hour: "13", defects: 18 },
  { hour: "14", defects: 10 },
  { hour: "15", defects: 8 },
  { hour: "16", defects: 13 },
  { hour: "17", defects: 11 },
]

export function AnalyticsSection() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "6m">("7d")

  const currentData = useMemo(() => dataByPeriod[period], [period])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={period} onValueChange={(value) => setPeriod(value as "7d" | "30d" | "90d" | "6m")}>
            <SelectTrigger className="w-40 h-8 bg-secondary border-border text-foreground text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="7d">Ultimos 7 dias</SelectItem>
              <SelectItem value="30d">Ultimos 30 dias</SelectItem>
              <SelectItem value="90d">Ultimos 90 dias</SelectItem>
              <SelectItem value="6m">Ultimos 6 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/10">
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mejora en tasa de aprobacion</p>
            <p className="text-lg font-bold text-card-foreground">{currentData.metrics.improvement}</p>
            <p className="text-[10px] text-muted-foreground">{currentData.metrics.comparisonText}</p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-success/10">
            <TrendingDown className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reduccion de defectos</p>
            <p className="text-lg font-bold text-card-foreground">{currentData.metrics.reduction}</p>
            <p className="text-[10px] text-muted-foreground">{currentData.metrics.comparisonText}</p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Throughput promedio</p>
            <p className="text-lg font-bold text-card-foreground">{currentData.metrics.throughput}</p>
            <p className="text-[10px] text-muted-foreground">ambas plantas</p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Defect Trend */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">
                Tendencia de Defectos
              </h3>
              <p className="text-xs text-muted-foreground">{currentData.trendSubtitle}</p>
            </div>
            <Badge variant="secondary" className="text-[10px] text-secondary-foreground">
              {currentData.metrics.reduction} vs periodo anterior
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={currentData.trend}>
              <defs>
                <linearGradient id="colorDefectos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey={period === "7d" ? "day" : period === "30d" ? "day" : "day"}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--card-foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey="defectos"
                stroke="var(--chart-4)"
                fill="url(#colorDefectos)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Plant Comparison */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">
                Comparativa de Plantas
              </h3>
              <p className="text-xs text-muted-foreground">Tasa de aprobacion {period === "7d" ? "semanal" : period === "30d" ? "semanal" : "mensual"}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-chart-1" />
                <span className="text-xs text-muted-foreground">P1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-chart-2" />
                <span className="text-xs text-muted-foreground">P2</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={currentData.comparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis
                domain={[90, 95]}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--card-foreground)",
                }}
              />
              <Line
                type="monotone"
                dataKey="planta1"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ fill: "var(--chart-1)", r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="planta2"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={{ fill: "var(--chart-2)", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Defects by Line */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">
                Defectos por Linea de Produccion
              </h3>
              <p className="text-xs text-muted-foreground">Comparativa Enero vs Febrero</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-chart-5" />
                <span className="text-xs text-muted-foreground">Ene</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-chart-1" />
                <span className="text-xs text-muted-foreground">Feb</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={defectTrendByLine}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="line"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--card-foreground)",
                }}
              />
              <Bar dataKey="ene" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="feb" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Pattern */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">
                Patron Horario de Defectos
              </h3>
              <p className="text-xs text-muted-foreground">Distribucion promedio por hora</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={hourlyPattern}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--card-foreground)",
                }}
              />
              <Bar dataKey="defects" radius={[4, 4, 0, 0]}>
                {hourlyPattern.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.defects > 14 ? "var(--chart-4)" : entry.defects > 10 ? "var(--chart-3)" : "var(--chart-1)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-chart-1" />
              <span className="text-[10px] text-muted-foreground">Normal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-chart-3" />
              <span className="text-[10px] text-muted-foreground">Elevado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-chart-4" />
              <span className="text-[10px] text-muted-foreground">Critico</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
