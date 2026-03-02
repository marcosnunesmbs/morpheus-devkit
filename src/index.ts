/**
 * @anthropic/devkit - Shared DevKit tools for Morpheus and Smith
 * 
 * Provides a comprehensive set of tools for:
 * - File system operations
 * - Shell command execution
 * - Process management
 * - Network requests
 * - Git operations
 * - Package management
 * - System information
 * - Browser automation
 */

// Register all DevKit tool factories
// Import order matters: each import triggers registerToolFactory() as a side effect
import './tools/filesystem.js';
import './tools/shell.js';
import './tools/processes.js';
import './tools/network.js';
import './tools/git.js';
import './tools/packages.js';
import './tools/system.js';
import './tools/browser.js';

// ─── Core Exports ───────────────────────────────────────────────────────────

export { buildDevKit, registerToolFactory, getRegistry } from './registry.js';
export type { ToolContext, ToolResult } from './types.js';
export { MAX_OUTPUT_BYTES } from './types.js';
export { truncateOutput, isWithinDir, isCommandAllowed } from './utils.js';

// ─── Adapters ───────────────────────────────────────────────────────────────

export { ShellAdapter } from './adapters/shell.js';

// ─── Tool Factories (for individual use) ────────────────────────────────────

export { createFilesystemTools } from './tools/filesystem.js';
export { createShellTools } from './tools/shell.js';
export { createProcessTools } from './tools/processes.js';
export { createNetworkTools } from './tools/network.js';
export { createGitTools } from './tools/git.js';
export { createPackageTools } from './tools/packages.js';
export { createSystemTools } from './tools/system.js';
export { createBrowserTools } from './tools/browser.js';
