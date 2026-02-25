import { useState } from "react"
import {
  Calendar,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Package,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// --- Data Types ---

interface InspectedPiece {
  id: string
  time: string
  product: string
  line: string
  result: "aprobada" | "rechazada" | "en_revision"
  defects: string[]
  confidence: number
  camera: string
  events: PieceEvent[]
}

interface PieceEvent {
  time: string
  event: string
  detail: string
  status: "ok" | "warning" | "error" | "info"
}

interface DayData {
  day: number
  total: number
  approved: number
  rejected: number
  inReview: number
}

interface MonthData {
  month: number
  name: string
  totalPieces: number
  approved: number
  rejected: number
  daysWithData: number
}

interface YearData {
  year: number
  totalPieces: number
  approved: number
  rejected: number
  months: number
}

// --- Mock Data ---

const yearsData: YearData[] = [
  { year: 2026, totalPieces: 14820, approved: 14210, rejected: 462, months: 2 },
  { year: 2025, totalPieces: 184650, approved: 178322, rejected: 4890, months: 12 },
  { year: 2024, totalPieces: 172340, approved: 165810, rejected: 5120, months: 12 },
]

const monthsData: Record<number, MonthData[]> = {
  2026: [
    { month: 1, name: "Enero", totalPieces: 8420, approved: 8102, rejected: 238, daysWithData: 31 },
    { month: 2, name: "Febrero", totalPieces: 6400, approved: 6108, rejected: 224, daysWithData: 25 },
  ],
  2025: [
    { month: 1, name: "Enero", totalPieces: 15200, approved: 14688, rejected: 390, daysWithData: 31 },
    { month: 2, name: "Febrero", totalPieces: 14100, approved: 13608, rejected: 375, daysWithData: 28 },
    { month: 3, name: "Marzo", totalPieces: 15800, approved: 15264, rejected: 410, daysWithData: 31 },
    { month: 4, name: "Abril", totalPieces: 15300, approved: 14780, rejected: 398, daysWithData: 30 },
    { month: 5, name: "Mayo", totalPieces: 15600, approved: 15050, rejected: 420, daysWithData: 31 },
    { month: 6, name: "Junio", totalPieces: 15100, approved: 14580, rejected: 395, daysWithData: 30 },
    { month: 7, name: "Julio", totalPieces: 16000, approved: 15440, rejected: 430, daysWithData: 31 },
    { month: 8, name: "Agosto", totalPieces: 15500, approved: 14960, rejected: 410, daysWithData: 31 },
    { month: 9, name: "Septiembre", totalPieces: 15400, approved: 14870, rejected: 405, daysWithData: 30 },
    { month: 10, name: "Octubre", totalPieces: 15850, approved: 15312, rejected: 420, daysWithData: 31 },
    { month: 11, name: "Noviembre", totalPieces: 15300, approved: 14770, rejected: 407, daysWithData: 30 },
    { month: 12, name: "Diciembre", totalPieces: 14500, approved: 14000, rejected: 380, daysWithData: 31 },
  ],
  2024: [
    { month: 1, name: "Enero", totalPieces: 14200, approved: 13650, rejected: 420, daysWithData: 31 },
    { month: 2, name: "Febrero", totalPieces: 13100, approved: 12590, rejected: 390, daysWithData: 29 },
    { month: 3, name: "Marzo", totalPieces: 14600, approved: 14030, rejected: 435, daysWithData: 31 },
    { month: 4, name: "Abril", totalPieces: 14300, approved: 13740, rejected: 428, daysWithData: 30 },
    { month: 5, name: "Mayo", totalPieces: 14800, approved: 14220, rejected: 445, daysWithData: 31 },
    { month: 6, name: "Junio", totalPieces: 14200, approved: 13650, rejected: 420, daysWithData: 30 },
    { month: 7, name: "Julio", totalPieces: 14900, approved: 14330, rejected: 440, daysWithData: 31 },
    { month: 8, name: "Agosto", totalPieces: 14500, approved: 13940, rejected: 430, daysWithData: 31 },
    { month: 9, name: "Septiembre", totalPieces: 14300, approved: 13740, rejected: 428, daysWithData: 30 },
    { month: 10, name: "Octubre", totalPieces: 14700, approved: 14130, rejected: 438, daysWithData: 31 },
    { month: 11, name: "Noviembre", totalPieces: 14340, approved: 13790, rejected: 423, daysWithData: 30 },
    { month: 12, name: "Diciembre", totalPieces: 14400, approved: 14000, rejected: 423, daysWithData: 31 },
  ],
}

function generateDaysForMonth(year: number, month: number): DayData[] {
  const daysInMonth = new Date(year, month, 0).getDate()
  const today = new Date()
  const days: DayData[] = []

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d)
    if (date > today) break
    if (date.getDay() === 0) continue

    const total = 180 + Math.floor(Math.random() * 120)
    const rejected = 5 + Math.floor(Math.random() * 15)
    const inReview = Math.floor(Math.random() * 6)
    const approved = total - rejected - inReview

    days.push({ day: d, total, approved, rejected, inReview })
  }
  return days
}

