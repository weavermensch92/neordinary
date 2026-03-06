import React, { useState } from 'react';
import { Database, X, Check, AlertTriangle, Code, Server, Activity, FileJson } from 'lucide-react';

interface GenStatusInfo {
  status: string;
  count: number;
  error?: string;
}

interface NotionDebugWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'FALLBACK_MODE' | 'ERROR';
  dbId: string;
  dataCount: number;
  data: any[];
  genStatuses?: { [key: string]: GenStatusInfo };
}

const NotionDebugWidget: React.FC<NotionDebugWidgetProps> = ({
  isOpen,
  onClose,
  status,
  dbId,
  dataCount,
  data,
  genStatuses = {}
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'json'>('overview');

  if (!isOpen) return null;

  // Derive keys from first item if exists
  const detectedKeys = data.length > 0 && data[0].properties 
    ? Object.keys(data[0].properties) 
    : [];

  const getStatusColor = () => {
    switch (status) {
      case 'CONNECTED': return 'text-green-500';
      case 'FALLBACK_MODE': return 'text-orange-500';
      case 'ERROR': return 'text-red-600';
      default: return 'text-zinc-500';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'CONNECTED': return 'bg-green-500';
      case 'FALLBACK_MODE': return 'bg-orange-500';
      case 'ERROR': return 'bg-red-600';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-900/20 backdrop-blur-[1px] pointer-events-auto" 
        onClick={onClose}
      />
      
      {/* Widget Panel */}
      <div className="pointer-events-auto w-full max-w-md h-full bg-zinc-900 border-l border-zinc-700 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out translate-x-0 font-mono text-zinc-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <Database size={16} className={getStatusColor()} />
            <span className="font-bold text-sm tracking-widest text-white">DB_CONNECTOR_STATUS</span>
          </div>
          <button onClick={onClose} className="hover:bg-zinc-800 p-1 rounded text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex text-xs border-b border-zinc-800">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 p-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-red-600 bg-zinc-800/50 text-white' : 'border-transparent hover:bg-zinc-800 text-zinc-500'}`}
          >
            <Activity size={12} /> OVERVIEW
          </button>
          <button 
            onClick={() => setActiveTab('json')}
            className={`flex-1 p-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'json' ? 'border-red-600 bg-zinc-800/50 text-white' : 'border-transparent hover:bg-zinc-800 text-zinc-500'}`}
          >
            <Code size={12} /> RAW_PAYLOAD
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-zinc-900 relative">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />

          {activeTab === 'overview' ? (
            <div className="space-y-6 relative z-10">
              
              {/* Status Box */}
              <div className={`border p-4 ${status === 'CONNECTED' ? 'border-green-900 bg-green-900/10' : status === 'FALLBACK_MODE' ? 'border-orange-900 bg-orange-900/10' : 'border-zinc-800'}`}>
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase">System State</span>
                    <div className={`text-xs font-bold px-2 py-0.5 rounded-sm text-black ${getStatusBg()}`}>
                       {status}
                    </div>
                 </div>
                 <div className="text-[10px] text-zinc-400 leading-relaxed">
                    {status === 'CONNECTED' && "All generations synced successfully."}
                    {status === 'FALLBACK_MODE' && (
                        <span className="text-orange-300">
                           <strong className="text-orange-400">PARTIAL/FULL OUTAGE:</strong> Some databases failed to connect.<br/>
                           Check permissions below.
                        </span>
                    )}
                 </div>
              </div>

              {/* Generation Status Grid */}
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-zinc-800 pb-1">
                    <Server size={12} className="text-red-500" /> SECTOR_STATUS
                 </div>
                 <div className="grid grid-cols-1 gap-2">
                    {Object.entries(genStatuses).map(([genKey, rawStatusInfo]) => {
                        const statusInfo = rawStatusInfo as GenStatusInfo;
                        const isOk = statusInfo.status === 'CONNECTED';
                        const is404 = statusInfo.error?.includes('404');
                        return (
                           <div key={genKey} className={`flex items-center justify-between p-2 border ${isOk ? 'border-zinc-800 bg-zinc-950' : 'border-red-900 bg-red-950/30'}`}>
                               <div className="flex items-center gap-2">
                                   <div className={`w-1.5 h-1.5 rounded-full ${isOk ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                                   <span className="text-xs font-bold text-zinc-300 uppercase">{genKey}</span>
                               </div>
                               <div className="text-right">
                                   <div className={`text-[10px] font-bold ${isOk ? 'text-green-600' : 'text-red-500'}`}>
                                       {statusInfo.status} ({statusInfo.count})
                                   </div>
                                   {!isOk && is404 && (
                                       <div className="text-[8px] text-red-400">Error 404: Bot not invited?</div>
                                   )}
                                   {!isOk && !is404 && (
                                       <div className="text-[8px] text-red-400">{statusInfo.error}</div>
                                   )}
                               </div>
                           </div>
                        );
                    })}
                 </div>
              </div>

              {/* Schema Detection */}
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-zinc-800 pb-1">
                    <FileJson size={12} className="text-blue-500" /> SCHEMA_KEYS (GEN 5/Ref)
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {detectedKeys.map(key => (
                       <span key={key} className="px-2 py-1 bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 rounded-sm">
                          {key}
                       </span>
                    ))}
                    {detectedKeys.length === 0 && <span className="text-[10px] text-zinc-600">NO_DATA_AVAILABLE</span>}
                 </div>
              </div>

            </div>
          ) : (
            <div className="relative h-full">
               <div className="absolute top-0 left-0 w-full h-full text-[10px] text-zinc-400 whitespace-pre-wrap break-all leading-relaxed overflow-y-auto">
                  {JSON.stringify(data[0] || { error: "No Data" }, null, 2)}
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 text-[10px] text-zinc-600 flex justify-between">
           <span>UMC_SYSTEM_MONITOR_V2.0</span>
           <span>SECURE_LEVEL_1</span>
        </div>
      </div>
    </div>
  );
};

export default NotionDebugWidget;