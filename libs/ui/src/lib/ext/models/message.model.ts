export interface MessageModel {
  variant: 'info' | 'danger' | 'warning' | 'success';
  content: string;
  title?: string;
  code?: number | string;
  duration?: number;
}
