import { supabase } from '../lib/supabase';

const BASE_SCRIPTS_BUCKET = 'base-scripts';   // Scripts .gpc de base (un par jeu)
const BUILDS_BUCKET = 'builds';               // Builds générés pour chaque client

// ══════════════════════════════════════════════════════════════════════
// RÉCUPÉRER LE SCRIPT DE BASE D'UN JEU
// ══════════════════════════════════════════════════════════════════════
export async function getBaseScript(scriptSlug: string): Promise<string | null> {
  // Le fichier de base est stocké dans le bucket "base-scripts" 
  // avec le nom: {slug}.gpc (ex: "ea-fc-26-pro.gpc")
  const { data, error } = await supabase.storage
    .from(BASE_SCRIPTS_BUCKET)
    .download(`${scriptSlug}.gpc`);

  if (error || !data) {
    console.error(`[Storage] Erreur téléchargement base script ${scriptSlug}:`, error);
    return null;
  }

  const text = await data.text();
  return text;
}

// ══════════════════════════════════════════════════════════════════════
// STOCKER UN BUILD GÉNÉRÉ
// ══════════════════════════════════════════════════════════════════════
export async function storeBuild(
  filename: string,
  content: string,
  orderId: string
): Promise<string | null> {
  // Stocke dans builds/{orderId}/{filename}
  const path = `${orderId}/${filename}`;

  const { error } = await supabase.storage
    .from(BUILDS_BUCKET)
    .upload(path, Buffer.from(content, 'utf-8'), {
      contentType: 'text/plain',
      upsert: true,
    });

  if (error) {
    console.error(`[Storage] Erreur upload build:`, error);
    return null;
  }

  return path;
}

// ══════════════════════════════════════════════════════════════════════
// GÉNÉRER UN LIEN DE TÉLÉCHARGEMENT TEMPORAIRE (1h)
// ══════════════════════════════════════════════════════════════════════
export async function getDownloadUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUILDS_BUCKET)
    .createSignedUrl(storagePath, 3600); // 1 heure

  if (error || !data) {
    console.error(`[Storage] Erreur création signed URL:`, error);
    return null;
  }

  return data.signedUrl;
}

// ══════════════════════════════════════════════════════════════════════
// REGÉNÉRER UN LIEN (pour l'admin ou le renvoi)
// ══════════════════════════════════════════════════════════════════════
export async function regenerateDownloadUrl(storagePath: string, expiresIn = 86400): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUILDS_BUCKET)
    .createSignedUrl(storagePath, expiresIn); // 24h par défaut

  if (error || !data) {
    console.error(`[Storage] Erreur regénération URL:`, error);
    return null;
  }

  return data.signedUrl;
}
