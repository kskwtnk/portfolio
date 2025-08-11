import type { Loader } from "astro/loaders";
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/about" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summaryKeywords: z.string().array(),
      summaryImage: image().optional(),
      summaryHeading: z.string().optional(),
    }),
});

const worksCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/works" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      cover: image(),
      keywords: z.string().array(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date().optional(),
      excerpt: z.string(),
    }),
});

const talksCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/content/talks" }),
  schema: z.array(
    z.object({
      id: z.string(),
      url: z.string().url().optional(),
      date: z.coerce.date(),
    }),
  ),
});

// Qiita記事取得用定数
const QIITA_API_LIMIT = 5;
const QIITA_API_TIMEOUT = 10000;
const QIITA_USERNAME = "kskwtnk";

// Qiita APIからデータを取得するヘルパー関数
async function fetchQiitaArticles(
  username: string,
  perPage: number = QIITA_API_LIMIT,
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), QIITA_API_TIMEOUT);

  try {
    const response = await fetch(
      `https://qiita.com/api/v2/users/${username}/items?page=1&per_page=${perPage}`,
      {
        signal: controller.signal,
        headers: { "User-Agent": "Portfolio-Site/1.0" },
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Qiita API returned ${response.status}: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Qiita API request timed out");
    }
    throw error;
  }
}

// Qiita記事カスタムローダー
function qiitaArticlesLoader(username: string = QIITA_USERNAME): Loader {
  return {
    name: "qiita-loader",
    load: async ({ store, logger, parseData }) => {
      let articles = [];

      try {
        articles = await fetchQiitaArticles(username);
        logger.info(`Successfully fetched ${articles.length} Qiita articles`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          logger.error(`Qiita API fetch failed: ${error.message}`);
          // エラー時は空配列を返し、UIで「記事の取得に失敗しました。」を表示する
          articles = [];
        }
      }

      for (const article of articles) {
        try {
          const id = article.id;
          const articleData = {
            title: article.title || "Untitled",
            url: article.url || "",
            created_at: article.created_at || new Date().toISOString(),
          };

          const data = await parseData({ id, data: articleData });

          store.set({ id, data });
        } catch (parseError: unknown) {
          if (parseError instanceof Error) {
            logger.warn(
              `Failed to parse article ${article.id}: ${parseError.message}`,
            );
          }
        }
      }

      logger.info(`Successfully loaded ${articles.length} Qiita articles`);
    },
  };
}

const qiitaArticlesCollection = defineCollection({
  loader: qiitaArticlesLoader(QIITA_USERNAME),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    created_at: z.string(),
  }),
});

export const collections = {
  about: aboutCollection,
  works: worksCollection,
  talks: talksCollection,
  "qiita-articles": qiitaArticlesCollection,
};
