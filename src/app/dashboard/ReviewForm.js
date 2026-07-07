"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseBrowser";

export default function ReviewForm({ businessId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [sent, setSent] = useState(false);

  async function submit() {
    const supabase = createClient();
    const { error } = await supabase.from("reviews").insert({
      business_id: businessId,
      rating,
      comment,
      author_name: authorName || null,
    });
    if (!error) setSent(true);
  }

  if (sent) return <p>¡Gracias por tu reseña!</p>;

  return (
    <div>
      <h3>Deja tu reseña</h3>
      <label>Calificación: </label>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>{n} ★</option>
        ))}
      </select>
      <br />
      <input
        placeholder="Tu nombre (opcional)"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Tu comentario"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <br />
      <button onClick={submit}>Enviar reseña</button>
    </div>
  );
}
