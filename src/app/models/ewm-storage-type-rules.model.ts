import { EWM_StorageType } from "./ewm-storage-type.model";

export interface EWM_StorageType_Rules {
  idewm_Location_Rules?: number;
  ewm_Code_StorageType_From: string;
  allowTranferTO?: string;
  blockTranferTO?: string;
  storageType?: EWM_StorageType; // Optional for nested API responses
}