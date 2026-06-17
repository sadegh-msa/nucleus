import type { RestApiService } from '../services/rest-api.service';

export interface RestServiceParams {
  service: RestApiService;
  endpoint: string;
  dateFields: string[];
}
