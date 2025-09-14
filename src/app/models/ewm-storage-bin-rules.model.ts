import { EWM_StorageBin } from "./ewm-storage-bin.model";

export interface EWM_StorageBin_Rules {
  idemw_Location_Rules?: number;
  ewm_CodeLocation_FROM: string;
  allowTranferTO?: string;
  blockTranferTO?: string;
  storageBin?: EWM_StorageBin; // Optional for nested data
}

export interface StorageTypeRulesDto {
  id?: number;
  EWM_Code_StorageType_From: string;
  allowTranferTO?: string;
  blockTranferTO?: string;
}