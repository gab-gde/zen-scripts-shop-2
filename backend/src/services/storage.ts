import { supabase } from '../lib/supabase';

const BASE_SCRIPTS_BUCKET = 'base-scripts';
const BUILDS_BUCKET = 'builds';

// ══════════════════════════════════════════════════════════════════════
// RÉCUPÉRER LE SCRIPT DE BASE D'UN JEU
// ══════════════════════════════════════════════════════════════════════
export async function getBaseScript(scriptSlug: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BASE_SCRIPTS_BUCKET)
    .download(`${scriptSlug}.gpc`);

  if (error || !data) {
    console.error(`[Storage] Erreur téléchargement base script ${scriptSlug}:`, error);
    return null;
  }

  // Lire en ArrayBuffer puis décoder en Latin-1 pour préserver les caractères spéciaux
  const arrayBuffer = await data.arrayBuffer();
  const decoder = new TextDecoder('latin1');
  return decoder.decode(arrayBuffer);
}

// ══════════════════════════════════════════════════════════════════════
// STOCKER UN BUILD GÉNÉRÉ
// ══════════════════════════════════════════════════════════════════════
export async function storeBuild(
  filename: string,
  content: string,
  orderId: string
): Promise<string | null> {
  const path = `${orderId}/${filename}`;

  // Encoder en Latin-1 pour préserver les caractères spéciaux des .gpc
  const encoder = new TextEncoder();
  const bytes = new Uint8Array(content.length);
  for (let i = 0; i < content.length; i++) {
    bytes[i] = content.charCodeAt(i) & 0xFF;
  }

  const { error } = await supabase.storage
    .from(BUILDS_BUCKET)
    .upload(path, bytes, {
      contentType: 'application/octet-stream', // ← Force téléchargement, pas affichage
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
  // Extraire le nom du fichier pour le Content-Disposition
  const filename = storagePath.split('/').pop() || 'script.gpc';

  const { data, error } = await supabase.storage
    .from(BUILDS_BUCKET)
    .createSignedUrl(storagePath, 3600, {
      download: filename, // ← Force le téléchargement avec le bon nom de fichier
    });

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
  const filename = storagePath.split('/').pop() || 'script.gpc';

  const { data, error } = await supabase.storage
    .from(BUILDS_BUCKET)
    .createSignedUrl(storagePath, expiresIn, {
      download: filename, // ← Force le téléchargement
    });

  if (error || !data) {
    console.error(`[Storage] Erreur regénération URL:`, error);
    return null;
  }

  return data.signedUrl;
}
