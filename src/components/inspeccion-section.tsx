import { useState, useCallback } from "react"
import {
  Camera,
  CircleDot,
  CheckCircle2,
  XCircle,
  Minus,
  ScanLine,
} from "lucide-react"
import { cn } from "@/lib/utils"

// --- Piece components data ---

interface PieceComponent {
  id: string
  name: string
  spec: string
  tolerance: string
}

const pieceComponents: PieceComponent[] = [
  { id: "C-01", name: "Base metalica", spec: "Alineacion 0.02mm", tolerance: "+/- 0.01mm" },
  { id: "C-02", name: "Conector principal", spec: "Soldadura completa", tolerance: "100% cobertura" },
  { id: "C-03", name: "Circuito PCB", spec: "Sin cortocircuito", tolerance: "0 defectos" },
  { id: "C-04", name: "Revestimiento", spec: "Grosor 1.5mm", tolerance: "+/- 0.2mm" },
  { id: "C-05", name: "Tornillo M3 (x4)", spec: "Torque 2.5 Nm", tolerance: "+/- 0.3 Nm" },
  { id: "C-06", name: "Junta de sellado", spec: "Sin deformacion", tolerance: "IP67" },
  { id: "C-07", name: "Etiqueta QR", spec: "Legibilidad", tolerance: "100% escaneable" },
  { id: "C-08", name: "Acabado superficial", spec: "Ra 0.8 um", tolerance: "+/- 0.2 um" },
  { id: "C-09", name: "Sensor de temperatura", spec: "Rango -40°C a 85°C", tolerance: "+/- 2°C" },
  { id: "C-10", name: "Cableado interno", spec: "Aislamiento completo", tolerance: "0 cortos" },
  { id: "C-11", name: "Ventilador de refrigeracion", spec: "RPM 2000-3000", tolerance: "+/- 100 RPM" },
  { id: "C-12", name: "Filtro de aire", spec: "Porosidad 0.3um", tolerance: "100% eficiencia" },
  { id: "C-13", name: "Interruptor principal", spec: "Resistencia < 0.1Ω", tolerance: "0.05Ω max" },
  { id: "C-14", name: "LED indicador", spec: "Intensidad 100-150 cd", tolerance: "+/- 10 cd" },
  { id: "C-15", name: "Bateria de respaldo", spec: "Voltaje 12V", tolerance: "+/- 0.5V" },
  { id: "C-16", name: "Carcasa protectora", spec: "Espesor 2.0mm", tolerance: "+/- 0.1mm" },
]

type ComponentResult = "pendiente" | "correcto" | "incorrecto"

interface ComponentWithResult extends PieceComponent {
  result: ComponentResult
}

// --- Main Component ---

