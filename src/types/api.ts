export interface KlingAIResponse {
  code: number;
  message: string;
  request_id: string;
  data: {
    task_id: string;
    task_status: 'submitted' | 'processing' | 'succeed' | 'failed';
    task_status_msg?: string;
    created_at: number;
    updated_at: number;
    task_result?: {
      images: {
        index: number;
        url: string;
      }[];
    };
  };
}

export interface TaskCreateResponse {
  code: number;
  message: string;
  request_id: string;
  data: {
    task_id: string;
    task_status: string;
    created_at: number;
    updated_at: number;
  };
}