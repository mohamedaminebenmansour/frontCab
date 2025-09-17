import { EWM_StorageBin } from "./ewm-storage-bin.model";
import { HandlingUnit } from "./handling-unit.model";

export interface StockMovement {
  idStockMovement?: number;
  movementType?: string;
  sourceBinCode?: string;
  destinationBinCode?: string;
  handlingUnitID?: number;
  movedQty?: number; // Added to match DTO
  movementDate?: string; // Added as string for date-time format
  executedBy?: string;
  status?: string;
  sourceBin?: EWM_StorageBin;
  destinationBin?: EWM_StorageBin;
  handlingUnit?: HandlingUnit;
}