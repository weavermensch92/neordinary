import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = Array.from({ length: 20 }, (_, i) => ({
  name: i,
  value: 30 + Math.random() * 40,
  value2: 20 + Math.random() * 60
}));

export const NetworkGraph: React.FC = () => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <pattern id="pattern-stripe" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="2" height="4" transform="translate(0,0)" fill="#000" fillOpacity="0.1"></rect>
            </pattern>
          </defs>
          <XAxis dataKey="name" hide />
          <YAxis hide domain={[0, 100]} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#000" 
            strokeWidth={1.5} 
            fill="url(#pattern-stripe)" 
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const Histogram: React.FC = () => {
  return (
    <div className="h-full w-full flex items-end justify-between gap-[2px]">
       {data.slice(0, 12).map((d, i) => (
         <div 
           key={i} 
           className="bg-zinc-800 transition-all duration-300 ease-in-out hover:bg-red-600 w-full"
           style={{ height: `${d.value2}%`, opacity: 0.6 + (i/24) }}
         />
       ))}
    </div>
  );
};