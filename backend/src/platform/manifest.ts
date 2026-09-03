import { z } from 'zod';
import { resolveAppVersion } from '../config/version';
import crypto from 'crypto';
import { config } from '../config';

export const MODULE_API_VERSION = '3';

const menuMetadataSchema = z.object({
  id: z.string(),
  label: z.string(),
  path: z.string(),
  icon: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().optional(),
  requiredPermission: z.string().optional(),
});

const widgetMetadataSchema = z.object({
  id: z.string(),
  title: z.string(),
  componentId: z.string(),
  sortOrder: z.number().optional(),
});

const reportMetadataSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  path: z.string().optional(),
  icon: z.string().optional(),
  componentId: z.string(),
  sortOrder: z.number().optional(),
  requiredPermission: z.string().optional(),
});

const developerPageMetadataSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  path: z.string().optional(),
  icon: z.string().optional(),
  componentId: z.string(),
  sortOrder: z.number().optional(),
  requiredPermission: z.string().optional(),
});

const healthCheckMetadataSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

const routeMetadataSchema = z.object({
  mountPath: z.string().default('/'),
  webhook: z.boolean().default(false),
  public: z.boolean().default(false),
});

const settingsFieldSchema = z.object({
  key: z.string(),
  group: z.string(),
  label: z.string(),
  description: z.string().optional(),
  type: z.enum(['string', 'text', 'number', 'boolean', 'password', 'email', 'select', 'url']),
  default: z.unknown().optional(),
  required: z.boolean().optional(),
  encrypted: z.boolean().optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    enum: z.array(z.string()).optional(),
  }).optional(),
  helpText: z.string().optional(),
  options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
});

const settingsGroupSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  advanced: z.boolean().optional(),
});

const settingsMetadataSchema = z.object({
  namespace: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  adminPath: z.string().optional(),
  configKey: z.string().optional(),
  permission: z.string().optional(),
  groups: z.array(settingsGroupSchema).default([]),
  fields: z.array(settingsFieldSchema).default([]),
});

const qaMetadataSchema = z.object({
  participatesInScenarios: z.boolean().default(true),
  providesSeed: z.boolean().default(false),
  integrationTest: z.string().optional(),
  apiTest: z.string().optional(),
}).optional();

export const moduleManifestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  version: z.string().regex(/^\d+\.\d+\.\d+/),
  author: z.string(),
  homepage: z.string().url().optional().or(z.literal('')),
  license: z.string().default('MIT'),
  entry: z.string().default('index'),
  dependencies: z.object({
    required: z.array(z.string()).default([]),
    optional: z.array(z.string()).default([]),
  }).default({ required: [], optional: [] }),
  permissions: z.array(z.object({
    key: z.string().min(1).regex(/^[a-z][a-z0-9_.-]*$/),
    description: z.string().min(1),
  })).default([]),
  menus: z.array(menuMetadataSchema).default([]),
  widgets: z.array(widgetMetadataSchema).default([]),
  reports: z.array(reportMetadataSchema).default([]),
  developerPages: z.array(developerPageMetadataSchema).default([]),
  healthChecks: z.array(healthCheckMetadataSchema).default([]),
  routes: z.array(routeMetadataSchema).default([]),
  settings: settingsMetadataSchema.optional(),
  qa: qaMetadataSchema,
  minimumCoreVersion: z.string().default('1.0.0'),
  /** Stable modules are visible in admin; preview modules require SHOW_PREVIEW_MODULES=1 */
  productionReady: z.boolean().default(false),
  preview: z.boolean().optional(),
  apiVersion: z.string().regex(/^\d+(?:\.\d+)?$/).default(MODULE_API_VERSION),
  signature: z.object({
    algorithm: z.literal('ed25519'),
    keyId: z.string().min(1),
    value: z.string().min(1),
  }).optional(),
}).transform((manifest) => ({
  ...manifest,
  preview: manifest.preview ?? !manifest.productionReady,
}));

type ParsedModuleManifest = z.infer<typeof moduleManifestSchema>;
/** API version is optional for legacy manifests; parsing supplies the current default. */
export type ModuleManifest = Omit<ParsedModuleManifest, 'apiVersion'> & { apiVersion?: string };

export function isPreviewModule(manifest: Pick<ModuleManifest, 'preview'>): boolean {
  return manifest.preview === true;
}

export function shouldLoadPreviewModules(): boolean {
  return process.env.SHOW_PREVIEW_MODULES === '1';
}

export function filterDiscoveredManifests(manifests: ModuleManifest[]): ModuleManifest[] {
  if (shouldLoadPreviewModules()) return manifests;
  return manifests.filter((manifest) => !isPreviewModule(manifest));
}

function canonicalize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== 'signature')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalize(item)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

export function verifyPluginSignature(manifest: ModuleManifest): boolean {
  if (!manifest.signature) return false;
  try {
    const keys = JSON.parse(config.pluginTrust.trustKeys) as Record<string, string>;
    const publicKey = keys[manifest.signature.keyId];
    if (!publicKey) return false;
    return crypto.verify(
      null,
      Buffer.from(canonicalize(manifest), 'utf8'),
      publicKey,
      Buffer.from(manifest.signature.value, 'base64')
    );
  } catch {
    return false;
  }
}

export function isTrustedPlugin(manifest: ModuleManifest): boolean {
  return config.pluginTrust.allowlist.includes(manifest.id) && verifyPluginSignature(manifest);
}

export function validateManifestContract(manifest: ModuleManifest): string | null {
  const apiVersion = manifest.apiVersion ?? MODULE_API_VERSION;
  if (apiVersion.split('.')[0] !== MODULE_API_VERSION) {
    return `nicht unterstützte Plugin-API-Version ${apiVersion}`;
  }
  const permissions = new Set(manifest.permissions.map((permission) => permission.key));
  if (permissions.size !== manifest.permissions.length) {
    return 'doppelte Berechtigungsdefinition';
  }
  const references = [
    ...manifest.menus.map((item) => item.requiredPermission),
    ...manifest.reports.map((item) => item.requiredPermission),
    ...manifest.developerPages.map((item) => item.requiredPermission),
    manifest.settings?.permission,
  ].filter((permission): permission is string => Boolean(permission));
  const undeclared = references.find((permission) => !permissions.has(permission));
  return undeclared ? `nicht deklarierte Berechtigung ${undeclared}` : null;
}

export type ModuleStatus =
  | 'AVAILABLE'
  | 'INSTALLED'
  | 'ENABLED'
  | 'DISABLED'
  | 'UPGRADING'
  | 'FAILED';

/** @deprecated Use ENABLED */
export type LegacyModuleStatus = 'ACTIVATED' | 'UNINSTALLED';

export const MODULE_STATUS_LABELS: Record<ModuleStatus, string> = {
  AVAILABLE: 'Verfügbar',
  INSTALLED: 'Installiert',
  ENABLED: 'Aktiviert',
  DISABLED: 'Deaktiviert',
  UPGRADING: 'Upgrade läuft',
  FAILED: 'Fehler',
};

export const CORE_VERSION = resolveAppVersion();
