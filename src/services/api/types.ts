export interface ApiResponse<T = any> {
  code: number;
  message: string;
  request_id: string;
  data: T;
}

export interface TaskResult {
  task_id: string;
  task_status: 'submitted' | 'processing' | 'succeed' | 'failed';
  task_status_msg?: string;
  created_at: number;
  updated_at: number;
  task_result?: {
    images: Array<{
      index: number;
      url: string;
    }>;
  };
}