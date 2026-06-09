import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Calendar, Clock, ArrowLeft } from "lucide-react"; 
import Link from "next/link";
import Comments from "../../../components/Comments";
import PostCoverImage from "../../../components/PostCoverImage";

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const post = await fetchQuery(api.posts.getPostById, { id });

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
        <p className="font-serif italic text-white/50">ისტორია ვერ მოიძებნა</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] pb-20 mt-12">
      <div className="max-w-4xl mx-auto pt-16 px-6">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-[10px] uppercase tracking-widest text-white/30 hover:text-[#D4AF37] transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          უკან დაბრუნება
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-6">
        <header className="mb-16">
          <div className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-6 border-l border-[#D4AF37] pl-4">
            {post.category || "მემუარი"}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif italic text-white leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-[10px] uppercase tracking-widest text-white/40 border-b border-white/10 pb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-[#D4AF37]" />
              <span>
                {new Date(post._creationTime).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#D4AF37]" />
              <span>საკითხავი: 6 წუთი</span>
            </div>
            <div className="ml-auto italic text-white/20">
              ავტორი: {post.authorName || "ანონიმური"}
            </div>
          </div>
        </header>

      
        <div className="relative mb-16">
  <div className="aspect-[21/9] w-full bg-[#121212] border border-white/5 overflow-hidden">
    <PostCoverImage imageId={post.imageId} />
  </div>
</div>

        <div className="max-w-2xl mx-auto">
          <div className="prose prose-invert prose-lg prose-headings:font-serif prose-headings:italic prose-p:font-light prose-p:leading-relaxed text-white/80">
            <p className="text-xl leading-loose first-letter:text-6xl first-letter:font-serif first-letter:italic first-letter:text-[#D4AF37] first-letter:mr-4 first-letter:float-left">
              {post.body}
            </p>
          </div>
        </div>
        
    
        <div className="mt-20 border-t border-white/10 pt-10 max-w-2xl mx-auto">
          <Comments postId={post._id} />
        </div>
      </article>
    </main>
  );
}