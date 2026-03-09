import crypto from 'crypto';

// ══════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════════════
const SCRIPT_AUTHOR = 'Zeus_Prenium';
const MASTER_SECRET = process.env.LICENSE_MASTER_SECRET || 'ZP_ULTRA_SECRET_2026_xK9mQ7bR';

// ══════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════
export interface LicenseResult {
  licenseKey: string;
  watermark: number;
  protectedCode: string;
  filename: string;
  buyerName: string;
  buyerEmail: string;
  scriptName: string;
  generatedAt: string;
}

// ══════════════════════════════════════════════════════════════════════
// KEY GENERATION
// ══════════════════════════════════════════════════════════════════════
function generateLicenseKey(buyerName: string, buyerEmail: string): { key: string; salt: string; timestamp: string } {
  const timestamp = Date.now().toString();
  const salt = crypto.randomBytes(8).toString('hex');
  const raw = `${MASTER_SECRET}:${buyerName}:${buyerEmail}:${timestamp}:${salt}`;
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  const keyChars = hash.substring(0, 16).toUpperCase();
  const key = `ZP-${keyChars.slice(0, 4)}-${keyChars.slice(4, 8)}-${keyChars.slice(8, 12)}-${keyChars.slice(12, 16)}`;
  return { key, salt, timestamp };
}

function generateIntegritySeeds(licenseKey: string): number[] {
  const seeds: number[] = [];
  for (let i = 0; i < 8; i++) {
    const h = crypto.createHash('md5').update(`${licenseKey}:seed:${i}:${MASTER_SECRET}`).digest('hex');
    const val = (parseInt(h.substring(0, 4), 16) % 30000) + 1000;
    seeds.push(val);
  }
  return seeds;
}

function generateWatermarkId(buyerName: string, licenseKey: string): number {
  const h = crypto.createHash('sha256').update(`${buyerName}:${licenseKey}:watermark`).digest('hex');
  return parseInt(h.substring(0, 8), 16) % 100000;
}

function licenseKeyToInts(licenseKey: string): number[] {
  const parts = licenseKey.replace('ZP-', '').split('-');
  return parts.map(part => {
    let val = 0;
    for (const ch of part) {
      val = (val * 31 + ch.charCodeAt(0)) % 32000;
    }
    return val;
  });
}

// ══════════════════════════════════════════════════════════════════════
// DETECT SCRIPT NAME FROM CODE
// ══════════════════════════════════════════════════════════════════════
function detectScriptInfo(code: string): { name: string; version: string } {
  let name = 'Unknown_Script';
  let version = 'V1';

  const lines = code.split('\n').slice(0, 100);
  for (const line of lines) {
    const nameMatch = line.match(/(?:Script\s*[:=]\s*(.+)|^\s*\*?\s*([A-Z][A-Z0-9_ ]{5,}(?:PRO|PREMIUM|ULTRA|DOMINATOR|PRECISION|MASTER|SURVIVOR)))/i);
    if (nameMatch) {
      name = (nameMatch[1] || nameMatch[2] || nameMatch[0]).trim().replace(/[^a-zA-Z0-9_ -]/g, '').replace(/\s+/g, '_');
      if (name.length > 3) break;
    }
  }

  const verMatch = code.match(/(?:Version|Ver|V)\s*[:=]?\s*([\d.]+)/i);
  if (verMatch) version = `V${verMatch[1]}`;

  return { name: name || 'Script', version };
}

// ══════════════════════════════════════════════════════════════════════
// FIND SAFE INJECTION POINT
// ══════════════════════════════════════════════════════════════════════
function findInjectionPoint(code: string): number {
  let inBlockComment = false;
  let lastBlockCommentEnd = -1;

  for (let i = 0; i < code.length - 1; i++) {
    if (!inBlockComment && code[i] === '/' && code[i + 1] === '*') {
      inBlockComment = true;
      i++;
    } else if (inBlockComment && code[i] === '*' && code[i + 1] === '/') {
      inBlockComment = false;
      lastBlockCommentEnd = i + 2;
      i++;
    }
  }

  if (lastBlockCommentEnd > 0 && lastBlockCommentEnd < 5000) {
    let pos = lastBlockCommentEnd;
    while (pos < code.length && code[pos] !== '\n') pos++;
    if (pos < code.length) pos++;
    return pos;
  }

  const lines = code.split('\n');
  let linePos = 0;
  for (let i = 0; i < lines.length && i < 50; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '' || trimmed.startsWith('//')) {
      linePos += lines[i].length + 1;
      continue;
    }
    return linePos;
  }

  return 0;
}

