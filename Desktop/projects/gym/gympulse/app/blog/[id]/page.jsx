import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Calendar, Clock, ArrowLeft, Send } from "lucide-react"; 
import Link from "next/link";
import Comments from "../../../components/Comments";


export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const post = await fetchQuery(api.posts.getPostById, { id });


  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA]">
        <p className="text-gray-500 font-medium">Post not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20">
     
      <div className="max-w-4xl mx-auto pt-10 px-6">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#7C3AED] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ყველა ბლოგი
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-6">
        
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#7C3AED] text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
            Fitness Insights
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm border-b border-gray-200 pb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#7C3AED]" />
              <span>
             {new Date(post._creationTime).toLocaleDateString("en-US", {
               month: "long",
               day: "numeric",
               year: "numeric",
             })}
</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#7C3AED]" />
              <span>6 min read</span>
            </div>
          </div>
        </header>

      
        <div className="relative group mb-12">
          <div className="absolute -inset-1 bg-linear-to-r from-[#7C3AED] to-[#C084FC] rounded-4xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <img
            className="relative w-full h-112.5 object-cover rounded-4xl shadow-xl border border-white"
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80" 
            alt={post.title}
          />
        </div>

        
        <div className="bg-white  p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="prose prose-lg max-w-none prose-headings:text-[#0F172A] prose-p:text-gray-600 prose-p:leading-relaxed">
             <p className="text-xl text-gray-700 leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-[#7C3AED] first-letter:mr-3 first-letter:float-left">
              {post.body}
            </p>
            
        
          
          </div>

      
        
        </div>
         
         <Comments postId={post._id} />
      </article>
    </main>
  );
}