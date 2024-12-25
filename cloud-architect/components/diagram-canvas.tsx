"use client"

import { useCallback, useRef, useState, useEffect } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
  useReactFlow,
  Panel,
} from 'reactflow'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'
import 'reactflow/dist/style.css'

import { ServiceNode } from './service-node'
import { Toolbar } from './toolbar'
import { cn } from '@/lib/utils'

const nodeTypes = {
  service: ServiceNode,
}

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

let id = 0;
const getId = () => `dndnode_${id++}`;

function DiagramCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeDelete = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  }, [setNodes]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const serviceData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type: serviceData.type,
        position,
        data: { 
          label: serviceData.service.name, 
          icon: serviceData.service.icon,
          onDelete: onNodeDelete
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, screenToFlowPosition, onNodeDelete]
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        setNodes((nds) => nds.filter((node) => !node.selected));
      }
    },
    [setNodes]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem('cloudArchitectFlow', JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem('cloudArchitectFlow') || '{}');

      if (flow.nodes && flow.edges) {
        setNodes(flow.nodes.map((node: Node) => ({
          ...node,
          data: {
            ...node.data,
            onDelete: onNodeDelete
          }
        })));
        setEdges(flow.edges || []);
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, onNodeDelete]);

  const onExportImage = useCallback(() => {
    if (reactFlowWrapper.current === null) {
      return;
    }

    const nodesBounds = reactFlowInstance?.getNodes().reduce((bounds, node) => {
      if (!bounds) {
        return { x: node.position.x, y: node.position.y, width: node.width || 0, height: node.height || 0 };
      }
      bounds.x = Math.min(bounds.x, node.position.x);
      bounds.y = Math.min(bounds.y, node.position.y);
      bounds.width = Math.max(bounds.width, node.position.x + (node.width || 0) - bounds.x);
      bounds.height = Math.max(bounds.height, node.position.y + (node.height || 0) - bounds.y);
      return bounds;
    }, null as { x: number; y: number; width: number; height: number } | null);

    if (!nodesBounds) {
      console.error('No nodes found');
      return;
    }

    const padding = 20;
    const exportWidth = nodesBounds.width + padding * 2;
    const exportHeight = nodesBounds.height + padding * 2;

    toPng(reactFlowWrapper.current, {
      backgroundColor: 'rgba(0,0,0,0)',
      width: exportWidth,
      height: exportHeight,
      style: {
        width: exportWidth + 'px',
        height: exportHeight + 'px',
        transform: `translate(${-nodesBounds.x + padding}px, ${-nodesBounds.y + padding}px)`,
      },
      filter: (node) => {
        return (
          !node.classList.contains('react-flow__background') &&
          !node.classList.contains('react-flow__minimap') &&
          !node.classList.contains('react-flow__controls') &&
          !node.classList.contains('react-flow__panel')
        );
      },
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'cloud-architecture.png';
      link.href = dataUrl;
      link.click();
    });
  }, [reactFlowInstance]);

  const onExportPDF = useCallback(() => {
    if (reactFlowWrapper.current === null || !reactFlowInstance) {
      console.error('ReactFlow wrapper or instance is null');
      return;
    }

    const nodesBounds = reactFlowInstance.getNodes().reduce((bounds, node) => {
      if (!bounds) {
        return { x: node.position.x, y: node.position.y, width: node.width || 0, height: node.height || 0 };
      }
      bounds.x = Math.min(bounds.x, node.position.x);
      bounds.y = Math.min(bounds.y, node.position.y);
      bounds.width = Math.max(bounds.width, node.position.x + (node.width || 0) - bounds.x);
      bounds.height = Math.max(bounds.height, node.position.y + (node.height || 0) - bounds.y);
      return bounds;
    }, null as { x: number; y: number; width: number; height: number } | null);

    if (!nodesBounds) {
      console.error('No nodes found');
      return;
    }

    console.log('Node bounds:', nodesBounds);

    const padding = 20;
    const exportWidth = nodesBounds.width + padding * 2;
    const exportHeight = nodesBounds.height + padding * 2;

    console.log('Export dimensions:', { width: exportWidth, height: exportHeight });

    toPng(reactFlowWrapper.current, {
      backgroundColor: 'rgba(0,0,0,0)',
      width: exportWidth,
      height: exportHeight,
      style: {
        width: `${exportWidth}px`,
        height: `${exportHeight}px`,
        transform: `translate(${-nodesBounds.x + padding}px, ${-nodesBounds.y + padding}px)`,
      },
      filter: (node) => {
        return (
          !node.classList.contains('react-flow__background') &&
          !node.classList.contains('react-flow__minimap') &&
          !node.classList.contains('react-flow__controls') &&
          !node.classList.contains('react-flow__panel')
        );
      },
    }).then((dataUrl) => {
      console.log('PNG generated successfully');
      const pdf = new jsPDF({
        orientation: exportWidth > exportHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [exportWidth, exportHeight],
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, exportWidth, exportHeight);
      pdf.save('cloud-architecture.pdf');
      console.log('PDF saved successfully');
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    });
  }, [reactFlowInstance]);

  return (
    <div className="h-screen w-full bg-background dark:bg-gray-900" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        className={cn(
          "bg-background dark:bg-gray-900 [--background:theme(colors.background)] [--foreground:theme(colors.foreground)]",
          "[--edge:theme(colors.foreground/40)] [--connection:theme(colors.foreground/30)]",
          "[--selection:rgba(59,130,246,0.2)]"
        )}
      >
        <Panel position="top-left">
          <Toolbar onSave={onSave} onRestore={onRestore} onExportImage={onExportImage} onExportPDF={onExportPDF} />
        </Panel>
        <Background gap={12} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}

export default DiagramCanvas;

