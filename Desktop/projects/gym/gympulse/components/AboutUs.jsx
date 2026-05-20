export const AboutUs = () => {
    return (
      <section className="py-28 bg-[#0D0D0F] relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.03),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
            <div className="lg:col-span-5">
              <span className="text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium font-sans">ჩვენი ფილოსოფია</span>
              <h2 className="text-3xl md:text-5xl font-light text-[#FFF5D6] font-serif leading-[1.3] mt-4">
                მოგონებები, რომლებიც <br />
                <span className="italic text-[#D4AF37]">არასოდეს</span> ქრებიან.
              </h2>
            </div>
            
            <div className="lg:col-span-7 flex flex-col gap-6 font-sans text-base text-gray-400 font-light leading-relaxed">
              <p>
                ციფრულ ეპოქაში ჩვენ გვჯერა, რომ საყვარელი ადამიანების ხსოვნა განსაკუთრებულ, მშვიდ და დაცულ სივრცეს იმსახურებს. GoldenMemory შეიქმნა იმისთვის, რომ დაგეხმაროთ ტრადიციული პატივისცემისა და თანამედროვე ტექნოლოგიების გაერთიანებაში.
              </p>
              <p>
                ჩვენი მიზანია, შევამსუბუქოთ დაშორების ტკივილი და შევქმნათ მარადიული კერა, სადაც თაობები შეძლებენ გაეცნონ თავიანთ წინაპრებს, წაიკითხონ მათი ისტორიები და იგრძნონ კავშირი საკუთარ ფესვებთან.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };