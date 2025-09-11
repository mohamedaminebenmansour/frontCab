export interface EWM_StorageBin_Groupe {
  idLocation_Groupe?: number; // Optional for creation
  codeLocationGroupe: string;
  lib_LocationGroupe: string;
  codeLocationGroupEnum: string; // Required, string-based enum (e.g., "RECEPTION")
}

export enum Code_LocationGroup {
  RECEPTION = 'RECEPTION',
  PRODUCTION = 'PRODUCTION',
  SHIPPING = 'SHIPPING',
  QUALITY_CONTROL = 'QUALITY_CONTROL',
  RETURN = 'RETURN',
  TEMPORARY = 'TEMPORARY'
}