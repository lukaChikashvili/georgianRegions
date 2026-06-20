

const HeaderGlowLine = () => {
    return (
      <div className="relative w-full h-px overflow-hidden bg-white/5">
        <div className="absolute inset-0 w-1/3 animate-glow-sweep"
             style={{
               background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
               filter: "blur(1px)",
             }}
        />
      </div>
    );
  };
  
  export default HeaderGlowLine;