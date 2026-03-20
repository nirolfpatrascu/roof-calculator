"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CalculatorState, Product } from "@/lib/types";
import { calculateSheets, calculateTotalPrice } from "@/lib/calculations";

interface OfferSummaryProps {
  state: CalculatorState;
}

const VAT_RATE = 19;

export default function OfferSummary({ state }: OfferSummaryProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [contactType, setContactType] = useState<"phone" | "email">("phone");
  const [contactValue, setContactValue] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state.productId) return;
    supabase
      .from("products")
      .select("*")
      .eq("id", state.productId)
      .single()
      .then(({ data }) => setProduct(data));
  }, [state.productId]);

  if (!product) return null;

  const areaWithWaste = Number(
    (state.totalArea * (1 + state.wastePercentage / 100)).toFixed(2)
  );
  const totalSheets = calculateSheets(
    state.totalArea,
    product.sheet_height_m,
    product.sheet_width_m,
    state.wastePercentage
  );
  const valueExVat = calculateTotalPrice(
    state.totalArea,
    product.price_per_sqm,
    state.wastePercentage
  );
  const pricePerSheet = Number((product.price_per_sqm * product.sheet_height_m * product.sheet_width_m).toFixed(2));
  const vatAmount = Number(((valueExVat * VAT_RATE) / 100).toFixed(2));
  const totalWithVat = Number((valueExVat + vatAmount).toFixed(2));

  const handleSend = async () => {
    if (!contactValue.trim()) {
      setError(
        contactType === "phone"
          ? "Introduceți numărul de telefon"
          : "Introduceți adresa de email"
      );
      return;
    }

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/send-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerContact: contactValue.trim(),
          contactType,
          roofType: state.roofType,
          dimensions: state.dimensions,
          totalArea: state.totalArea,
          productName: product.name,
          thicknessMm: product.thickness_mm,
          color: product.color,
          pricePerSqm: product.price_per_sqm,
          totalSheets,
          estimatedTotal: totalWithVat,
          wastePercentage: state.wastePercentage,
        }),
      });

      if (!res.ok) throw new Error("Send failed");
      setSent(true);
    } catch {
      setError("Eroare la trimitere. Vă rugăm încercați din nou.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#1e1e1e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[#1e1e1e] mb-2">Cerere trimisă cu succes!</h3>
        <p className="text-[#434343] text-lg">
          Un consultant vă va contacta în cel mai scurt timp pentru a confirma oferta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estimate disclaimer */}
      <div className="bg-brand/15 border-2 border-brand rounded-xl p-5 text-center">
        <p className="text-2xl font-bold text-[#1e1e1e] mb-1">Aceasta este o estimare</p>
        <p className="text-[#434343]">
          Prețul final va fi confirmat de un consultant după verificarea detaliilor.
        </p>
      </div>

      {/* Estimate table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#1e1e1e] text-white">
              <th className="border border-[#3f4042] px-3 py-2 text-left font-semibold">NR</th>
              <th className="border border-[#3f4042] px-3 py-2 text-left font-semibold">PRODUS</th>
              <th className="border border-[#3f4042] px-3 py-2 text-right font-semibold">CANT</th>
              <th className="border border-[#3f4042] px-3 py-2 text-center font-semibold">UM</th>
              <th className="border border-[#3f4042] px-3 py-2 text-right font-semibold">PREȚ</th>
              <th className="border border-[#3f4042] px-3 py-2 text-right font-semibold">VALOARE</th>
              <th className="border border-[#3f4042] px-3 py-2 text-right font-semibold">TVA</th>
              <th className="border border-[#3f4042] px-3 py-2 text-right font-semibold">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[#ebebed] px-3 py-2 text-center">1</td>
              <td className="border border-[#ebebed] px-3 py-2">{product.name}</td>
              <td className="border border-[#ebebed] px-3 py-2 text-right">{totalSheets}</td>
              <td className="border border-[#ebebed] px-3 py-2 text-center">buc</td>
              <td className="border border-[#ebebed] px-3 py-2 text-right">{pricePerSheet.toFixed(2)}</td>
              <td className="border border-[#ebebed] px-3 py-2 text-right">{valueExVat.toFixed(2)}</td>
              <td className="border border-[#ebebed] px-3 py-2 text-right">{vatAmount.toFixed(2)}</td>
              <td className="border border-[#ebebed] px-3 py-2 text-right font-medium">{totalWithVat.toFixed(2)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-brand/10 font-semibold">
              <td colSpan={5} className="border border-[#ebebed] px-3 py-2 text-right">Total estimat (EUR)</td>
              <td className="border border-[#ebebed] px-3 py-2 text-right">{valueExVat.toFixed(2)}</td>
              <td className="border border-[#ebebed] px-3 py-2 text-right">{vatAmount.toFixed(2)}</td>
              <td className="border border-[#ebebed] px-3 py-2 text-right">{totalWithVat.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Additional details */}
      <div className="text-sm text-[#434343] grid grid-cols-2 gap-4">
        <div>
          <p><span className="font-medium text-[#1e1e1e]">Foi necesare:</span> {totalSheets} buc ({product.sheet_height_m}×{product.sheet_width_m} m/foaie)</p>
          <p><span className="font-medium text-[#1e1e1e]">Grosime:</span> {product.thickness_mm} mm</p>
          {product.color && <p><span className="font-medium text-[#1e1e1e]">Culoare:</span> {product.color}</p>}
          <p><span className="font-medium text-[#1e1e1e]">Risipă inclusă:</span> {state.wastePercentage}%</p>
        </div>
        <div>
          <p><span className="font-medium text-[#1e1e1e]">Acoperiș:</span> {state.roofType === "1_slope" ? "1 Apă" : "2 Ape"}</p>
          <p>
            <span className="font-medium text-[#1e1e1e]">Dimensiuni:</span>{" "}
            A={state.dimensions.a}m, B={state.dimensions.b}m, C={state.dimensions.c}m
            {state.roofType === "2_slopes" && state.dimensions.d ? `, D=${state.dimensions.d}m` : ""}
          </p>
          <p><span className="font-medium text-[#1e1e1e]">Suprafață netă:</span> {state.totalArea.toFixed(2)} m²</p>
        </div>
      </div>

      {/* Contact form + CTA */}
      <div className="bg-[#f8f8f8] border border-[#ebebed] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#1e1e1e] mb-1">Solicită oferta finală</h3>
        <p className="text-sm text-[#434343] mb-4">
          Trimite estimarea unui consultant care va reveni cu oferta confirmată.
        </p>

        {/* Contact type toggle */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => { setContactType("phone"); setContactValue(""); setError(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              contactType === "phone"
                ? "bg-[#1e1e1e] text-white"
                : "bg-white border border-[#ebebed] text-[#434343] hover:border-teal"
            }`}
          >
            Telefon
          </button>
          <button
            onClick={() => { setContactType("email"); setContactValue(""); setError(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              contactType === "email"
                ? "bg-[#1e1e1e] text-white"
                : "bg-white border border-[#ebebed] text-[#434343] hover:border-teal"
            }`}
          >
            Email
          </button>
        </div>

        {/* Contact input */}
        <input
          type={contactType === "email" ? "email" : "tel"}
          value={contactValue}
          onChange={(e) => { setContactValue(e.target.value); setError(""); }}
          placeholder={contactType === "phone" ? "07xx xxx xxx" : "email@exemplu.ro"}
          className="w-full rounded-lg border border-[#ebebed] px-4 py-3 text-lg focus:border-brand focus:ring-2 focus:ring-brand/30 outline-none transition mb-3"
        />

        {error && <p className="text-coral text-sm mb-3">{error}</p>}

        {/* CTA */}
        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full py-3.5 rounded-xl bg-brand text-[#1e1e1e] text-lg font-bold hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Se trimite..." : "Trimite la consultant"}
        </button>
      </div>
    </div>
  );
}
