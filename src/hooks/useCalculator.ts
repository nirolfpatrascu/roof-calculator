import { useReducer } from "react";
import { CalculatorState, RoofType, RoofDimensions } from "@/lib/types";
import { calculateRoofArea } from "@/lib/calculations";

type Action =
  | { type: "SET_ROOF_TYPE"; payload: RoofType }
  | { type: "SET_DIMENSIONS"; payload: Partial<RoofDimensions> }
  | { type: "SET_MANUFACTURER"; payload: string | null }
  | { type: "SET_MATERIAL_TYPE"; payload: string | null }
  | { type: "SET_MODEL"; payload: string | null }
  | { type: "SET_FINISH"; payload: string | null }
  | { type: "SET_PRODUCT"; payload: string | null }
  | { type: "SET_WASTE_PERCENTAGE"; payload: number }
  | { type: "SET_STEP"; payload: number }
  | { type: "RESET" };

const initialState: CalculatorState = {
  step: 1,
  roofType: null,
  dimensions: { a: 0, b: 0, c: 0 },
  totalArea: 0,
  manufacturerId: null,
  materialTypeId: null,
  modelId: null,
  finishId: null,
  productId: null,
  wastePercentage: 10,
};

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case "SET_ROOF_TYPE":
      return {
        ...state,
        roofType: action.payload,
        dimensions: { a: 0, b: 0, c: 0 },
        totalArea: 0,
        step: 2,
      };

    case "SET_DIMENSIONS": {
      const newDimensions = { ...state.dimensions, ...action.payload };
      const area =
        state.roofType && newDimensions.b > 0 && newDimensions.c > 0
          ? calculateRoofArea(state.roofType, newDimensions)
          : 0;
      return {
        ...state,
        dimensions: newDimensions,
        totalArea: area,
      };
    }

    case "SET_MANUFACTURER":
      return {
        ...state,
        manufacturerId: action.payload,
        materialTypeId: null,
        modelId: null,
        finishId: null,
        productId: null,
      };

    case "SET_MATERIAL_TYPE":
      return {
        ...state,
        materialTypeId: action.payload,
        modelId: null,
        finishId: null,
        productId: null,
      };

    case "SET_MODEL":
      return {
        ...state,
        modelId: action.payload,
        finishId: null,
        productId: null,
      };

    case "SET_FINISH":
      return {
        ...state,
        finishId: action.payload,
        productId: null,
      };

    case "SET_PRODUCT":
      return { ...state, productId: action.payload };

    case "SET_WASTE_PERCENTAGE":
      return { ...state, wastePercentage: action.payload };

    case "SET_STEP":
      return { ...state, step: action.payload };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}
