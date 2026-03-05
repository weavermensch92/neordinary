import React from 'react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full bg-brand-bg overflow-hidden border-t border-brand-red/20 flex flex-col">
      {/* Top meta row */}
      <div className="flex items-center justify-between px-6 md:px-10 pt-10 pb-6 text-xs font-sans font-bold uppercase tracking-widest text-brand-red/50">
        <span>© 2026 NE(O)RDINARY</span>
        <div className="flex gap-8">
          <a href="#" className="hover:text-brand-red transition-colors">Instagram</a>
          <a href="#" className="hover:text-brand-red transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-brand-red transition-colors">Contact</a>
        </div>
        <span>Seoul × World</span>
      </div>

      {/* Giant Logo Text using SVG to strictly fill 100% width */}
      <div className="w-full overflow-hidden pointer-events-none mt-2 mb-2">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <svg
            className="w-full h-auto text-brand-red block"
            viewBox="0 0 1000 230"
          >
            <text
              x="50%"
              y="53%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-display font-black uppercase fill-current"
              style={{ fontSize: '240px' }}
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
            >
              NE(O)RDINARY
            </text>
          </svg>
        </motion.div>
      </div>

      {/* Bottom sub row */}
      <div className="flex items-center justify-between px-6 md:px-10 pt-4 pb-8 text-xs font-sans uppercase tracking-widest text-brand-red/30">
        <span>Powered by Softsquared Inc.</span>
        <span className="text-brand-red/20">Controlling AI is Neo-Ordinary</span>
        <span>Est. 2019</span>
      </div>
    </footer>
  );
};
