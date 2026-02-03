#!/usr/bin/env node
import { copyFileSync, mkdirSync, existsSync, cpSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const sourceSchema = join(projectRoot, 'prisma', 'schema.prisma');
const targetDir = join(projectRoot, 'src', 'generated');
const targetSchema = join(targetDir, 'schema.prisma');

try {
  // Ensure target directory exists
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  // Copy schema.prisma to src/generated/
  copyFileSync(sourceSchema, targetSchema);
  console.log('✅ Copied schema.prisma to src/generated/');
} catch (error) {
  console.error('❌ Error copying schema.prisma:', error.message);
  process.exit(1);
}

// Copy Prisma client output from src/generated/prisma -> dist/generated/prisma
// Needed because Prisma generates JS files that tsc does not copy to dist automatically.
const srcClientDir = join(projectRoot, 'src', 'generated', 'prisma');
const distClientDir = join(projectRoot, 'dist', 'generated', 'prisma');

try {
  if (!existsSync(srcClientDir)) {
    console.warn(`Prisma client directory not found, skipping copy: ${srcClientDir}`);
  } else {
    mkdirSync(distClientDir, { recursive: true });
    cpSync(srcClientDir, distClientDir, { recursive: true });
    console.log('Copied Prisma client to dist/generated/prisma');
  }
} catch (error) {
  console.error('Error copying Prisma client to dist:', error.message);
  process.exit(1);
}
