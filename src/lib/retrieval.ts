import { knowledgeArticles } from "@/data/seed";
import type { KnowledgeArticle, RetrievedArticle, Ticket } from "@/lib/types";

function tokenize(input: string): Set<string> {
  return new Set(
    input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2),
  );
}

export function retrieveArticles(
  ticket: Ticket,
  articles: KnowledgeArticle[] = knowledgeArticles,
  limit = 3,
): RetrievedArticle[] {
  const ticketTerms = tokenize(`${ticket.subject} ${ticket.body} ${ticket.categoryHint}`);

  return articles
    .map((article) => {
      const keywordMatches = article.keywords.filter((keyword) => ticketTerms.has(keyword.toLowerCase())).length;
      const categoryMatch = article.category === ticket.categoryHint ? 4 : 0;
      const score = keywordMatches + categoryMatch;
      const relevance = Math.min(99, 42 + score * 9);
      return {
        ...article,
        score,
        relevance,
        excerpt: article.content,
      };
    })
    .filter(
      (article) =>
        article.category === ticket.categoryHint ||
        (article.category === "General" && article.score >= 2),
    )
    .sort((a, b) => b.score - a.score || b.relevance - a.relevance)
    .slice(0, limit)
    .map((article) => ({
      id: article.id,
      title: article.title,
      category: article.category,
      content: article.content,
      troubleshootingSteps: article.troubleshootingSteps,
      escalationCriteria: article.escalationCriteria,
      lastUpdated: article.lastUpdated,
      keywords: article.keywords,
      relevance: article.relevance,
      excerpt: article.excerpt,
    }));
}
