import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import rawPosts from "src/data/posts.json";

export async function generateStaticParams() {
  return rawPosts.map((post) => ({
    slug: post.slug,
  }));
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = rawPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const categoryName =
    post.categories && post.categories.length > 0
      ? post.categories[0].name
      : "General";

  const localImageUrl =
    post.featured_image && post.featured_image.file
      ? `/wp-content/uploads/${post.featured_image.file}`
      : null;

  // Filter comments
  const topLevelComments = post.comments.filter((c) => c.parent === 0);
  const replies = post.comments.filter((c) => c.parent !== 0);

  return (
    <article className="animate-fade-in">
      {/* Post Header */}
      <header className="post-detail-header">
        <div className="container">
          <div className="post-detail-meta">
            <Link href={`/?category=${encodeURIComponent(categoryName)}`} style={{ color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "600" }}>
              {categoryName}
            </Link>
            <span>&bull;</span>
            <span>{formatDate(post.date)}</span>
          </div>
          <h1 className="post-detail-title">{post.title}</h1>
          <div className="card-author" style={{ justifyContent: "center" }}>
            <div className="card-author-avatar">J</div>
            <span>Written by Jones</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {localImageUrl && (
        <section className="container">
          <div className="post-detail-image-wrapper">
            <Image
              src={localImageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        </section>
      )}

      {/* Post Content */}
      <section className="container post-detail-body">
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ marginTop: "3rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/?search=${encodeURIComponent(tag.name)}`}
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  padding: "0.25rem 0.75rem",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "9999px",
                  color: "var(--text-secondary)",
                  display: "inline-block",
                  transition: "all 0.2s ease"
                }}
                className="tag-badge"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Comments Thread */}
      <section className="comments-section">
        <div className="container">
          <h2 className="comments-title">
            Discussion ({post.comments.length})
          </h2>
          {post.comments.length > 0 ? (
            <ul className="comments-list">
              {topLevelComments.map((comment) => {
                const commentReplies = replies.filter((r) => r.parent === comment.id);
                return (
                  <li key={comment.id} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="comment-card glass-panel">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-date">{formatDate(comment.date)}</span>
                      </div>
                      <p
                        className="comment-content"
                        dangerouslySetInnerHTML={{ __html: comment.content }}
                      />
                    </div>
                    {/* Replies */}
                    {commentReplies.map((reply) => (
                      <div key={reply.id} className="comment-card reply glass-panel">
                        <div className="comment-header">
                          <span className="comment-author">{reply.author}</span>
                          <span className="comment-date">{formatDate(reply.date)}</span>
                        </div>
                        <p
                          className="comment-content"
                          dangerouslySetInnerHTML={{ __html: reply.content }}
                        />
                      </div>
                    ))}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center text-muted" style={{ padding: "2rem 0" }}>
              No comments yet on this article.
            </p>
          )}
        </div>
      </section>
    </article>
  );
}
