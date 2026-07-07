"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

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

  if (loading) return <p>Cargando reseñas...</p>;

  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div>
      <h3>Reseñas ({reviews.length})</h3>
      {avg && <p>Promedio: {avg} ★</p>}
      {reviews.length === 0 && <p>Aún no hay reseñas.</p>}
      {reviews.map((r) => (
        <div key={r.id} style={{ borderBottom: "1px solid #ddd", padding: "8px 0" }}>
          <strong>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</strong>
          <span> — {r.author_name || "Anónimo"}</span>
          {r.comment && <p>{r.comment}</p>}
        </div>
      ))}
    </div>
  );
}
