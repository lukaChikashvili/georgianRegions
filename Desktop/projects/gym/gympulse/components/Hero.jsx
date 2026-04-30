import Image from "next/image";
import banner from "../public/banner.png";
import { ArrowRight, Calendar, Zap, Star, CheckCircle2 } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white ">
     
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 ">
        <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-purple-100 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-5%] w-100 h-100 bg-blue-50 rounded-full blur-[100px] opacity-70" />
      </div>

      <div className="max-w-7xl -mt-12 mx-auto px-6 lg:px-12 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-16">
       
        <div className="flex-1 space-y-8 text-center lg:text-left">
          
      
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-sm font-semibold tracking-wide">
            <Star className="w-4 h-4 fill-purple-500" />
             #1 ფიტნეს დარბაზების მართვის პლატფორმა
          </div>

       
          <h1 className="text-6xl font-bold leading-tight text-gray-900">
  აშენე. გაზარდე. <br />
  <span className="text-purple-600">მიაღწიე წარმატებას.</span>
</h1>

       
          <p className="max-w-lg mx-auto lg:mx-0 text-gray-600 text-lg lg:text-xl leading-relaxed">
          ერთიანი პლატფორმა თქვენი დარბაზის სამართავად, წევრების 
  ჩასართავად და ბიზნესის სტრესის გარეშე გასავითარებლად.
          </p>

          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-purple-600 transition-all duration-300 shadow-xl shadow-purple-200 hover:shadow-purple-300">
             ცადე უფასოდ
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
            გაიგე მეტი
            </button>
          </div>

        
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
            {[
  { icon: Zap, text: "სწრაფი ინსტალაცია" },
  { icon: Calendar, text: "ავტომატური განრიგი" },
  { icon: CheckCircle2, text: "წევრების აპლიკაცია" }
].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <feature.icon className="w-4 h-4 text-purple-600" />
                {feature.text}
              </div>
            ))}
          </div>
        </div>

        
        <div className="flex-1 relative w-full max-w-150 lg:max-w-none">
          
          
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm">
            <Image
              src={banner}
              width={800}
              height={800}
              alt="Dashboard Preview"
              className="object-cover hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>

       
          <div className="absolute -top-6 -left-6 lg:-left-12 z-20 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-5 rounded-2xl border border-white/20 animate-bounce-slow hover:-translate-y-2 transition-transform cursor-default hidden sm:block">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-4 h-4 text-green-600 fill-green-600" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue</p>
            </div>
            <h3 className="text-2xl font-black text-slate-800">$24,560</h3>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+18.6%</span>
          </div>

      
          <div className="absolute top-1/2 -right-8 z-20 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-5 rounded-2xl border border-white/20 hover:-translate-y-2 transition-transform cursor-default hidden md:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Members</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-800">1,284</h3>
              <span className="text-purple-600 font-bold text-sm">↑</span>
            </div>
            <div className="flex -space-x-2 mt-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200" />
              ))}
              <div className="w-7 h-7 rounded-full border-2 border-white bg-purple-600 flex items-center justify-center text-[10px] text-white font-bold">+12</div>
            </div>
          </div>

          <div className="absolute -bottom-10 left-10 z-20 bg-slate-900 shadow-2xl p-5 rounded-2xl w-64 hidden lg:block">
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-sm text-slate-300 italic leading-relaxed">
              "საუკეთესო ინვესტიციაა. მასშტაბირება ყოველგვარი ძალისხმევის გარეშე შევძელით."
            </p>
            <p className="text-xs mt-3 font-bold text-white uppercase tracking-widest">— Alex Rivera, Elite Fit</p>
          </div>

        </div>
      </div>
      
      
    </div>
  );
};

export default Hero;