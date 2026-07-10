import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    // Crée la table si elle n'existe pas encore (une seule fois, sans danger de la relancer)
    await sql`
      CREATE TABLE IF NOT EXISTS songs (
        id BIGINT PRIMARY KEY,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        chords JSONB DEFAULT '[]',
        sections JSONB DEFAULT '[]'
      )
    `;

    if (req.method === 'GET') {
      const rows = await sql`SELECT id, title, artist, chords, sections FROM songs ORDER BY id DESC`;
      const songs = rows.map(r => ({
        id: Number(r.id),
        title: r.title,
        artist: r.artist,
        chords: r.chords || [],
        sections: r.sections || []
      }));
      return res.status(200).json(songs);
    }

    if (req.method === 'POST') {
      const song = req.body;
      if (!song || !song.title || !song.artist || !song.id) {
        return res.status(400).json({ error: 'Données de chanson invalides (id, title, artist requis).' });
      }
      await sql`
        INSERT INTO songs (id, title, artist, chords, sections)
        VALUES (${song.id}, ${song.title}, ${song.artist}, ${JSON.stringify(song.chords || [])}, ${JSON.stringify(song.sections || [])})
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          artist = EXCLUDED.artist,
          chords = EXCLUDED.chords,
          sections = EXCLUDED.sections
      `;
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'id manquant' });
      await sql`DELETE FROM songs WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (e) {
    console.error('Erreur /api/songs:', e);
    return res.status(500).json({ error: 'Erreur serveur', detail: String(e) });
  }
}
