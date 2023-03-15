import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import { Repository } from "./getGithubTrending";

config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function openaiPrompt(input: string) {
  const completion = openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
  });
  return completion;
}

export async function evaluateRepositories(repositories: Repository[]) {
  const mapped = repositories.map(
    (repo, index) =>
      `\n${index + 1}. ${repo.name} - ${repo.description ?? "no description"}`
  );
  const prompt = `This is a list of repositories from Github trending. They are all in the form of "name - description". For each repository, please tell me how likely it is, that the repository is about artificial intelligence. For every repository in the list, output "true" if it is likely and "false" otherwise. The input is:${mapped}`;
  const result = await openaiPrompt(prompt);
  const message = result.data.choices[0].message?.content;
  if (!message) {
    throw new Error("No message");
  }
  const matches = message.match(/true|false/gi);
  const results = matches?.map((match) => match.toLowerCase() === "true");
  return results ?? [];
}
