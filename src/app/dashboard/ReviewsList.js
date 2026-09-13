"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

const h3Style = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "24px",
  fontWeight: 400,
  color: "var(--ink)",
  margin: "0 0 20px",
};

// Estrella en SVG: nítida, con relleno parcial para medias estrellas.
function Star({ fill = 1, size = 18 }) {
  const id = `g${Math.random().toString(36).slice(2)}`;
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${pct}%`} stopColor="var(--oro)" />
          <stop offset={`${pct}%`} stopColor="rgba(128,128,128,0.28)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.2l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.6l-5.81 3.06 1.11-6.47-4.7-4.58 6.5-.95z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

function Stars({ value, size = 18, gap = 3 }) {
  return (
    <div style={{ display: "inline-flex", gap: `${gap}px` }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} fill={value - i} size={size} />
      ))}
    </div>
  );
}

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
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <div>
      <h3 style={h3Style}>Reseñas</h3>

      {reviews.length === 0 ? (
        <p style={{ fontSize: "14px", color: "var(--ink)", opacity: 0.5 }}>
          Aún no hay reseñas. En cuanto tus clientes te califiquen, aparecerán aquí.
        </p>
      ) : (
        <>
          {/* Bloque de promedio — el foco de la sección */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "22px",
            padding: "20px 24px",
            background: "linear-gradient(135deg, rgba(220,178,74,0.14), rgba(220,178,74,0.04))",
            border: "1px solid rgba(220,178,74,0.28)",
            borderRadius: "16px",
            marginBottom: "24px",
          }}>
            <div style={{ textAlign: "center", lineHeight: 1 }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "52px",
                fontWeight: 500,
                color: "var(--oro)",
              }}>
                {avg.toFixed(1)}
              </div>
              <div style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink)", opacity: 0.5, marginTop: "4px" }}>
                de 5
              </div>
            </div>
            <div style={{ width: "1px", alignSelf: "stretch", background: "rgba(220,178,74,0.28)" }} />
            <div>
              <Stars value={avg} size={24} gap={4} />
              <p style={{ fontSize: "14px", color: "var(--ink)", opacity: 0.7, margin: "10px 0 0" }}>
                Basado en <strong>{reviews.length}</strong> {reviews.length === 1 ? "reseña" : "reseñas"} de tus clientes
              </p>
            </div>
          </div>

          {/* Lista de reseñas */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {reviews.map((r) => (
              <div key={r.id} style={{
                padding: "16px 18px",
                background: "var(--parch)",
                borderRadius: "12px",
                borderLeft: "3px solid var(--oro)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: r.comment ? "8px" : 0 }}>
                  <Stars value={r.rating} size={15} />
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)", opacity: 0.75 }}>
                    {r.author_name || "Anónimo"}
                  </span>
                </div>
                {r.comment && (
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "17px",
                    fontStyle: "italic",
                    color: "var(--ink)",
                    opacity: 0.85,
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    “{r.comment}”
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
