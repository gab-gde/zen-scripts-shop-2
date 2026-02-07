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

  const text = await data.text();
  console.log(`[Storage] Script de base "${scriptSlug}" chargé: ${text.length} caractères, ${text.split('\n').length} lignes`);
  return text;
}

// ══════════════════════════════════════════════════════════════════════
// RÉCUPÉRER LE PDF DE SÉCURITÉ (en base64 pour pièce jointe email)
// ══════════════════════════════════════════════════════════════════════
let securityPdfCache: string | null = null;

export async function getSecurityPdfBase64(): Promise<string | null> {
  // Cache en mémoire pour ne pas re-télécharger à chaque vente
  if (securityPdfCache) {
    console.log('[Storage] PDF sécurité (cache mémoire)');
    return securityPdfCache;
  }

  const { data, error } = await supabase.storage
    .from(BASE_SCRIPTS_BUCKET)
    .download('Zeus_Prenium_Security_Document.pdf');

  if (error || !data) {
    console.error('[Storage] PDF sécurité non trouvé dans base-scripts:', error);
    return null;
  }

  const arrayBuffer = await data.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  securityPdfCache = base64;
  console.log(`[Storage] PDF sécurité chargé: ${Math.round(base64.length / 1024)} Ko (base64)`);
  return base64;
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

  const buffer = Buffer.from(content, 'utf-8');
  console.log(`[Storage] Upload build: ${filename} (${buffer.length} bytes)`);

  const { error } = await supabase.storage
    .from(BUILDS_BUCKET)
    .upload(path, buffer, {
      contentType: 'application/octet-stream',
      upsert: true,
    });

  if (error) {
    console.error(`[Storage] Erreur upload build:`, error);
    return null;
  }

  console.log(`[Storage] Build uploadé: ${path}`);
  return path;
}

// ══════════════════════════════════════════════════════════════════════
// GÉNÉRER UN LIEN DE TÉLÉCHARGEMENT TEMPORAIRE (1h)
// ══════════════════════════════════════════════════════════════════════
export async function getDownloadUrl(storagePath: string): Promise<string | null> {
  const filename = storagePath.split('/').pop() || 'script.gpc';

  const { data, error } = await supabase.storage
    .from(BUILDS_BUCKET)
    .createSignedUrl(storagePath, 3600, {
      download: filename,
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
      download: filename,
    });

  if (error || !data) {
    console.error(`[Storage] Erreur regénération URL:`, error);
    return null;
  }

  return data.signedUrl;
}
