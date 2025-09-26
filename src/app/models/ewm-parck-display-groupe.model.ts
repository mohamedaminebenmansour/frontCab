import { EWM_StorageBin } from "./ewm-storage-bin.model"; // Adjust path if needed

export interface EWM_Parck_DisplayGroupe {
  id?: number;
  code: string;
  libelle: string;
  description?: string;
  storageBins?: EWM_StorageBin[]; // Added for detail view
}