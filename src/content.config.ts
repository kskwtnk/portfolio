import { defineCollection, z } from "astro:content";
import type { Loader } from "astro/loaders";
import { glob } from "astro/loaders";

const aboutCollection = defineCollection({
  loader: glob({ base: "./src/content/about", pattern: "**/[^_]*.md" }),
  schema: ({ image }) =>
    z.object({
      summaryHeading: z.string().optional(),
      summaryImage: image().optional(),
      summaryKeywords: z.string().array(),
      title: z.string(),
    }),
});

const worksCollection = defineCollection({
  loader: glob({ base: "./src/content/works", pattern: "**/[^_]*.md" }),
  schema: ({ image }) =>
    z.object({
      cover: image(),
      endDate: z.coerce.date().optional(),
      excerpt: z.string(),
      keywords: z.string().array(),
      startDate: z.coerce.date(),
      title: z.string(),
    }),
});

const talksCollection = defineCollection({
  loader: glob({ base: "./src/content/talks", pattern: "**/[^_]*.json" }),
  schema: z.array(
    z.object({
      date: z.coerce.date(),
      id: z.string(),
      url: z.string().url().optional(),
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
        headers: { "User-Agent": "Portfolio-Site/1.0" },
        signal: controller.signal,
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
            created_at: article.created_at || new Date().toISOString(),
            title: article.title || "Untitled",
            url: article.url || "",
          };

          const data = await parseData({ data: articleData, id });

          store.set({ data, id });
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
    name: "qiita-loader",
  };
}

const qiitaArticlesCollection = defineCollection({
  loader: qiitaArticlesLoader(QIITA_USERNAME),
  schema: z.object({
    created_at: z.string(),
    title: z.string(),
    url: z.string().url(),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/[^_]*.md" }),
  schema: z.object({
    date: z.coerce.date(),
    excerpt: z.string(),
    title: z.string(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = {
  about: aboutCollection,
  blog: blogCollection,
  "qiita-articles": qiitaArticlesCollection,
  talks: talksCollection,
  works: worksCollection,
};
