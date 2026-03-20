import { NextRequest, NextResponse } from "next/server";

interface SendOfferBody {
  customerContact: string;
  contactType: "email" | "phone";
  roofType: string;
  dimensions: {
    a: number;
    b: number;
    c: number;
    d?: number;
  };
  totalArea: number;
  productName: string;
  thicknessMm: number;
  color: string | null;
  pricePerSqm: number;
  totalSheets: number;
  estimatedTotal: number;
  wastePercentage: number;
}

export async function POST(request: NextRequest) {
  const body: SendOfferBody = await request.json();

  const instanceId = process.env.GREENAPI_INSTANCE_ID;
  const apiToken = process.env.GREENAPI_API_TOKEN;
  const consultantNumber = process.env.CONSULTANT_WHATSAPP;

  if (!instanceId || !apiToken || !consultantNumber) {
    return NextResponse.json(
      { error: "WhatsApp configuration missing" },
      { status: 500 }
    );
  }

  const roofLabel = body.roofType === "1_slope" ? "1 Apă" : "2 Ape";
  const dimensionsText =
    body.roofType === "1_slope"
      ? `A=${body.dimensions.a}m, B=${body.dimensions.b}m, C=${body.dimensions.c}m`
      : `A=${body.dimensions.a}m, B=${body.dimensions.b}m, C=${body.dimensions.c}m, D=${body.dimensions.d}m`;

  const contactLabel = body.contactType === "email" ? "Email" : "Telefon";

  const message =
    `📋 *CERERE NOUĂ DE OFERTĂ*\n\n` +
    `👤 *Client:*\n` +
    `${contactLabel}: ${body.customerContact}\n\n` +
    `🏠 *Acoperiș:* ${roofLabel}\n` +
    `📐 *Dimensiuni:* ${dimensionsText}\n` +
    `📏 *Suprafață:* ${body.totalArea.toFixed(2)} m²\n\n` +
    `🔧 *Material:*\n` +
    `${body.productName}\n` +
    `Grosime: ${body.thicknessMm} mm\n` +
    `${body.color ? `Culoare: ${body.color}\n` : ""}` +
    `Preț: ${body.pricePerSqm.toFixed(2)} €/m²\n\n` +
    `📊 *Estimare:*\n` +
    `Foi necesare: ${body.totalSheets} buc\n` +
    `Risipă: ${body.wastePercentage}%\n` +
    `*Total estimat: ${body.estimatedTotal.toFixed(2)} €*\n\n` +
    `⚠️ _Estimare generată automat. Necesită confirmare._`;

  try {
    const greenApiUrl = `https://api.green-api.com/waInstance${instanceId}/sendMessage/${apiToken}`;

    const response = await fetch(greenApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: `${consultantNumber}@c.us`,
        message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GreenAPI error:", errorText);
      return NextResponse.json(
        { error: "Failed to send WhatsApp message" },
        { status: 500 }
      );
    }

    const result = await response.json();
    return NextResponse.json({ success: true, messageId: result.idMessage });
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
