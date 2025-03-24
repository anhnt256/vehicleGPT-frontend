export interface GraphQLError {
  message: string;
  extensions?: {
    code: string;
    statusCode: number;
    details?: string[];
    path?: string[];
  };
}

export interface GraphQLResponse<T> {
  data?: { [key: string]: T };
  errors?: GraphQLError[];
}
