import { EWM_StorageBin } from "./ewm-storage-bin.model";
import { HandlingUnit } from "./handling-unit.model";

export interface StockMovement {
  idStockMovement?: number;
  movementType?: string;
  sourceBinCode?: string;
  destinationBinCode?: string;
  handlingUnitID?: number;
  executedBy?: string;
  status?: string;
  sourceBin?: EWM_StorageBin; // Optional for nested data
  destinationBin?: EWM_StorageBin;
  handlingUnit?: HandlingUnit;
}