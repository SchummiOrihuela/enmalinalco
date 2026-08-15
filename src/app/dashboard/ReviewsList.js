"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

const h3Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "22px",
  fontWeight: 400,
  color: "var(--ink)",
  margin: "0 0 8px",
};

export default function ReviewsList({ businessId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });
      setReviews(data || []);
      setLoading(false);
    }
    load();
  }, [businessId]);

  if (loading) {
    return <p style={{ fontSize: "14px", color: "var(--ink)", opacity: 0.5 }}>Cargando reseñas...</p>;
  }

  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div>
      <h3 style={h3Style}>Reseñas ({reviews.length})</h3>
      {avg && (
        <p style={{ fontSize: "14px", color: "var(--ink)", opacity: 0.6, marginBottom: "14px" }}>
          Promedio: <strong style={{ color: "var(--oro)" }}>{avg} ★</strong>
        </p>
      )}
      {reviews.length === 0 && (
        <p style={{ fontSize: "14px", color: "var(--ink)", opacity: 0.5 }}>Aún no hay reseñas.</p>
      )}
      {reviews.map((r) => (
        <div key={r.id} style={{
          borderBottom: "1px solid rgba(128,128,128,0.15)",
          padding: "12px 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "var(--oro)", letterSpacing: "2px", fontSize: "14px" }}>
              {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
            </span>
            <span style={{ fontSize: "14px", color: "var(--ink)", opacity: 0.7 }}>
              — {r.author_name || "Anónimo"}
            </span>
          </div>
          {r.comment && (
            <p style={{ fontSize: "14px", color: "var(--ink)", opacity: 0.65, margin: "6px 0 0", lineHeight: 1.5 }}>
              {r.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
