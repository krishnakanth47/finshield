import React, { useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFinShield } from '../../context/FinShieldContext';
import { getTwinNodesAndEdges, TwinNodeData } from '../../services/dependencyEngine';
import { TwinCustomNode } from './TwinCustomNode';
import { Info, Sparkles, X, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

const nodeTypes = {
  twinNode: TwinCustomNode,
};

export const DependencyGraph: React.FC<{ height?: string }> = ({ height = '540px' }) => {
  const { dataset, scenario, simulationResult, isIntervened, setActiveTab } = useFinShield();
  const [selectedNode, setSelectedNode] = useState<TwinNodeData | null>(null);

  const { nodes, edges } = useMemo(() => {
    return getTwinNodesAndEdges(
      dataset,
      scenario || undefined,
      simulationResult.risks,
      isIntervened
    );
  }, [dataset, scenario, simulationResult, isIntervened]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as unknown as TwinNodeData);
  };

  return (
    <div className="relative bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-subtle">
      {/* Top Controls Strip */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-md max-w-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Business Dependency Twin
          </h4>
        </div>
        <p className="text-[11px] text-slate-500 mt-1">
          {scenario
            ? isIntervened
              ? 'Intervention applied: propagation pathways stabilized.'
              : `Active Shock Cascade: ${scenario.title} propagating downstream.`
            : 'Interactive financial dependency map under normal baseline operations.'}
        </p>
        <div className="mt-2 text-[10px] text-slate-400 font-medium">
          Click any node to inspect balance sheet links and exposure.
        </div>
      </div>

      {/* React Flow Canvas */}
      <div style={{ height }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#cbd5e1" gap={16} size={1} />
          <Controls className="!bg-white !border-slate-200 !shadow-sm !rounded-lg" />
          <MiniMap
            className="!bg-white !border-slate-200 !shadow-sm !rounded-lg"
            nodeColor={(n) => {
              const d = n.data as unknown as TwinNodeData;
              if (d?.status === 'HIGH RISK' || d?.status === 'CRITICAL') return '#f43f5e';
              if (d?.status === 'AT RISK' || d?.status === 'DELAYED') return '#f59e0b';
              return '#10b981';
            }}
          />
        </ReactFlow>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-20 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 animate-fade-in">
          <div className="flex items-start justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {selectedNode.category} NODE
              </span>
              <h3 className="text-sm font-bold text-slate-900">{selectedNode.label}</h3>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
              <span className="text-slate-500">{selectedNode.metricLabel}:</span>
              <span className="font-bold text-slate-900 font-mono">{selectedNode.metricValue}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Current Status:</span>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${selectedNode.statusColor}`}
              >
                {selectedNode.status}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 italic bg-sky-50/50 p-2 rounded-lg border border-sky-100">
              {selectedNode.tooltip}
            </p>

            {selectedNode.details && (
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Entity Linkages:
                </span>
                {Object.entries(selectedNode.details).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[11px]">
                    <span className="text-slate-500">{k}:</span>
                    <span className="font-semibold text-slate-800">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend Footer */}
      <div className="absolute bottom-3 left-4 z-10 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-4 text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Healthy Entity
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Delay / Early Stress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Downstream Risk
        </span>
      </div>
    </div>
  );
};
