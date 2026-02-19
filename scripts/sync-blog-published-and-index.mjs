#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const BLOG_DIR = path.join(process.cwd(), "50-Blog");
const INDEX_FILE_NAME = "00-블로그-인덱스.md";
const INDEX_PATH = path.join(BLOG_DIR, INDEX_FILE_NAME);

const DATE_KEYS = ["published", "pubDatetime", "date", "created", "created_at"];

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const toIsoDate = (value) => {
  if (!value) return null;
  const sanitized = value.replace(/^["']|["']$/g, "").trim();
  if (!sanitized) return null;

  const dateFromIso = new Date(sanitized);
  if (!Number.isNaN(dateFromIso.getTime())) {
    return dateFromIso.toISOString();
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(sanitized)) {
    const dateOnly = new Date(`${sanitized}T00:00:00.000Z`);
    if (!Number.isNaN(dateOnly.getTime())) {
      return dateOnly.toISOString();
    }
  }

  return null;
};

const getLineValue = (frontmatter, key) => {
  const keyPattern = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = frontmatter.match(new RegExp(`^${keyPattern}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : null;
};

const getGitCreatedDate = (filePath) => {
  const result = spawnSync(
    "git",
    ["log", "--diff-filter=A", "--follow", "--format=%cI", "--", filePath],
    { encoding: "utf8" }
  );

  if (result.status !== 0) return null;
  const firstLine = result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)[0];

  return toIsoDate(firstLine);
};

const escapeMarkdownText = (text) =>
  text.replace(/\\/g, "\\\\").replace(/\[/g, "\\[").replace(/\]/g, "\\]");

const detectEol = (content) => (content.includes("\r\n") ? "\r\n" : "\n");

if (!fs.existsSync(BLOG_DIR)) {
  console.error(`Blog directory not found: ${BLOG_DIR}`);
  process.exit(1);
}

const files = fs
  .readdirSync(BLOG_DIR)
  .filter((fileName) => fileName.endsWith(".md"))
  .filter((fileName) => fileName !== INDEX_FILE_NAME)
  .sort((a, b) => a.localeCompare(b, "ko"));

let updatedCount = 0;
let insertedCount = 0;
const posts = [];

for (const fileName of files) {
  const filePath = path.join(BLOG_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const eol = detectEol(raw);
  const frontmatterMatch = raw.match(FRONTMATTER_RE);

  const fallbackDate =
    getGitCreatedDate(filePath) ?? fs.statSync(filePath).mtime.toISOString();

  if (!frontmatterMatch) {
    const titleFromName = path.basename(fileName, ".md");
    const nextContent = [
      "---",
      `title: "${titleFromName.replace(/"/g, '\\"')}"`,
      `published: "${fallbackDate}"`,
      "---",
      "",
      raw.trimStart(),
      "",
    ].join(eol);

    fs.writeFileSync(filePath, nextContent, "utf8");
    insertedCount += 1;
    updatedCount += 1;

    posts.push({
      fileName,
      title: titleFromName,
      published: fallbackDate,
    });
    continue;
  }

  const frontmatter = frontmatterMatch[1];
  const body = raw.slice(frontmatterMatch[0].length);

  let normalizedPublished = null;
  for (const key of DATE_KEYS) {
    const value = getLineValue(frontmatter, key);
    const normalized = toIsoDate(value);
    if (normalized) {
      normalizedPublished = normalized;
      break;
    }
  }

  if (!normalizedPublished) {
    normalizedPublished = fallbackDate;
  }

  const titleRaw = getLineValue(frontmatter, "title");
  const title = titleRaw
    ? titleRaw.replace(/^["']|["']$/g, "").trim()
    : path.basename(fileName, ".md");

  const publishedLine = `published: "${normalizedPublished}"`;
  let nextFrontmatter = frontmatter;

  if (/^published:\s*.+$/m.test(frontmatter)) {
    nextFrontmatter = frontmatter.replace(/^published:\s*.+$/m, publishedLine);
  } else {
    const lines = frontmatter.split(/\r?\n/);
    const tagsIndex = lines.findIndex((line) => /^\s*tags:\s*$/.test(line));
    const insertIndex = tagsIndex === -1 ? lines.length : tagsIndex;
    lines.splice(insertIndex, 0, publishedLine);
    nextFrontmatter = lines.join(eol);
    insertedCount += 1;
  }

  const nextRaw = `---${eol}${nextFrontmatter}${eol}---${eol}${body}`;
  if (nextRaw !== raw) {
    fs.writeFileSync(filePath, nextRaw, "utf8");
    updatedCount += 1;
  }

  posts.push({
    fileName,
    title,
    published: normalizedPublished,
  });
}

posts.sort((a, b) => {
  const diff = Date.parse(b.published) - Date.parse(a.published);
  if (diff !== 0) return diff;
  return a.fileName.localeCompare(b.fileName, "ko");
});

const generatedAt = new Date().toISOString();
const indexLines = [
  "---",
  'title: "50-Blog 글 인덱스"',
  'description: "published 날짜 기준으로 정렬된 글 목록"',
  `generatedAt: "${generatedAt}"`,
  'sortBy: "published desc"',
  "---",
  "",
  "# 50-Blog 글 목록",
  "",
  "`published` 날짜 기준 최신순입니다.",
  `총 ${posts.length}개 글.`,
  "",
  "## 최신순 목록",
  ...posts.map((post) => {
    const dateLabel = post.published.slice(0, 10);
    const href = `./${encodeURI(post.fileName)}`;
    const title = escapeMarkdownText(post.title);
    return `- ${dateLabel} · [${title}](${href})`;
  }),
  "",
  "## 재생성",
  "- `node scripts/sync-blog-published-and-index.mjs`",
  "",
];

fs.writeFileSync(INDEX_PATH, indexLines.join("\n"), "utf8");

console.log(`Updated markdown files: ${updatedCount}`);
console.log(`Inserted published field: ${insertedCount}`);
console.log(`Generated index: ${path.relative(process.cwd(), INDEX_PATH)}`);
