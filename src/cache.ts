import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { Repository, getGithubTrending } from "./getGithubTrending";

const CACHE_DIRECTORY = join(__dirname, "cache");

function getFilename(date: Date) {
  const dateString = date.toISOString().split("T")[0];
  return join(CACHE_DIRECTORY, `${dateString}.json`);
}

async function cacheResult(repositories: Repository[]) {
  if (!existsSync(CACHE_DIRECTORY)) {
    console.log("Cache directory does not exists. Creating it.");
    await mkdir(CACHE_DIRECTORY, { recursive: true });
  }

  const filename = getFilename(new Date());
  const data = JSON.stringify(repositories);
  await writeFile(filename, data);
}

export async function getTodayIfNotExists() {
  const filename = getFilename(new Date());

  if (existsSync(filename)) {
    const data = await readFile(filename, "utf-8");
    return JSON.parse(data) as Repository[];
  }

  const result = await getGithubTrending("daily");
  await cacheResult(result);
  return result;
}
