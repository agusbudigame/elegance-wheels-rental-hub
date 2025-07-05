import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-luxury-car.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Luxury Car Rental" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-luxury-white mb-6 animate-fade-up">
            Luxury Car Rental
            <span className="block text-gradient-gold">for Every Occasion</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-luxury-white/90 mb-8 max-w-2xl mx-auto animate-fade-up" style={{animationDelay: '0.2s'}}>
            Premium vehicles for weddings, corporate events, and special ceremonies. 
            Experience elegance and sophistication with our exclusive fleet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{animationDelay: '0.4s'}}>
            <Button size="lg" className="btn-luxury text-lg px-8 py-4">
              Explore Our Fleet
            </Button>
            <Button size="lg" variant="outline" className="btn-outline-luxury text-lg px-8 py-4 text-luxury-white border-luxury-white hover:bg-luxury-white hover:text-luxury-black">
              Get Quote
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-luxury-white/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
              <span>Premium Fleet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
              <span>Professional Chauffeur</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-luxury-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-luxury-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;