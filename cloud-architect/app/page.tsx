import { ServicesSidebar } from '@/components/services-sidebar'
import DiagramCanvas from '@/components/diagram-canvas'
import { ReactFlowProvider } from 'reactflow'

export default function Page() {
  return (
    <div className="flex h-screen">
      <ServicesSidebar />
      <ReactFlowProvider>
        <DiagramCanvas />
      </ReactFlowProvider>
    </div>
  )
}

