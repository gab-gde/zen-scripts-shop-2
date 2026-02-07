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

function generateHashChain(licenseKey: string): number[] {
  const chain: number[] = [];
  let current = licenseKey;
  for (let i = 0; i < 12; i++) {
    const h = crypto.createHash('sha256').update(`${current}:${i}`).digest('hex');
    const val = parseInt(h.substring(0, 3), 16) % 255;
    chain.push(val);
    current = h;
  }
  return chain;
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
// SCRIPT INFO DETECTION
// ══════════════════════════════════════════════════════════════════════
function detectScriptInfo(code: string): { name: string; version: string; authors: string[] } {
  let name = 'Unknown_Script';
  let version = 'V1';
  const authors: string[] = [];

  // Detect name from header comments
  const namePatterns = [
    /\/\/\s*(?:Script|Name|Title)\s*[:=]\s*(.+)/i,
    /^\s*\/\/\s*={3,}\s*\n\s*\/\/\s*(.+?)\s*\n/m,
    /^\s*\/\/.*?([A-Z][A-Za-z0-9_ ]{3,}(?:PRO|PREMIUM|ULTRA|V\d))/m,
  ];
  for (const p of namePatterns) {
    const m = code.match(p);
    if (m) { name = m[1].trim().replace(/\s+/g, '_'); break; }
  }

  // Detect version
  const verMatch = code.match(/(?:Version|Ver|V)\s*[:=]?\s*([\d.]+)/i);
  if (verMatch) version = `V${verMatch[1]}`;

  // Detect old authors
  const oldNames = ['Gb_dev', 'ABUSHADAD', 'CoreX', 'Empathy', 'Brodies', 'Optic', 'ZURN'];
  for (const old of oldNames) {
    if (code.toLowerCase().includes(old.toLowerCase())) authors.push(old);
  }

  return { name, version, authors };
}

// ══════════════════════════════════════════════════════════════════════
// SECURITY BLOCK GENERATION
// ══════════════════════════════════════════════════════════════════════
function generateSecurityBlock(
  buyerName: string,
  licenseKey: string,
  keyInts: number[],
  seeds: number[],
  watermark: number,
  hashChain: number[]
): { block: string; vars: Record<string, string> } {
  const vars: Record<string, string> = {
    auth_state: `_zs${100 + Math.floor(Math.random() * 900)}`,
    check_sum: `_vc${100 + Math.floor(Math.random() * 900)}`,
    integrity: `_qi${100 + Math.floor(Math.random() * 900)}`,
    gate: `_gk${100 + Math.floor(Math.random() * 900)}`,
    watermark_var: `_wm${100 + Math.floor(Math.random() * 900)}`,
    trap: `_tp${100 + Math.floor(Math.random() * 900)}`,
    validate_counter: `_xc${100 + Math.floor(Math.random() * 900)}`,
    heartbeat: `_hb${100 + Math.floor(Math.random() * 900)}`,
  };

  const displayName = buyerName.substring(0, 18).toUpperCase();
  const chainStr = hashChain.slice(0, 8).join(',');

  const block = `
// ╔════════════════════════════════════════════════════════╗
// ║  LICENSE PROTECTION SYSTEM - ${SCRIPT_AUTHOR}         ║
// ╚════════════════════════════════════════════════════════╝
#define _LIC_K1  ${keyInts[0] || 0}
#define _LIC_K2  ${keyInts[1] || 0}
#define _LIC_K3  ${keyInts[2] || 0}
#define _LIC_K4  ${keyInts[3] || 0}
#define _LIC_WM  ${watermark}
#define _LIC_S1  ${seeds[0]}
#define _LIC_S2  ${seeds[1]}
#define _LIC_S3  ${seeds[2]}
#define _LIC_S4  ${seeds[3]}
#define _LIC_S5  ${seeds[4]}
#define _LIC_S6  ${seeds[5]}
#define _LIC_S7  ${seeds[6]}
#define _LIC_S8  ${seeds[7]}

int ${vars.auth_state} = 0;
int ${vars.check_sum} = 0;
int ${vars.integrity} = _LIC_S1;
int ${vars.gate} = 1;
int ${vars.watermark_var} = _LIC_WM;
int ${vars.trap} = 0;
int ${vars.validate_counter} = 0;
int ${vars.heartbeat} = 0;

const int _HC[] = {${chainStr}};

// License greeting
const char GreetingText[] = "Licensed to: ${displayName}";
`;
  return { block, vars };
}

// ══════════════════════════════════════════════════════════════════════
// INJECT PROTECTION INTO CODE
// ══════════════════════════════════════════════════════════════════════
function injectProtection(
  originalCode: string,
  securityBlock: string,
  vars: Record<string, string>,
  buyerName: string,
  licenseKey: string,
  scriptName: string,
  scriptVersion: string,
  watermark: number,
  hashChain: number[]
): string {
  let code = originalCode;

  // Replace old author names
  const oldNames = ['Gb_dev', 'ABUSHADAD', 'CoreX', 'Empathy', 'Brodies_Curse', 'Optic', 'ZURN'];
  for (const old of oldNames) {
    code = code.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), SCRIPT_AUTHOR);
  }

  // Find injection point (after first block of #define or at the top after comments)
  const defineMatch = code.match(/((?:#define\s+\w+\s+.+\n)+)/);
  if (defineMatch && defineMatch.index !== undefined) {
    const insertPos = defineMatch.index + defineMatch[0].length;
    code = code.substring(0, insertPos) + '\n' + securityBlock + '\n' + code.substring(insertPos);
  } else {
    // Insert after header comments
    const headerEnd = code.search(/\n(?!\/\/)/);
    if (headerEnd > 0) {
      code = code.substring(0, headerEnd) + '\n' + securityBlock + '\n' + code.substring(headerEnd);
    } else {
      code = securityBlock + '\n' + code;
    }
  }

  // Add license header
  const displayName = buyerName.substring(0, 52).toUpperCase();
  const header = `// ╔══════════════════════════════════════════════════════════════════╗
// ║  ${scriptName} ${scriptVersion} - LICENSED EDITION
// ║  by ${SCRIPT_AUTHOR}
// ║
// ║  LICENSED TO: ${displayName}
// ║  LICENSE KEY: ${licenseKey}
// ║  GENERATED:  ${new Date().toISOString().slice(0, 16)}
// ║
// ║  REDISTRIBUTION IS STRICTLY PROHIBITED
// ║  THIS COPY IS WATERMARKED AND TRACEABLE
// ╚══════════════════════════════════════════════════════════════════╝
`;
  code = header + code;

  // Apply timing watermark (subtle offset on wait() values)
  const timingOffset = watermark % 7;
  if (timingOffset > 0) {
    let count = 0;
    code = code.replace(/wait\((\d+)\)/g, (match, val) => {
      const v = parseInt(val);
      if (v >= 10 && v <= 500 && count < 15) {
        count++;
        return `wait(${v + timingOffset})`;
      }
      return match;
    });
  }

  return code;
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
  const hashChain = generateHashChain(licenseKey);
  const keyInts = licenseKeyToInts(licenseKey);

  const { block: securityBlock, vars } = generateSecurityBlock(
    buyerName, licenseKey, keyInts, seeds, watermark, hashChain
  );

  const protectedCode = injectProtection(
    baseGpcCode, securityBlock, vars,
    buyerName, licenseKey, scriptName, scriptVersion,
    watermark, hashChain
  );

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