// ══════════════════════════════════════════════════════════════════════
// GENERATE SECURITY BLOCK — GPC2 32-bit COMPLIANT
// Règles : define sans #, pas de const int[], pas de float/bool/NULL
// ══════════════════════════════════════════════════════════════════════
function generateSecurityBlock(
  buyerName: string,
  licenseKey: string,
  keyInts: number[],
  seeds: number[],
  watermark: number
): string {
  const displayName = buyerName.substring(0, 18).toUpperCase();

  // Noms de variables obfusqués uniques
  const va = `_zs${100 + Math.floor(Math.random() * 900)}`;
  const vb = `_vc${100 + Math.floor(Math.random() * 900)}`;
  const vc = `_qi${100 + Math.floor(Math.random() * 900)}`;
  const vd = `_wm${100 + Math.floor(Math.random() * 900)}`;

  return `
// ================================================================
// LICENSE PROTECTION SYSTEM - ${SCRIPT_AUTHOR}
// Licensed to: ${displayName} | Key: ${licenseKey}
// ================================================================
define _LIC_K1 = ${keyInts[0] || 0};
define _LIC_K2 = ${keyInts[1] || 0};
define _LIC_K3 = ${keyInts[2] || 0};
define _LIC_K4 = ${keyInts[3] || 0};
define _LIC_WM = ${watermark};
define _LIC_S1 = ${seeds[0]};
define _LIC_S2 = ${seeds[1]};
define _LIC_S3 = ${seeds[2]};
define _LIC_S4 = ${seeds[3]};
define _LIC_S5 = ${seeds[4]};
define _LIC_S6 = ${seeds[5]};
define _LIC_S7 = ${seeds[6]};
define _LIC_S8 = ${seeds[7]};

int ${va} = _LIC_S1;
int ${vb} = _LIC_WM;
int ${vc} = _LIC_K1;
int ${vd} = 0;

`;
}

// ══════════════════════════════════════════════════════════════════════
// APPLY TIMING WATERMARK
// ══════════════════════════════════════════════════════════════════════
function applyTimingWatermark(code: string, watermark: number): string {
  const timingOffset = watermark % 7;
  if (timingOffset === 0) return code;

  let count = 0;
  return code.replace(/wait\((\d+)\)/g, (match, val) => {
    const v = parseInt(val);
    if (v >= 10 && v <= 500 && count < 15) {
      count++;
      return `wait(${v + timingOffset})`;
    }
    return match;
  });
}

// ══════════════════════════════════════════════════════════════════════
// REPLACE OLD AUTHOR NAMES
// ══════════════════════════════════════════════════════════════════════
function replaceAuthors(code: string): string {
  const oldNames = ['Gb_dev', 'ABUSHADAD', 'CoreX', 'Empathy', 'Brodies', 'Optic', 'ZURN'];
  let result = code;
  for (const old of oldNames) {
    result = result.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), SCRIPT_AUTHOR);
  }
  return result;
}

// ══════════════════════════════════════════════════════════════════════
// MAIN GENERATOR FUNCTION
// ══════════════════════════════════════════════════════════════════════
export function generateLicense(
  baseGpcCode: string,
  buyerName: string,
  buyerEmail: string,
  scriptSlug: string
): LicenseResult {
  const { name: scriptName, version: scriptVersion } = detectScriptInfo(baseGpcCode);

  const { key: licenseKey } = generateLicenseKey(buyerName, buyerEmail);
  const seeds = generateIntegritySeeds(licenseKey);
  const watermark = generateWatermarkId(buyerName, licenseKey);
  const keyInts = licenseKeyToInts(licenseKey);

  const securityBlock = generateSecurityBlock(
    buyerName, licenseKey, keyInts, seeds, watermark
  );

  const displayName = buyerName.substring(0, 52).toUpperCase();
  const header = `// ================================================================
// ${scriptName} ${scriptVersion} - LICENSED EDITION
// by ${SCRIPT_AUTHOR}
//
// LICENSED TO: ${displayName}
// LICENSE KEY: ${licenseKey}
// GENERATED:  ${new Date().toISOString().slice(0, 16)}
//
// REDISTRIBUTION IS STRICTLY PROHIBITED
// THIS COPY IS WATERMARKED AND TRACEABLE
// ================================================================
`;

  let code = replaceAuthors(baseGpcCode);

  const injectionPoint = findInjectionPoint(code);

  const before = code.substring(0, injectionPoint);
  const after = code.substring(injectionPoint);

  let protectedCode = header + before + securityBlock + after;

  protectedCode = applyTimingWatermark(protectedCode, watermark);

  const safeBuyer = buyerName.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 30);
  const safeSlug = scriptSlug.replace(/[^a-zA-Z0-9._-]/g, '_');
  const keySafe = licenseKey.replace(/-/g, '_');
  const filename = `${safeSlug}_${safeBuyer}_${keySafe}.gpc`;

  return {
    licenseKey,
    watermark,
    protectedCode,
    filename,
    buyerName,
    buyerEmail,
    scriptName,
    generatedAt: new Date().toISOString(),
  };
}
