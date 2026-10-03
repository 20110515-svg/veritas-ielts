import React, { useState, useRef, useCallback } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizableSplitPaneProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  initialLeftWidthPercent?: number;
  minLeftPercent?: number;
  maxLeftPercent?: number;
}

export const ResizableSplitPane: React.FC<ResizableSplitPaneProps> = ({
  leftContent,
  rightContent,
  initialLeftWidthPercent = 50,
  minLeftPercent = 25,
  maxLeftPercent = 75,
}) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidthPercent);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const newPercent = (currentX / rect.width) * 100;

      if (newPercent >= minLeftPercent && newPercent <= maxLeftPercent) {
        setLeftWidth(newPercent);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row h-full w-full overflow-hidden select-text">
      
      {/* Left Pane (Scrollable content) */}
      <div
        style={{ width: `${leftWidth}%` }}
        className="h-full overflow-y-auto w-full lg:w-auto p-4 sm:p-6 bg-slate-900/60 border-b lg:border-b-0 lg:border-r border-slate-800"
      >
        {leftContent}
      </div>

      {/* Resizer Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="hidden lg:flex items-center justify-center w-2.5 hover:w-3.5 bg-slate-800 hover:bg-amber-400/80 cursor-col-resize transition-all shrink-0 group z-10"
        title="Перетащите для изменения ширины колонок"
      >
        <GripVertical className="h-4 w-4 text-slate-500 group-hover:text-slate-950 transition-colors" />
      </div>

      {/* Right Pane (Questions / Answers / Editor) */}
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="h-full overflow-y-auto w-full lg:w-auto p-4 sm:p-6 bg-slate-950/70"
      >
        {rightContent}
      </div>

    </div>
  );
};
