"use client";

import { useCalculator } from "@/hooks/useCalculator";
import RoofTypeSelector from "@/components/calculator/RoofTypeSelector";
import DimensionInput from "@/components/calculator/DimensionInput";
import MaterialSelector from "@/components/calculator/MaterialSelector";
import OfferSummary from "@/components/calculator/OfferSummary";

interface SectionProps {
  number: number;
  title: string;
  enabled: boolean;
  children: React.ReactNode;
}

function Section({ number, title, enabled, children }: SectionProps) {
  return (
    <section
      className={`rounded-2xl border-2 p-6 transition-all ${
        enabled
          ? "border-gray-200 bg-white"
          : "border-gray-100 bg-gray-50 opacity-50 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            enabled ? "bg-blue-500 text-white" : "bg-gray-300 text-white"
          }`}
        >
          {number}
        </span>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const { state, dispatch } = useCalculator();

  const hasRoofType = state.roofType !== null;
  const hasArea = state.totalArea > 0;
  const hasProduct = state.productId !== null;

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Calculator Acoperiș</h1>
          <p className="text-sm text-gray-500">Calculează materialele necesare pentru acoperișul tău</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 print:p-0 print:space-y-0">
        {/* Section 1: Roof Type */}
        <Section number={1} title="Tip acoperiș" enabled={true}>
          <RoofTypeSelector
            selected={state.roofType}
            onSelect={(type) => dispatch({ type: "SET_ROOF_TYPE", payload: type })}
          />
        </Section>

        {/* Section 2: Dimensions */}
        {hasRoofType && (
          <Section number={2} title="Dimensiuni" enabled={true}>
            <DimensionInput
              roofType={state.roofType!}
              dimensions={state.dimensions}
              totalArea={state.totalArea}
              onChange={(dims) => dispatch({ type: "SET_DIMENSIONS", payload: dims })}
            />
          </Section>
        )}

        {/* Section 3: Material */}
        {hasArea && (
          <Section number={3} title="Material" enabled={true}>
            <MaterialSelector
              manufacturerId={state.manufacturerId}
              materialTypeId={state.materialTypeId}
              modelId={state.modelId}
              finishId={state.finishId}
              productId={state.productId}
              onManufacturerChange={(id) => dispatch({ type: "SET_MANUFACTURER", payload: id })}
              onMaterialTypeChange={(id) => dispatch({ type: "SET_MATERIAL_TYPE", payload: id })}
              onModelChange={(id) => dispatch({ type: "SET_MODEL", payload: id })}
              onFinishChange={(id) => dispatch({ type: "SET_FINISH", payload: id })}
              onProductChange={(id) => dispatch({ type: "SET_PRODUCT", payload: id })}
            />
          </Section>
        )}

        {/* Section 4: Offer */}
        {hasProduct && (
          <Section number={4} title="Ofertă" enabled={true}>
            <OfferSummary state={state} />
          </Section>
        )}

        {/* Reset button */}
        {hasRoofType && (
          <div className="text-center pb-8 print:hidden">
            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            >
              Resetează calculul
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
