import { getTodayIfNotExists } from "./cache";
import { evaluateRepositories } from "./detectAI";

(async () => {
  console.log("Getting repositories from GitHub...");
  const repos = await getTodayIfNotExists();
  console.log(`Found ${repos.length} repositories.`);

  console.log("Evaluating repositories...");
  const evaluation = await evaluateRepositories(repos);
  const amountOfAi = evaluation.filter((e) => e).length;
  const amountOfNonAi = evaluation.filter((e) => !e).length;

  console.log("Done! Here are the results:");
  console.log(`Amount of AI: ${amountOfAi}`);
  console.log(`Amount of non-AI: ${amountOfNonAi}`);
})();
