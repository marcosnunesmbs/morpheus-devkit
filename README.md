# @anthropic/devkit

Shared DevKit tools for Morpheus and Smith - provides a comprehensive set of tools for AI agents.

## Installation

```bash
npm install @anthropic/devkit
```

## Usage

### Basic Usage

```typescript
import { buildDevKit } from '@anthropic/devkit';
import type { ToolContext } from '@anthropic/devkit';

const context: ToolContext = {
  working_dir: '/path/to/workspace',
  allowed_commands: [], // empty = allow all
  sandbox_dir: '/path/to/sandbox',
  readonly_mode: false,
  enable_filesystem: true,
  enable_shell: true,
  enable_git: true,
  enable_network: true,
};

const tools = buildDevKit(context);
// tools is an array of LangChain StructuredTool instances
```

### Individual Tool Factories

```typescript
import { createFilesystemTools, createShellTools } from '@anthropic/devkit';
import type { ToolContext } from '@anthropic/devkit';

const ctx: ToolContext = {
  working_dir: '/workspace',
  allowed_commands: ['ls', 'cat', 'grep'],
};

const fsTools = createFilesystemTools(ctx);
const shellTools = createShellTools(ctx);
```

## Available Tool Categories

| Category | Tools | Description |
|----------|-------|-------------|
| **filesystem** | `read_file`, `write_file`, `list_dir`, `create_dir`, `delete_file`, `move_file`, `search_files`, `find_replace` | File system operations |
| **shell** | `run_command` | Execute shell commands |
| **processes** | `list_processes`, `kill_process` | Process management |
| **network** | `http_request`, `ping`, `dns_lookup`, `download_file` | Network operations |
| **git** | `git_status`, `git_diff`, `git_log`, `git_commit`, `git_push`, `git_branch` | Git operations |
| **packages** | `npm_install`, `pip_install`, `list_packages` | Package management |
| **system** | `system_info`, `env_vars`, `disk_usage` | System information |
| **browser** | `browser_navigate`, `browser_click`, `browser_fill`, `browser_search`, `browser_fetch_content`, `browser_screenshot` | Browser automation |

## Security Features

### Sandbox Enforcement

All file and shell operations are validated against `sandbox_dir`:

```typescript
const ctx: ToolContext = {
  sandbox_dir: '/safe/directory',
  // All paths must be within /safe/directory
};
```

### Read-Only Mode

Block all write/delete operations:

```typescript
const ctx: ToolContext = {
  readonly_mode: true,
  // Only read operations allowed
};
```

### Command Allowlist

Restrict which shell commands can be executed:

```typescript
const ctx: ToolContext = {
  allowed_commands: ['ls', 'cat', 'grep', 'find'],
  // Only these commands can be run
};
```

## Creating Custom Tools

```typescript
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { registerToolFactory } from '@anthropic/devkit';
import type { ToolContext } from '@anthropic/devkit';

function createMyTools(ctx: ToolContext) {
  return [
    tool(
      async ({ input }) => {
        // Your tool logic here
        return JSON.stringify({ success: true, result: input });
      },
      {
        name: 'my_custom_tool',
        description: 'Does something useful',
        schema: z.object({
          input: z.string().describe('The input to process'),
        }),
      }
    ),
  ];
}

// Register with the DevKit registry
registerToolFactory(createMyTools, 'system');
```

## License

MIT
