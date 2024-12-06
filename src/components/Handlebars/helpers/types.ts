// types.ts
export type FieldType = 'date' | 'number' | 'string';

export interface GroupByOptions {
  field: string;
  type: FieldType;
  format?: string;
  fn: (context: any) => string;  // function for rendering block content
  hash: GroupByOptions;          // parameters passed to helper
}

export interface NumberFormatOptions {
  pattern?: string;                              
  minFraction?: number;                          
  maxFraction?: number;                          
  signPosition?: 'left' | 'right' | 'brackets' | 'none';  
  isPercent?: boolean;                           
  autoPercent?: boolean;                         
}