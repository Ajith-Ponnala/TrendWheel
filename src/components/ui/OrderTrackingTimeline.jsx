import React from 'react';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';

export function OrderTrackingTimeline({ tracking, status }) {
  if (!tracking) return null;

  const validFlow = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'OutForDelivery', 'Delivered'];
  
  // If cancelled, show the flow up to cancellation, then cancelled state
  const isCancelled = status === 'Cancelled' || tracking.Cancelled?.completed;
  
  const getStageStatus = (stage, index) => {
    if (isCancelled && stage === 'Cancelled') return 'cancelled';
    if (isCancelled && index > validFlow.findIndex(s => tracking[s]?.completed === false) && index > 0) return 'inactive'; // simplify logic for cancel
    
    if (tracking[stage]?.completed) return 'completed';
    
    // The current stage is the first one that is NOT completed
    const firstIncompleteIndex = validFlow.findIndex(s => !tracking[s]?.completed);
    if (index === firstIncompleteIndex && !isCancelled) return 'current';
    
    return 'inactive';
  };

  const stagesToRender = isCancelled 
    ? [...validFlow.filter(s => tracking[s]?.completed), 'Cancelled'] 
    : validFlow;

  return (
    <div className="py-6 overflow-x-auto">
      <div className="flex items-start min-w-[600px] px-2">
        {stagesToRender.map((stage, index) => {
          const stageStatus = getStageStatus(stage, index);
          const isLast = index === stagesToRender.length - 1;
          
          return (
            <div key={stage} className="flex-1 relative">
              {/* Connecting Line */}
              {!isLast && (
                <div 
                  className={`absolute top-4 left-1/2 w-full h-1 -translate-y-1/2 ${
                    stageStatus === 'completed' ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
              
              {/* Dot & Label */}
              <div className="relative flex flex-col items-center z-10 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 transition-colors ${
                  stageStatus === 'completed' ? 'text-primary-600' :
                  stageStatus === 'current' ? 'text-primary-600 border-2 border-primary-600 shadow-[0_0_0_4px_var(--color-primary-100)] dark:shadow-[0_0_0_4px_var(--color-primary-900)]' :
                  stageStatus === 'cancelled' ? 'text-red-500' :
                  'text-gray-300 dark:text-gray-600'
                }`}>
                  {stageStatus === 'completed' ? <CheckCircle2 className="w-8 h-8 bg-white dark:bg-gray-900 rounded-full" /> :
                   stageStatus === 'cancelled' ? <XCircle className="w-8 h-8 bg-white dark:bg-gray-900 rounded-full" /> :
                   stageStatus === 'current' ? <div className="w-3 h-3 bg-primary-600 rounded-full" /> :
                   <Circle className="w-6 h-6" />}
                </div>
                
                <div className="mt-3 text-center">
                  <p className={`text-xs font-semibold uppercase tracking-wider ${
                    stageStatus === 'completed' || stageStatus === 'current' ? 'text-gray-900 dark:text-white' : 
                    stageStatus === 'cancelled' ? 'text-red-500' :
                    'text-gray-400'
                  }`}>
                    {stage === 'OutForDelivery' ? 'Out For Delivery' : stage}
                  </p>
                  
                  {tracking[stage]?.timestamp && (
                    <p className="text-[10px] text-gray-500 mt-1 whitespace-nowrap">
                      {new Date(tracking[stage].timestamp).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
