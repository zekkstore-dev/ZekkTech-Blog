import ArticleCard from './ArticleCard';
import SectionHeader from './SectionHeader';
import type { Post } from '@/types/post';

interface ArticleSectionProps {
  title: string;
  posts: Post[];
  linkHref?: string;
}

export default function ArticleSection({ title, posts, linkHref = '#' }: ArticleSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="w-full py-8 sm:py-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        <SectionHeader
          title={title}
          linkText="Semua Artikel"
          linkHref={linkHref}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {posts.slice(0, 4).map((post) => (
            <ArticleCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              coverUrl={post.cover_url}
              authorName={post.author_name}
              createdAt={post.created_at}
              readingTime={post.reading_time}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
