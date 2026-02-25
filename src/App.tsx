import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { InspeccionSection } from "@/components/inspeccion-section"
import { AnalyticsSection } from "@/components/analytics-section"
import { TraceabilitySection } from "@/components/traceability-section"

function App() {
  const [activeSection, setActiveSection] = useState("inspeccion")

  return (
    <AppShell activeSection={activeSection} onNavigate={setActiveSection}>
      {activeSection === "inspeccion" && <InspeccionSection />}
      {activeSection === "graficas" && <AnalyticsSection />}
      {activeSection === "trazabilidad" && <TraceabilitySection />}
    </AppShell>
  )
}

export default App
