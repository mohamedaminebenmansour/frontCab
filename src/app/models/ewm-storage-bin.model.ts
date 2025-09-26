import { EWM_Parck_DisplayGroupe } from "./ewm-parck-display-groupe.model";
import { EWM_StorageBin_Groupe } from "./ewm-storage-bin-groupe.model";
import { EWM_StorageBinType } from "./ewm-storage-bin-type.model";
import { EWM_StorageType } from "./ewm-storage-type.model";
import { HandlingUnit } from "./handling-unit.model";

export interface EWM_StorageBin {
  idewm_Location?: number;
  ewm_Lib_CodeLocation: string;
  codeLocationGroupe?: string;
  ewm_Code_StorageType: string;
  codeStorageBinType?: string;
  codeEwm_DisplayParckGroupe?: string;
  code_FIFO_Groupe?: string;
  item?: string;
  bulding?: string;
  atorizedStatus?: string;
  capacity?: number;
  qualityValidationMadatoryToAssign?: boolean;
  staticLocation?: boolean;
  dynamicLocation?: boolean;
  exacticLocation?: boolean; // Typo in JSON ('Exactic'), assuming 'Exact'
  idewm_Parck_DisplayGroupe?: number; // Added for FK
  storageType?: EWM_StorageType; // Optional for nested data
  binType?: EWM_StorageBinType;
  binGroup?: EWM_StorageBin_Groupe;
  parckDisplayGroup?: EWM_Parck_DisplayGroupe;
  handlingUnits?: HandlingUnit[]; // Added for nested HUs
}