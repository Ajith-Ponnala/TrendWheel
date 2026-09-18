import React from 'react';
import { cn } from '../../utils/cn';

export function LoadingSkeleton({ className, type = 'rect', ...props }) {
  const types = {
    rect: 'rounded-md',
    circle: 'rounded-full',
    text: 'rounded-md h-4 w-full',
  };

  return (
    <div 
      className={cn("animate-pulse bg-gray-200 dark:bg-gray-800", types[type], className)}
      {...props}
    />
  );
}

// Pre-built skeletons for common patterns
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <LoadingSkeleton className="w-full aspect-[3/4]" />
      <div className="space-y-2 mt-2">
        <LoadingSkeleton type="text" className="w-1/2 h-4" />
        <LoadingSkeleton type="text" className="w-3/4 h-3" />
        <div className="flex justify-between items-center mt-2">
          <LoadingSkeleton type="text" className="w-1/3 h-5" />
          <LoadingSkeleton type="circle" className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
