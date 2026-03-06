import React from 'react';
import { X, Save, RotateCcw } from 'lucide-react';

export interface GenLayoutConfig {
  nodeX: number;
  nodeY: number;
  labelX: number;
  labelY: number;
  width: number;
  height: number;
}

export interface WorldConfig {
  width: number;
  height: number;
}

export type LayoutConfig = Record<string, GenLayoutConfig>;

interface DebugControllerProps {
  config: LayoutConfig;
  worldConfig: WorldConfig;
  onUpdate: (newConfig: LayoutConfig) => void;
  onWorldUpdate: (newWorldConfig: WorldConfig) => void;
  onClose: () => void;
}

const DebugController: React.FC<DebugControllerProps> = ({ config, worldConfig, onUpdate, onWorldUpdate, onClose }) => {
  const handleChange = (gen: string, field: keyof GenLayoutConfig, value: number) => {
    onUpdate({
      ...config,
      [gen]: {
        ...config[gen],
        [field]: value
      }
    });
  };

  const handleWorldChange = (field: keyof WorldConfig, value: number) => {
    onWorldUpdate({
      ...worldConfig,
      [field]: value
    });
  };

  return (
    <div className="fixed top-20 right-8 z-[200] bg-zinc-900/95 text-white p-4 rounded-lg shadow-2xl border border-red-500/50 w-80 max-h-[80vh] overflow-y-auto backdrop-blur-md font-mono text-xs">
      <div className="flex justify-between items-center mb-4 border-b border-zinc-700 pb-2">
        <h3 className="font-bold text-red-500 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>
          DEBUG_CONTROLLER
        </h3>
        <button onClick={onClose} className="hover:text-red-400 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-6">
        {/* World Config Section */}
        <div className="space-y-2 border-b border-zinc-800 pb-4">
          <div className="font-bold text-zinc-400 uppercase tracking-wider mb-2">SECTOR BOUNDARY</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500">WIDTH</label>
              <input 
                type="number" 
                value={worldConfig.width} 
                onChange={(e) => handleWorldChange('width', Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-zinc-300 focus:border-red-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500">HEIGHT</label>
              <input 
                type="number" 
                value={worldConfig.height} 
                onChange={(e) => handleWorldChange('height', Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-zinc-300 focus:border-red-500 outline-none"
              />
            </div>
          </div>
        </div>

        {Object.entries(config).map(([genKey, settings]) => (
          <div key={genKey} className="space-y-2 border-b border-zinc-800 pb-4 last:border-0">
            <div className="font-bold text-zinc-400 uppercase tracking-wider mb-2">{genKey} CONFIG</div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500">NODE X</label>
                <input 
                  type="number" 
                  value={settings.nodeX} 
                  onChange={(e) => handleChange(genKey, 'nodeX', Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-zinc-300 focus:border-red-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500">NODE Y</label>
                <input 
                  type="number" 
                  value={settings.nodeY} 
                  onChange={(e) => handleChange(genKey, 'nodeY', Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-zinc-300 focus:border-red-500 outline-none"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500">LABEL X</label>
                <input 
                  type="number" 
                  value={settings.labelX} 
                  onChange={(e) => handleChange(genKey, 'labelX', Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-zinc-300 focus:border-red-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500">LABEL Y</label>
                <input 
                  type="number" 
                  value={settings.labelY} 
                  onChange={(e) => handleChange(genKey, 'labelY', Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-zinc-300 focus:border-red-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500">WIDTH</label>
                <input 
                  type="number" 
                  value={settings.width} 
                  onChange={(e) => handleChange(genKey, 'width', Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-zinc-300 focus:border-red-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500">HEIGHT</label>
                <input 
                  type="number" 
                  value={settings.height} 
                  onChange={(e) => handleChange(genKey, 'height', Number(e.target.value))}
                  className="w-full bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-zinc-300 focus:border-red-500 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-zinc-700 text-[10px] text-zinc-500 text-center">
        Changes apply in real-time
      </div>
    </div>
  );
};

export default DebugController;
