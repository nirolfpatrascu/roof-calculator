"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase.from("_test").select("*").limit(1);
      // We expect an error since the table doesn't exist,
      // but if we get a proper Supabase error (not a network error), the connection works
      if (error && error.message.includes("does not exist")) {
        setStatus("Supabase connection successful!");
      } else if (error && error.code === "PGRST116") {
        setStatus("Supabase connection successful!");
      } else if (!error) {
        setStatus("Supabase connection successful!");
      } else {
        setStatus(`Connection issue: ${error.message}`);
      }
    }
    testConnection();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Roof Calculator</h1>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}