function generatePiecesForDay(year: number, month: number, day: number): InspectedPiece[] {
  const products = [
    "Carcasa Motor EV-200",
    "Panel Lateral T-100",
    "Conector Hidraulico H-50",
    "Soporte Estructural SE-75",
    "Eje Transmision TX-30",
  ]
  const lines = ["Linea A1", "Linea A2", "Linea B1", "Linea B2"]
  const cameras = ["CAM-01", "CAM-02", "CAM-03", "CAM-04"]
  const defectTypes = ["Grieta superficial", "Rayadura", "Porosidad", "Deformacion", "Mancha", "Rebaba"]

  const pieces: InspectedPiece[] = []
  const count = 20 + Math.floor(Math.random() * 15)

  for (let i = 0; i < count; i++) {
    const hour = 6 + Math.floor(Math.random() * 14)
    const min = Math.floor(Math.random() * 60)
    const sec = Math.floor(Math.random() * 60)
    const timeStr = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`

    const rand = Math.random()
    const result: InspectedPiece["result"] =
      rand < 0.88 ? "aprobada" : rand < 0.96 ? "rechazada" : "en_revision"

    const defects =
      result === "rechazada"
        ? [defectTypes[Math.floor(Math.random() * defectTypes.length)]]
        : result === "en_revision"
          ? [defectTypes[Math.floor(Math.random() * defectTypes.length)]]
          : []

    const confidence = result === "aprobada"
      ? 95 + Math.random() * 5
      : 60 + Math.random() * 35

    const cam = cameras[Math.floor(Math.random() * cameras.length)]
    const line = lines[Math.floor(Math.random() * lines.length)]
    const product = products[Math.floor(Math.random() * products.length)]

    const baseEvents: PieceEvent[] = [
      { time: timeStr, event: "Ingreso a linea", detail: `${line}, Estacion 1`, status: "info" },
      {
        time: incrementTime(timeStr, 2),
        event: `Captura ${cam}`,
        detail: "Imagen frontal - 1920x1080",
        status: "ok",
      },
      {
        time: incrementTime(timeStr, 3),
        event: "Procesamiento OpenCV",
        detail: "Pre-procesamiento + filtros",
        status: "ok",
      },
      {
        time: incrementTime(timeStr, 4),
        event: "Inferencia IA",
        detail: `YOLOv8-QC v3.2 - ${(8 + Math.random() * 10).toFixed(0)}ms`,
        status: "ok",
      },
    ]

    if (result === "rechazada") {
      baseEvents.push({
        time: incrementTime(timeStr, 5),
        event: "Defecto detectado",
        detail: `${defects[0]} - Confianza ${confidence.toFixed(1)}%`,
        status: "error",
      })
      baseEvents.push({
        time: incrementTime(timeStr, 6),
        event: "Pieza rechazada",
        detail: "Desviada a linea de rechazo",
        status: "error",
      })
    } else if (result === "en_revision") {
      baseEvents.push({
        time: incrementTime(timeStr, 5),
        event: "Anomalia detectada",
        detail: `${defects[0]} - Confianza ${confidence.toFixed(1)}%`,
        status: "warning",
      })
      baseEvents.push({
        time: incrementTime(timeStr, 6),
        event: "Enviada a revision manual",
        detail: "Pendiente de verificacion",
        status: "warning",
      })
    } else {
      baseEvents.push({
        time: incrementTime(timeStr, 5),
        event: "Pieza aprobada",
        detail: `Sin defectos - Confianza ${confidence.toFixed(1)}%`,
        status: "ok",
      })
    }

    pieces.push({
      id: `PZ-${year}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}-${(i + 1).toString().padStart(4, "0")}`,
      time: timeStr,
      product,
      line,
      result,
      defects,
      confidence,
      camera: cam,
      events: baseEvents,
    })
  }

  return pieces.sort((a, b) => a.time.localeCompare(b.time))
}

function incrementTime(time: string, seconds: number): string {
  const [h, m, s] = time.split(":").map(Number)
  const totalSec = h * 3600 + m * 60 + s + seconds
  const hh = Math.floor(totalSec / 3600) % 24
  const mm = Math.floor((totalSec % 3600) / 60)
  const ss = totalSec % 60
  return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`
}

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

// --- Stat helpers ---

