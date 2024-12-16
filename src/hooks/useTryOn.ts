import { useState, useEffect } from 'react';
import { tryOnService } from '../services/api/try-on.service';
import { logger } from '../utils/logger';

const POLLING_INTERVAL = 5000; // 5 seconds
const MAX_RETRIES = 60; // 5 minutes maximum polling time

export function useTryOn() {
  const [humanImage, setHumanImage] = useState<string | null>(null);
  const [clothImage, setClothImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (taskId) {
      interval = setInterval(async () => {
        try {
          if (retryCount >= MAX_RETRIES) {
            setError('Processing timeout. Please try again.');
            setLoading(false);
            setTaskId(null);
            return;
          }

          const response = await tryOnService.checkStatus(taskId);
          
          switch (response.data.task_status) {
            case 'succeed':
              if (response.data.task_result?.images[0]?.url) {
                setResultImage(response.data.task_result.images[0].url);
                setLoading(false);
                setTaskId(null);
              } else {
                throw new Error('No result image URL in response');
              }
              break;
            
            case 'failed':
              throw new Error(response.data.task_status_msg || 'Task processing failed');
            
            case 'processing':
            case 'submitted':
              setRetryCount(prev => prev + 1);
              break;
            
            default:
              throw new Error(`Unknown task status: ${response.data.task_status}`);
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          logger.error('Task status check failed', { error: errorMessage });
          setError(errorMessage);
          setLoading(false);
          setTaskId(null);
        }
      }, POLLING_INTERVAL);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [taskId, retryCount]);

  const handleTryOn = async () => {
    if (!humanImage || !clothImage) {
      setError('Please upload both a person image and a clothing image');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);
    setRetryCount(0);

    try {
      const response = await tryOnService.createTask(humanImage, clothImage);
      setTaskId(response.data.task_id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start try-on process';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return {
    humanImage,
    clothImage,
    loading,
    error,
    resultImage,
    setHumanImage,
    setClothImage,
    handleTryOn,
  };
}