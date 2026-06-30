"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import rawPosts from "src/data/posts.json";

function cleanExcerpt(content, excerpt) {
  if (excerpt && excerpt.trim()) {
    // Strip HTML from excerpt
    return excerpt.replace(/<[^>]*>/g, "").trim();
  }
  // Strip HTML from content and truncate
  const stripped = content.replace(/<[^>]*>/g, "").trim();
  if (stripped.length > 160) {
    return stripped.slice(0, 157) + "...";
  }
  return stripped;
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      const search = params.get("search");
      if (cat) {
        setSelectedCategory(cat);
      }
      if (search) {
        setSearchQuery(search);
      }
    }
  }, []);

  // Sort posts by date descending
  const sortedPosts = useMemo(() => {
    return [...rawPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  // Extract all categories
  const categories = useMemo(() => {
    const cats = new Set();
    rawPosts.forEach((post) => {
      if (post.categories) {
        post.categories.forEach((cat) => {
          if (cat && cat.name) cats.add(cat.name);
        });
      }
    });
    return ["All", ...Array.from(cats).sort()];
  }, []);

  // Count posts per category
  const categoryCounts = useMemo(() => {
    const counts = { All: rawPosts.length };
    rawPosts.forEach((post) => {
      if (post.categories) {
        post.categories.forEach((cat) => {
          if (cat && cat.name) {
            counts[cat.name] = (counts[cat.name] || 0) + 1;
          }
        });
      }
    });
    return counts;
  }, []);

  // Filter posts based on active category and search query
  const filteredPosts = useMemo(() => {
    return sortedPosts.filter((post) => {
      // Category Match
      const matchesCategory =
        selectedCategory === "All" ||
        (post.categories &&
          post.categories.some((cat) => cat.name === selectedCategory));

      // Search Match
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        (post.categories && post.categories.some((cat) => cat.name.toLowerCase().includes(searchLower))) ||
        (post.tags && post.tags.some((tag) => tag.name.toLowerCase().includes(searchLower)));

      return matchesCategory && matchesSearch;
    });
  }, [sortedPosts, selectedCategory, searchQuery]);

  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const loadMore = (e) => {
    if (e) {
      e.preventDefault();
    }
    setVisibleCount((prev) => prev + 12);
  };

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    setVisibleCount(12); // Reset page count on filter change
    
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (catName === "All") {
        params.delete("category");
      } else {
        params.set("category", catName);
      }
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.pushState(null, "", newUrl);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setVisibleCount(12); // Reset page count on search change
    
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (!value) {
        params.delete("search");
      } else {
        params.set("search", value);
      }
      const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
      window.history.pushState(null, "", newUrl);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-badge">Reflective Snippets</div>
          <h1 className="hero-title">Comrades</h1>
          <p className="hero-subtitle">
            Exploring stories, reflections, affairs of the heart, and snapshots of the mind. Reborn from the cPanel archive.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="container search-filter-section">
        <div className="search-container">
          <span className="search-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <ul className="category-list">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat} ({categoryCounts[cat] || 0})
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Articles Grid */}
      <section className="container posts-grid-section">
        {displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 grid-cols-sm-2 grid-cols-md-3">
            {displayedPosts.map((post) => {
              const categoryName =
                post.categories && post.categories.length > 0
                  ? post.categories[0].name
                  : "General";

              const localImageUrl =
                post.featured_image && post.featured_image.file
                  ? `/wp-content/uploads/${post.featured_image.file}`
                  : null;

              return (
                <article key={post.id} className="post-card glass-panel">
                  <Link href={`/blog/${post.slug}`} className="card-image-link" style={{ display: "block", position: "relative", width: "100%" }}>
                    <div className="card-image-wrapper">
                      {localImageUrl ? (
                        <Image
                          src={localImageUrl}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="card-image"
                          priority={false}
                        />
                      ) : (
                        <div className="card-placeholder-gradient">
                          <svg
                            className="card-placeholder-logo"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                            <line x1="4" y1="22" x2="4" y2="15"></line>
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="card-content">
                    <div className="card-meta">
                      <span className="card-category">{categoryName}</span>
                      <span>&bull;</span>
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <h2 className="card-title">
                      <Link href={`/blog/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {post.title}
                      </Link>
                    </h2>
                    <p className="card-excerpt">
                      {cleanExcerpt(post.content, post.excerpt)}
                    </p>
                    <div className="card-footer">
                      <div className="card-author">
                        <div className="card-author-avatar">J</div>
                        <span>Jones</span>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="card-readmore">
                        Read post
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="mb-4">No articles found</h3>
            <p className="text-muted">
              We couldn't find any articles matching your search query or category filters.
            </p>
          </div>
        )}

        {filteredPosts.length > visibleCount && (
          <div className="load-more-container">
            <button className="btn btn-primary" onClick={loadMore}>
              Load More Articles
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
