import path from 'path';
import { MAX_OUTPUT_BYTES } from './types.js';

/**
 * Truncates a string to MAX_OUTPUT_BYTES (50 KB) if needed.
 * Returns a UTF-8-safe truncation with a note when truncated.
 */
export function truncateOutput(output: string): string {
  const bytes = Buffer.byteLength(output, 'utf8');
  if (bytes <= MAX_OUTPUT_BYTES) return output;

  const truncated = Buffer.from(output).subarray(0, MAX_OUTPUT_BYTES).toString('utf8');
  return truncated + `\n\n[OUTPUT TRUNCATED: ${bytes} bytes total, showing first ${MAX_OUTPUT_BYTES} bytes]`;
}

/**
 * Returns true if filePath is inside dir (or equal to dir).
 * Both paths are resolved before comparison.
 */
export function isWithinDir(filePath: string, dir: string): boolean {
  const resolved = path.resolve(filePath);
  const resolvedDir = path.resolve(dir);
  return resolved === resolvedDir || resolved.startsWith(resolvedDir + path.sep);
}

/**
 * Returns true if filePath is allowed: either within sandbox_dir
 * or within any of the allowed_paths.
 * Empty allowed_paths = no additional paths allowed (only sandbox_dir if set).
 */
export function isPathAllowed(filePath: string, allowedPaths: string[], sandboxDir?: string): boolean {
  // If sandbox_dir is set, check it first
  if (sandboxDir && isWithinDir(filePath, sandboxDir)) {
    return true;
  }

  // Check additional allowed paths
  for (const allowedPath of allowedPaths) {
    if (isWithinDir(filePath, allowedPath)) {
      return true;
    }
  }

  // No restrictions if both sandbox_dir and allowed_paths are empty
  return !sandboxDir && allowedPaths.length === 0;
}

/**
 * Extracts the binary base name from a command string.
 * Handles full paths (/usr/bin/node, C:\bin\node.exe) and plain names.
 */
export function extractBinaryName(command: string): string {
  // Take first token (before any space), then get the basename, strip extension
  const firstToken = command.split(/\s+/)[0] ?? command;
  const base = path.basename(firstToken);
  return base.replace(/\.(exe|cmd|bat|sh|ps1)$/i, '').toLowerCase();
}

/**
 * Checks if a command is allowed based on the allowlist.
 * Empty allowlist means ALL commands are allowed (Merovingian mode).
 */
export function isCommandAllowed(command: string, allowedCommands: string[]): boolean {
  if (allowedCommands.length === 0) return true;

  const binary = extractBinaryName(command);
  return allowedCommands.some(allowed => {
    const allowedBinary = extractBinaryName(allowed);
    return allowedBinary === binary;
  });
}
