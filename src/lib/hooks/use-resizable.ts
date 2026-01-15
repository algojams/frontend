'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type ResizeDirection = 'left' | 'right' | 'top' | 'bottom';

interface UseResizableOptions {
  initialSize: number;
  onResize: (size: number) => void;
  direction: ResizeDirection;
}

// handles drag-to-resize functionality for panels (horizontal or vertical)
export function useResizable({ initialSize, onResize, direction }: UseResizableOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef(0);
  const startSizeRef = useRef(initialSize);

  const isVertical = direction === 'top' || direction === 'bottom';

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      startPosRef.current = isVertical ? e.clientY : e.clientX;
      startSizeRef.current = initialSize;
    },
    [initialSize, isVertical]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = isVertical ? e.clientY : e.clientX;

      // calculate delta based on drag direction
      let delta: number;
      switch (direction) {
        case 'left':
          delta = startPosRef.current - currentPos;
          break;
        case 'right':
          delta = currentPos - startPosRef.current;
          break;
        case 'top':
          delta = startPosRef.current - currentPos;
          break;
        case 'bottom':
          delta = currentPos - startPosRef.current;
          break;
      }

      const newSize = startSizeRef.current + delta;
      onResize(newSize);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // capture mouse events on document for smooth dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // prevent text selection while dragging
    document.body.style.userSelect = 'none';
    document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, direction, isVertical, onResize]);

  return {
    isDragging,
    handleMouseDown,
  };
}
