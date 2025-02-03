# Task Tracker CLI

A command-line task manager built with TypeScript that helps you track your tasks with status updates and persistent storage.

## Features

- ✅ Add new tasks
- ✏️ Update existing tasks
- 🗑️ Delete tasks
- 📝 List tasks with filters (all/done/not-done/in-progress)
- 📊 Track task status (done/not-done/in-progress)
- 💾 Persistent storage in JSON format

## Installation

### Prerequisites

- Node.js v18 or higher
- npm

### Local Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/task-tracker-cli.git
cd task-tracker-cli
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Link globally for local development:

```bash
npm link
```

## Usage

### Basic Commands

```bash
# Add a new task
task-cli add "Finish project documentation"

# Update a task
task-cli update 1 "Complete project documentation"

# Delete a task
task-cli delete 3

# Mark task as in-progress
task-cli status 2 in-progress

# List all tasks
task-cli list

# List done tasks
task-cli list done
```

### Command Reference

| Command                         | Description                                    |
| ------------------------------- | ---------------------------------------------- |
| `add <task description>`        | Add a new task                                 |
| `update <id> <new description>` | Update existing task description               |
| `delete <id>`                   | Delete a task                                  |
| `status <id> <status>`          | Update task status (done/not-done/in-progress) |
| `list [filter]`                 | List tasks (all/done/not-done/in-progress)     |

## Data Storage

Tasks are stored in a `tasks.json` file in your current working directory. Example structure:

```json
[
  {
    "id": 1,
    "name": "Finish project documentation",
    "status": "in-progress",
    "createdAt": "2024-02-20T12:34:56.789Z"
  }
]
```

## Development

### Tech Stack

- TypeScript
- Node.js
- Native FS module

### Build Commands

```bash
# Compile TypeScript
npm run build

# Watch for changes
npm run dev

# Run tests (if available)
npm test
```

## Troubleshooting

### Common Issues

1. **Command not found**:

   - Ensure you've run `npm link` after installation
   - Verify global npm binaries are in your PATH

2. **File permission errors**:

   ```bash
   chmod +x dist/main.js
   ```

3. **JSON parsing errors**:
   Delete corrupted `tasks.json` file and restart

4. **TypeScript compilation errors**:
   ```bash
   rm -rf dist/ && npm run build
   ```
