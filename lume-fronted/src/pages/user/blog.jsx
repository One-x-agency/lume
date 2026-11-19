import { ArrowRight, Calendar, User as UserIcon } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Fall Collection Trends: What to Wear This Season",
    excerpt: "Discover the essential pieces for your autumn wardrobe, featuring rich textures and warm tones. Elevate your daily looks with these timeless silhouettes.",
    category: "Style Guide",
    author: "Jane Doe",
    date: "Oct 12, 2026",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Sustainable Fashion 101: Building an Eco-Friendly Closet",
    excerpt: "A comprehensive guide on how to transition your wardrobe into a more sustainable and ethical collection, without compromising on modern aesthetic and comfort.",
    category: "Sustainability",
    author: "Alex Rivera",
    date: "Sep 28, 2026",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Mastering the Art of Layering",
    excerpt: "Learn how to expertly layer your clothing for changing weather, maintaining style without compromising comfort. The secret to an effortless and elegant transition.",
    category: "Tips & Tricks",
    author: "Sam Jenkins",
    date: "Sep 15, 2026",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Minimalism: The Timeless Appeal of a Capsule Wardrobe",
    excerpt: "Why less is more. Dive into the principles of minimalism and how a few well-chosen premium pieces can completely transform your daily look.",
    category: "Philosophy",
    author: "Emma Stone",
    date: "Aug 30, 2026",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
      <div className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center bg-slate-100">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
          alt="Blog Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center px-6 max-w-3xl animate-fade-in-up md:mt-0 mt-8">
          <p className="text-white/80 font-bold uppercase tracking-[0.2em] text-sm mb-4">Lume Journal</p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">Stories of Style & Substance</h1>
          <p className="text-lg text-slate-200 font-light tracking-wide">
            Insights, inspiration, and thoughts from the forefront of modern fashion.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-24 px-6 sm:px-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">Latest Articles</h2>
          <div className="w-12 h-px bg-slate-900"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 lg:gap-16">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col cursor-pointer">
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100 mb-6 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-shadow duration-500">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-slate-900 text-[10px] font-bold px-4 py-1.5 tracking-widest uppercase shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-col grow">
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1.5"><UserIcon className="w-3.5 h-3.5" />{post.author}</span>
                </div>
                <h3 className="text-2xl font-serif text-slate-900 mb-4 group-hover:text-amber-700 transition-colors duration-300 leading-snug">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 grow">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:text-amber-700 transition-colors">
                    Read Article <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-20 flex justify-center">
          <button className="border border-slate-900 bg-transparent text-slate-900 px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300">
            Load More Stories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
