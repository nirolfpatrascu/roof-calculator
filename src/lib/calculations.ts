import { RoofType, RoofDimensions } from "./types";

export function calculateRoofArea(
  roofType: RoofType,
  dimensions: RoofDimensions
): number {
  const { b, c, d } = dimensions;

  if (roofType === "1_slope") {
    return Number((b * c).toFixed(2));
  }

  // 2 slopes
  return Number((b * c + b * (d ?? 0)).toFixed(2));
}

export function calculateSheets(
  totalArea: number,
  sheetHeight: number,
  sheetWidth: number,
  wastePercentage: number
): number {
  const sheetArea = sheetHeight * sheetWidth;
  const areaWithWaste = totalArea * (1 + wastePercentage / 100);
  return Math.ceil(areaWithWaste / sheetArea);
}

export function calculateTotalPrice(
  totalArea: number,
  pricePerSqm: number,
  wastePercentage: number
): number {
  const areaWithWaste = totalArea * (1 + wastePercentage / 100);
  return Number((areaWithWaste * pricePerSqm).toFixed(2));
}
