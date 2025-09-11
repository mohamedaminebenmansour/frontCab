import { EWM_Aturized_Status } from "./ewm-aturized-status.model";

export interface EWM_StorageType {
  id?: number; // Matches "id" in Swagger
  code: string; // Matches "code"
  lib: string; // Matches "lib"
  codeAuthorizedStatus?: string; // Matches "codeAuthorizedStatus"
  idewmAturizedStatus?: number; // Matches "idewm_Aturized_Status"
  validateByQuality?: boolean;
  withCheckAuthorizedStatus?: boolean;
  noInputRewinding?: boolean;
  isIncomplete?: boolean;
  aturizedStatus?: EWM_Aturized_Status; // Optional for nested API responses
}

