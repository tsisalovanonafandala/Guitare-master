import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    await sql`
      CREATE TABLE IF NOT EXISTS visitors (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        date TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    if (req.method === 'GET') {
      const rows = await sql`SELECT email, date FROM visitors ORDER BY date DESC`;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { email } = req.body || {};
      if (!email) return res.status(400).json({ error: 'email manquant' });
      await sql`INSERT INTO visitors (email) VALUES (${email})`;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (e) {
    console.error('Erreur /api/visitors:', e);
    return res.status(500).json({ error: 'Erreur serveur', detail: String(e) });
  }
}
