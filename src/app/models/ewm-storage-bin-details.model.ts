import { EWM_StorageBin } from "./ewm-storage-bin.model";

export interface EWM_StorageBin_Details {
  idLocation_Details?: number;
  ewm_CodeLocation: string;
  sequenceInLocation?: number;
  stockageDate?: string;
  status?: string;
  item?: string;
  serialNumber?: string;
  handlingUnit?: string;
  productionDate?: string;
  initialQty?: number;
  actualQty?: number;
  initialWeight?: number;
  actualWeight?: number;
  storageBin?: EWM_StorageBin; // Optional for nested data
}