function StatPill({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType
  value: number | string
  label: string
  color: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={cn("w-3 h-3", color)} />
      <span className="text-xs font-semibold text-card-foreground">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}

function ApprovalRate({ approved, total }: { approved: number; total: number }) {
  const rate = total > 0 ? ((approved / total) * 100).toFixed(1) : "0"
  return (
    <span className="text-[10px] text-muted-foreground">
      Tasa de aprobacion: <span className="text-primary font-medium">{rate}%</span>
    </span>
  )
}

// --- Components for each level ---

function YearsView({ onSelectYear }: { onSelectYear: (year: number) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {yearsData.map((y) => (
        <button
          key={y.year}
          onClick={() => onSelectYear(y.year)}
          className="group rounded-lg border border-border bg-card p-5 flex flex-col gap-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-card-foreground">{y.year}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-4">
              <StatPill icon={Package} value={y.totalPieces.toLocaleString()} label="piezas" color="text-muted-foreground" />
              <StatPill icon={CheckCircle2} value={y.approved.toLocaleString()} label="aprobadas" color="text-success" />
              <StatPill icon={XCircle} value={y.rejected.toLocaleString()} label="rechazadas" color="text-destructive" />
            </div>
            <ApprovalRate approved={y.approved} total={y.totalPieces} />
          </div>
          <div className="text-[10px] text-muted-foreground">
            {y.months} {y.months === 1 ? "mes" : "meses"} con datos
          </div>
        </button>
      ))}
    </div>
  )
}

function MonthsView({
  year,
  onSelectMonth,
}: {
  year: number
  onSelectMonth: (month: number) => void
}) {
  const months = monthsData[year] || []

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {months.map((m) => (
        <button
          key={m.month}
          onClick={() => onSelectMonth(m.month)}
          className="group rounded-lg border border-border bg-card p-4 flex flex-col gap-3 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-card-foreground">{m.name}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-lg font-bold text-card-foreground">
              {m.totalPieces.toLocaleString()}
            </span>
            <span className="text-[10px] text-muted-foreground">piezas inspeccionadas</span>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-success" />
              <span className="text-[10px] text-card-foreground">{m.approved.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="w-3 h-3 text-destructive" />
              <span className="text-[10px] text-card-foreground">{m.rejected.toLocaleString()}</span>
            </div>
          </div>
          <ApprovalRate approved={m.approved} total={m.totalPieces} />
        </button>
      ))}
    </div>
  )
}

function DaysView({
  year,
  month,
  onSelectDay,
}: {
  year: number
  month: number
  onSelectDay: (day: number) => void
}) {
  const days = generateDaysForMonth(year, month)

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
      {days.map((d) => {
        const rejectionRate = d.total > 0 ? (d.rejected / d.total) * 100 : 0
        return (
          <button
            key={d.day}
            onClick={() => onSelectDay(d.day)}
            className={cn(
              "group rounded-lg border bg-card p-3 flex flex-col items-center gap-2 text-left transition-all hover:border-primary/40 hover:bg-primary/5",
              rejectionRate > 8
                ? "border-destructive/30"
                : "border-border"
            )}
          >
            <span className="text-lg font-bold text-card-foreground">{d.day}</span>
            <span className="text-[10px] text-muted-foreground">{d.total} pzas</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5 text-success" />
                <span className="text-[9px] text-card-foreground">{d.approved}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <XCircle className="w-2.5 h-2.5 text-destructive" />
                <span className="text-[9px] text-card-foreground">{d.rejected}</span>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function PiecesView({
  year,
  month,
  day,
}: {
  year: number
  month: number
  day: number
}) {
  const [pieces] = useState(() => generatePiecesForDay(year, month, day))
  const [expandedPiece, setExpandedPiece] = useState<string | null>(null)

  const approved = pieces.filter((p) => p.result === "aprobada").length
  const rejected = pieces.filter((p) => p.result === "rechazada").length
  const inReview = pieces.filter((p) => p.result === "en_revision").length

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4">
        <StatPill icon={Package} value={pieces.length} label="piezas" color="text-muted-foreground" />
        <StatPill icon={CheckCircle2} value={approved} label="aprobadas" color="text-success" />
        <StatPill icon={XCircle} value={rejected} label="rechazadas" color="text-destructive" />
        <StatPill icon={AlertTriangle} value={inReview} label="en revision" color="text-warning" />
        <ApprovalRate approved={approved} total={pieces.length} />
      </div>

      {/* Pieces list */}
      <div className="flex flex-col gap-2">
        {pieces.map((piece) => {
          const isExpanded = expandedPiece === piece.id
          return (
            <div key={piece.id} className="rounded-lg border border-border bg-card overflow-hidden">
              <button
                onClick={() => setExpandedPiece(isExpanded ? null : piece.id)}
                className="w-full p-3 flex items-center gap-3 text-left hover:bg-secondary/50 transition-colors"
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    piece.result === "aprobada" && "bg-success",
                    piece.result === "rechazada" && "bg-destructive",
                    piece.result === "en_revision" && "bg-warning"
                  )}
                />
                <span className="text-xs font-mono font-medium text-card-foreground min-w-28">
                  {piece.id}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono min-w-16">
                  {piece.time}
                </span>
                <span className="text-xs text-card-foreground hidden sm:block flex-1 truncate">
                  {piece.product}
                </span>
                <span className="text-[10px] text-muted-foreground hidden md:block">{piece.line}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] ml-auto shrink-0",
                    piece.result === "aprobada" && "border-success/40 text-success bg-success/10",
                    piece.result === "rechazada" && "border-destructive/40 text-destructive bg-destructive/10",
                    piece.result === "en_revision" && "border-warning/40 text-warning bg-warning/10"
                  )}
                >
                  {piece.result === "aprobada" ? "Aprobada" : piece.result === "rechazada" ? "Rechazada" : "En revision"}
                </Badge>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform shrink-0",
                    isExpanded && "rotate-90"
                  )}
                />
              </button>

              {isExpanded && (
                <div className="border-t border-border p-4 bg-secondary/20">
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-[10px] text-muted-foreground">
                    <span>Camara: <span className="text-card-foreground font-medium">{piece.camera}</span></span>
                    <span>Linea: <span className="text-card-foreground font-medium">{piece.line}</span></span>
                    <span>Confianza: <span className="text-card-foreground font-medium">{piece.confidence.toFixed(1)}%</span></span>
                    {piece.defects.length > 0 && (
                      <span>Defecto: <span className="text-destructive font-medium">{piece.defects.join(", ")}</span></span>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="relative pl-6">
                    <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
                    <div className="flex flex-col gap-3">
                      {piece.events.map((event, idx) => (
                        <div key={idx} className="relative flex items-start gap-3">
                          <div
                            className={cn(
                              "absolute left-[-18px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-card",
                              event.status === "ok" && "bg-success",
                              event.status === "error" && "bg-destructive",
                              event.status === "warning" && "bg-warning",
                              event.status === "info" && "bg-primary"
                            )}
                          />
                          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <span className="text-[10px] font-mono text-muted-foreground w-16 shrink-0">
                              {event.time}
                            </span>
                            <span className="text-xs text-card-foreground font-medium">
                              {event.event}
                            </span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground/50 hidden sm:block shrink-0" />
                            <span className="text-xs text-muted-foreground">{event.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- Main Component ---

type DrillLevel = "years" | "months" | "days" | "pieces"

export function TraceabilitySection() {
  const [level, setLevel] = useState<DrillLevel>("years")
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [selectedMonth, setSelectedMonth] = useState<number>(0)
  const [selectedDay, setSelectedDay] = useState<number>(0)

  function handleSelectYear(year: number) {
    setSelectedYear(year)
    setLevel("months")
  }

  function handleSelectMonth(month: number) {
    setSelectedMonth(month)
    setLevel("days")
  }

  function handleSelectDay(day: number) {
    setSelectedDay(day)
    setLevel("pieces")
  }

  function handleBack() {
    if (level === "months") setLevel("years")
    else if (level === "days") setLevel("months")
    else if (level === "pieces") setLevel("days")
  }

  function getBreadcrumb(): string[] {
    const crumbs: string[] = []
    if (level === "months" || level === "days" || level === "pieces") {
      crumbs.push(String(selectedYear))
    }
    if (level === "days" || level === "pieces") {
      crumbs.push(monthNames[selectedMonth - 1])
    }
    if (level === "pieces") {
      crumbs.push(`Dia ${selectedDay}`)
    }
    return crumbs
  }

  const breadcrumb = getBreadcrumb()

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {level !== "years" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="sr-only">Volver</span>
            </Button>
          )}
          <div>
            {breadcrumb.length > 0 && (
              <nav className="flex items-center gap-1 text-xs text-muted-foreground">
                {breadcrumb.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="w-3 h-3" />}
                    <span className={cn(i === breadcrumb.length - 1 && "text-foreground font-medium")}>
                      {crumb}
                    </span>
                  </span>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* Content per level */}
      {level === "years" && <YearsView onSelectYear={handleSelectYear} />}
      {level === "months" && <MonthsView year={selectedYear} onSelectMonth={handleSelectMonth} />}
      {level === "days" && <DaysView year={selectedYear} month={selectedMonth} onSelectDay={handleSelectDay} />}
      {level === "pieces" && <PiecesView year={selectedYear} month={selectedMonth} day={selectedDay} />}
    </div>
  )
}