export function InspeccionSection() {
  const [components, setComponents] = useState<ComponentWithResult[]>(
    pieceComponents.map((c) => ({ ...c, result: "pendiente" }))
  )
  const [isInspecting, setIsInspecting] = useState(false)
  const [inspectionCount, setInspectionCount] = useState(0)
  const [lastResult, setLastResult] = useState<"aprobada" | "rechazada" | null>(null)

  const runInspection = useCallback(() => {
    setIsInspecting(true)
    setLastResult(null)

    // Reset all to pending
    setComponents(pieceComponents.map((c) => ({ ...c, result: "pendiente" })))

    // Immediately update all components at once
    setTimeout(() => {
      const updatedComponents = pieceComponents.map((c) => {
        // ~85% chance correct, ~15% chance incorrect
        const isCorrect = Math.random() > 0.15
        return {
          ...c,
          result: isCorrect ? "correcto" : "incorrecto" as ComponentResult,
        }
      })

      setComponents(updatedComponents)
      setIsInspecting(false)
      setInspectionCount((prev) => prev + 1)
      
      const hasDefect = updatedComponents.some((c) => c.result === "incorrecto")
      setLastResult(hasDefect ? "rechazada" : "aprobada")
    }, 100)
  }, [])

  const correctCount = components.filter((c) => c.result === "correcto").length
  const incorrectCount = components.filter((c) => c.result === "incorrecto").length

  return (
    <div className="h-full relative">
      {/* LEFT: Camera area - normal flow, half width */}
      <div className="lg:w-1/2 lg:pr-6 flex flex-col gap-4">
        {/* Camera feed - flush with header, left edge and table */}
        <div className="relative bg-card overflow-hidden -mt-4 md:-mt-6 -ml-4 md:-ml-6 lg:-mr-9">
          <div className="aspect-video bg-secondary/80 flex items-center justify-center relative">
            {/* Simulated camera overlay */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.012)_2px,rgba(255,255,255,0.012)_4px)]" />

            {/* Crosshair / scan area */}
            <div className={cn(
              "relative w-48 h-48 border-2 border-dashed rounded-md flex items-center justify-center transition-colors duration-500",
              isInspecting ? "border-primary animate-pulse" : "border-muted-foreground/30"
            )}>
              {/* Corner marks */}
              <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-sm" />
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-sm" />
              <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-sm" />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-sm" />

              {isInspecting ? (
                <ScanLine className="w-12 h-12 text-primary animate-pulse" />
              ) : (
                <Camera className="w-12 h-12 text-muted-foreground/30" />
              )}
            </div>

            {/* Camera HUD */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/80 rounded-md px-2 py-1">
              <CircleDot className={cn(
                "w-3 h-3",
                isInspecting ? "text-destructive animate-pulse" : "text-success"
              )} />
              <span className="text-[11px] font-mono text-foreground">
                {isInspecting ? "INSPECCIONANDO..." : "CAM-01 EN VIVO"}
              </span>
            </div>
            <div className="absolute top-3 right-3 bg-background/80 rounded-md px-2 py-1">
              <span className="text-[11px] font-mono text-muted-foreground">1920x1080 | 30 FPS</span>
            </div>
            <div className="absolute bottom-3 left-3 bg-background/80 rounded-md px-2 py-1">
              <span className="text-[11px] font-mono text-muted-foreground">Linea A1 - Estacion 1</span>
            </div>
            {inspectionCount > 0 && (
              <div className="absolute bottom-3 right-3 bg-background/80 rounded-md px-2 py-1">
                <span className="text-[11px] font-mono text-muted-foreground">
                  Inspecciones: {inspectionCount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Inspect Button - flush with left edge, camera and table */}
        <button
          onClick={runInspection}
          disabled={isInspecting}
          className={cn(
            "py-4 text-base font-bold uppercase tracking-widest transition-all",
            "-mt-4 -ml-4 md:-ml-6 lg:-mr-9",
            "w-[calc(100%+1rem)] md:w-[calc(100%+1.5rem)] lg:w-[calc(100%+1.5rem+2.25rem)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isInspecting
              ? "bg-destructive/50 text-destructive-foreground cursor-not-allowed opacity-70"
              : "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98] shadow-lg shadow-destructive/20"
          )}
        >
          {isInspecting ? "Inspeccionando..." : "Inspeccionar"}
        </button>

        {/* Result banner */}
        {lastResult && (
          <div className={cn(
            "rounded-lg border px-4 py-3 flex items-center gap-3 transition-all",
            lastResult === "aprobada"
              ? "border-success/30 bg-success/10"
              : "border-destructive/30 bg-destructive/10"
          )}>
            {lastResult === "aprobada" ? (
              <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive shrink-0" />
            )}
            <div>
              <p className={cn(
                "text-sm font-semibold",
                lastResult === "aprobada" ? "text-success" : "text-destructive"
              )}>
                Pieza {lastResult === "aprobada" ? "Aprobada" : "Rechazada"}
              </p>
              <p className="text-xs text-muted-foreground">
                {correctCount}/{pieceComponents.length} componentes correctos
                {incorrectCount > 0 && ` - ${incorrectCount} defecto${incorrectCount > 1 ? "s" : ""} encontrado${incorrectCount > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Components table - absolutely positioned, full height from header to bottom */}
      <div
        className="hidden lg:flex flex-col absolute -top-4 md:-top-6 -right-4 md:-right-6 -bottom-4 md:-bottom-6 left-[calc(50%+0.75rem)] overflow-hidden"
      >
        <div className="bg-card border border-border flex flex-col h-full">
          {/* Table header */}
          <div className="flex border-b border-border shrink-0">
            <div className="w-[15%] px-3 py-2 text-xs font-medium text-muted-foreground">ID</div>
            <div className="w-[45%] px-3 py-2 text-xs font-medium text-muted-foreground">Componente</div>
            <div className="w-[40%] px-3 py-2 text-xs font-medium text-muted-foreground text-center">Resultado</div>
          </div>
          {/* Table rows - flex to fill available space evenly */}
          <div className="flex-1 flex flex-col min-h-0">
            {components.map((comp) => (
              <div
                key={comp.id}
                className={cn(
                  "flex flex-1 items-center border-b border-border last:border-b-0 transition-colors duration-300 min-h-0",
                  comp.result === "correcto" && "bg-success/5",
                  comp.result === "incorrecto" && "bg-destructive/5"
                )}
              >
                <div className="w-[15%] px-3 font-mono text-xs text-muted-foreground">{comp.id}</div>
                <div className="w-[45%] px-3 text-xs font-medium text-card-foreground truncate">{comp.name}</div>
                <div className="w-[40%] px-3">
                  <div className="flex items-center justify-center">
                    {comp.result === "pendiente" && (
                      <Minus className="w-4 h-4 text-muted-foreground/40" />
                    )}
                    {comp.result === "correcto" && (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span className="text-[11px] text-success font-medium">Correcto</span>
                      </div>
                    )}
                    {comp.result === "incorrecto" && (
                      <div className="flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-destructive" />
                        <span className="text-[11px] text-destructive font-medium">Incorrecto</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
