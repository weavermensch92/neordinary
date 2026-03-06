import React, { useEffect, useRef, useState } from 'react';
import { LogEntry } from './types';

const MOCK_LOGS = [
  "INIT_SEQUENCE_START",
  "LOADING_CORE_MODULES...",
  "NET_INTERFACE_UP: ETH0",
  "HANDSHAKE_ESTABLISHED [SECURE]",
  "BUFFER_ALLOCATION: 4096KB",
  "WARNING: PRESSURE_VALVE_7 OPEN",
  "CHECKING_INTEGRITY...",
  "INTEGRITY_OK (HASH: 0x882A)",
  "DAEMON_V3 RESTARTED",
  "USER_AUTH: ADMIN_LEVEL_1",
  "SYNCING_DATABANKS...",
  "PACKET_LOSS DETECTED: 0.04%",
  "RENDERING_VIEWPORT",
  "SYSTEM_READY"
];

const LogStream: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial fill
    const initial = MOCK_LOGS.slice(0, 5).map((msg, i) => ({
      id: Math.random().toString(36),
      timestamp: new Date().toLocaleTimeString(),
      level: msg.includes("WARNING") ? 'WARN' : 'INFO' as any,
      message: msg,
      code: `0x${Math.floor(Math.random() * 1000).toString(16).toUpperCase()}`
    }));
    setLogs(initial);

    const interval = setInterval(() => {
      const randomMsg = MOCK_LOGS[Math.floor(Math.random() * MOCK_LOGS.length)];
      const newLog: LogEntry = {
        id: Math.random().toString(36),
        timestamp: new Date().toLocaleTimeString(),
        level: randomMsg.includes("WARNING") ? 'WARN' : 'INFO',
        message: randomMsg,
        code: `0x${Math.floor(Math.random() * 1000).toString(16).toUpperCase()}`
      };

      setLogs(prev => {
        const next = [...prev, newLog];
        if (next.length > 20) next.shift();
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col font-mono text-[10px] leading-relaxed relative bg-zinc-50">
      {/* Gradient matches bg-zinc-50 */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-zinc-50/90 z-10" />

      <div ref={scrollRef} className="overflow-y-auto h-full pr-2 space-y-1 pb-6 p-2">
        {logs.map((log) => (
          <div key={log.id} className="grid grid-cols-[auto_1fr] gap-2 hover:bg-zinc-100 p-0.5 transition-colors">
            <span className="opacity-40 select-none text-zinc-500">[{log.timestamp}]</span>
            <div className="flex gap-2">
              <span className={`${log.level === 'WARN' ? 'text-red-600 font-bold' : 'text-zinc-700'}`}>
                {log.level}
              </span>
              <span className="text-zinc-800">{log.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogStream;