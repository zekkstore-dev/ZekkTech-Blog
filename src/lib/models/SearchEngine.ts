import { Post } from '@/types/post';

export interface ScoredPost extends Post {
  similarityScore?: number;
  highlightWords: string[];
}

/**
 * Model Mesin Pencari (Search Engine) untuk ZekkTech Blog
 * Standarisasi MVC (Model-View-Controller)
 * Menggunakan pendekatan Algoritma Information Retrieval: TF-IDF & Cosine Similarity
 */
export class SearchEngine {
  /**
   * Pembersihan teks dan tokenisasi karakter
   */
  private static tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 0);
  }

  /**
   * Menghitung nilai TF (Term Frequency)
   * Berapa kali sebuah kata muncul dalam satu dokumen / total kata dokumen
   */
  private static calculateTF(term: string, docTokens: string[]): number {
    if (docTokens.length === 0) return 0;
    const count = docTokens.filter((t) => t === term).length;
    return count / docTokens.length;
  }

  /**
   * Mengukur Jarak Vektor Cosine Similarity antara Kuari dan Dokumen
   */
  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] ** 2;
      normB += vecB[i] ** 2;
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Main Search Function
   * Mengolah dokumen, melakukan scoring, dan mengurutkan hasil kembalian
   */
  public static search(posts: Post[], query: string): ScoredPost[] {
    if (!query.trim()) {
      return posts.map(post => ({ ...post, similarityScore: 100, highlightWords: [] }));
    }

    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return posts.map(p => ({ ...p, similarityScore: 0, highlightWords: [] }));

    // pecahin data jadi teks (vocab), title dibikin dobel biar pencariannya lebih ngena ke judul
    const documents = posts.map(post => {
      const text = `${post.title} ${post.title} ${post.category}`; // Sengaja judul diboboti 2x lipat
      return this.tokenize(text);
    });

    const totalDocs = documents.length;

    // kumpulin semua kata unik dari artikel
    const vocabulary = new Set<string>();
    documents.forEach(doc => doc.forEach(word => vocabulary.add(word)));
    queryTokens.forEach(word => vocabulary.add(word));
    
    const vocabArray = Array.from(vocabulary);

    // itung angka langkanya (IDF), makin jarang muncul makin gede valuenya
    const idfCache: Record<string, number> = {};
    vocabArray.forEach(term => {
      const docsContainingTerm = documents.filter(doc => doc.includes(term)).length;
      // laplace smoothing dikit biar ga kena Infinity kalo pembaginya 0
      idfCache[term] = Math.log10(totalDocs / (1 + docsContainingTerm)) + 1; 
    });

    // jadikan query vektor matematika
    const queryVector = vocabArray.map(term => {
      const tf = this.calculateTF(term, queryTokens);
      return tf * idfCache[term];
    });

    // adu vektor query vs isi artikel pake Cosine Similarity
    const scoredPosts: ScoredPost[] = posts.map((post, index) => {
      const docTokens = documents[index];
      const docVector = vocabArray.map(term => {
        const tf = this.calculateTF(term, docTokens);
        return tf * idfCache[term];
      });

      const similarity = this.cosineSimilarity(queryVector, docVector);
      const similarityPercentage = Math.round(similarity * 100);

      return {
        ...post,
        similarityScore: similarityPercentage,
        // Kata yang cocok dan patut di-highlight
        highlightWords: queryTokens
      };
    });

    // nah ini difilter, buang yang score-nya 0 alias ga nyambung blaaasss, sisanya urutin
    return scoredPosts
      .filter(post => (post.similarityScore || 0) > 0)
      .sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0));
  }
}
