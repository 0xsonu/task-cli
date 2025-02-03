#!/usr/bin/env node

// task-tracker.ts
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

interface Task {
  id: number;
  name: string;
  status: "done" | "not-done" | "in-progress";
  createdAt: Date;
}

const DATA_FILE = "tasks.json";
const filePath = join(process.cwd(), DATA_FILE);

// Helper functions
const readTasks = (): Task[] => {
  if (!existsSync(filePath)) return [];
  const data = readFileSync(filePath, "utf-8");
  return JSON.parse(data, (key, value) => {
    if (key === "createdAt") return new Date(value);
    return value;
  });
};

const writeTasks = (tasks: Task[]) => {
  writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

const getNewId = (tasks: Task[]): number => {
  return tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
};

// Command handlers
const addTask = (name: string) => {
  const tasks = readTasks();
  const newTask: Task = {
    id: getNewId(tasks),
    name,
    status: "not-done",
    createdAt: new Date(),
  };
  writeTasks([...tasks, newTask]);
  console.log(`Added task: ${newTask.id} - ${name}`);
};

const updateTask = (id: number, newName: string) => {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    console.error(`Task with ID ${id} not found`);
    process.exit(1);
  }

  tasks[taskIndex].name = newName;
  writeTasks(tasks);
  console.log(`Updated task ${id}`);
};

const deleteTask = (id: number) => {
  const tasks = readTasks();
  const filtered = tasks.filter((t) => t.id !== id);

  if (tasks.length === filtered.length) {
    console.error(`Task with ID ${id} not found`);
    process.exit(1);
  }

  writeTasks(filtered);
  console.log(`Deleted task ${id}`);
};

const updateStatus = (id: number, status: Task["status"]) => {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    console.error(`Task with ID ${id} not found`);
    process.exit(1);
  }

  tasks[taskIndex].status = status;
  writeTasks(tasks);
  console.log(`Updated task ${id} status to ${status}`);
};

const listTasks = (filter?: Task["status"] | "all") => {
  const tasks = readTasks();
  const filtered =
    filter && filter !== "all"
      ? tasks.filter((t) => t.status === filter)
      : tasks;

  if (filtered.length === 0) {
    console.log("No tasks found");
    return;
  }

  console.log("\nTasks:");
  filtered.forEach((task) => {
    console.log(
      `#${task.id} [${task.status.padEnd(11)}] ${
        task.name
      } (Created: ${task.createdAt.toLocaleDateString()})`
    );
  });
};

// CLI Argument parsing
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`Task Tracker CLI
Usage:
  add <task name>        Add new task
  update <id> <name>     Update task name
  delete <id>            Delete task
  status <id> <status>   Update task status (done/not-done/in-progress)
  list [filter]          List tasks (all/done/not-done/in-progress)
  
Examples:
  task-tracker add "Finish project"
  task-tracker status 3 in-progress
  task-tracker list done`);
  process.exit(0);
}

const [command, ...params] = args;

try {
  switch (command) {
    case "add":
      if (params.length < 1) throw new Error("Missing task name");
      addTask(params.join(" "));
      break;

    case "update":
      if (params.length < 2) throw new Error("Missing ID or new name");
      updateTask(Number(params[0]), params.slice(1).join(" "));
      break;

    case "delete":
      if (params.length < 1) throw new Error("Missing task ID");
      deleteTask(Number(params[0]));
      break;

    case "status":
      if (params.length < 2) throw new Error("Missing ID or status");
      if (!["done", "not-done", "in-progress"].includes(params[1])) {
        throw new Error("Invalid status. Use done/not-done/in-progress");
      }
      updateStatus(Number(params[0]), params[1] as Task["status"]);
      break;

    case "list":
      const filter = params[0] || "all";
      if (!["all", "done", "not-done", "in-progress"].includes(filter)) {
        throw new Error("Invalid filter. Use all/done/not-done/in-progress");
      }
      listTasks(filter as Task["status"] | "all");
      break;

    default:
      throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(`Error: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
