export interface EWM_StorageBinType {
  idLocationType?: number; // Optional for creation
  codeStorageBinType: string;
  lib_LocationType: string;
  storageBinType: string; // Changed to string to match backend
}

export enum StorageBinType {
  STANDARD = 'STANDARD',
  BULK = 'BULK',
  HIGH_RACK = 'HIGH_RACK',
  FLOOR = 'FLOOR',
  FIXED_BIN = 'FIXED_BIN',
  PICKING = 'PICKING'
}