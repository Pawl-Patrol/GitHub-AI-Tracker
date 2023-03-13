import axios from "axios";
import * as cheerio from "cheerio";

export interface Repository {
  author: string;
  name: string;
  href: string;
  description: string | null;
  language: string;
  stars: number;
  forks: number;
  starsInPeriod: number | null;
}

// credit: https://www.npmjs.com/package/@attachments/github-trending
export async function getGithubTrending(
  period: "daily" | "weekly" | "monthly"
) {
  const response = await axios.get(
    `https://github.com/trending?since=${period}`,
    {
      headers: {
        Accept: "text/html",
      },
    }
  );

  const $ = cheerio.load(response.data);
  const repositories: Repository[] = [];

  $("article").each((index, repo) => {
    const title = $(repo).find("h1.h3 a").text().replace(/\s/g, "");

    const author = title.split("/")[0];
    const name = title.split("/")[1];

    const starLink = `/${title.replace(/ /g, "")}/stargazers`;
    const forkLink = `/${title.replace(/ /g, "")}/network/members.${name}`;

    let text: string;
    if (period === "daily") text = "stars today";
    else if (period === "weekly") text = "stars this week";
    else text = "stars this month";

    const indexRepo: Repository = {
      author,
      name,
      href: `https://github.com/${author}/${name}`,
      description: $(repo).find("p").text().trim() || null,
      language: $(repo).find("[itemprop=programmingLanguage]").text().trim(),
      stars: parseInt(
        $(repo).find(`[href="${starLink}"]`).text().trim().replace(",", "") ||
          "0",
        0
      ),
      forks: parseInt(
        $(repo).find(`[href="${forkLink}"]`).text().trim().replace(",", "") ||
          "0",
        0
      ),
      starsInPeriod: parseInt(
        $(repo)
          .find(`span.float-sm-right:contains('${text}')`)
          .text()
          .trim()
          .replace(text, "")
          .replace(",", "") || "0",
        0
      ),
    };

    repositories.push(indexRepo);
  });
  return repositories;
}
