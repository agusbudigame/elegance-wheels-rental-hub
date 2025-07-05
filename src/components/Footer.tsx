const Footer = () => {
  return (
    <footer className="bg-luxury-black text-luxury-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl font-playfair">E</span>
              </div>
              <div className="text-xl font-playfair font-bold">
                Elegance <span className="text-gradient-gold">Car Rental</span>
              </div>
            </div>
            <p className="text-luxury-white/80">
              Premium luxury car rental service for weddings, corporate events, 
              and special ceremonies in Surabaya and surrounding areas.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-playfair font-bold text-primary">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#home" className="text-luxury-white/80 hover:text-primary transition-colors">
                Home
              </a>
              <a href="#fleet" className="text-luxury-white/80 hover:text-primary transition-colors">
                Our Fleet
              </a>
              <a href="#services" className="text-luxury-white/80 hover:text-primary transition-colors">
                Services
              </a>
              <a href="#gallery" className="text-luxury-white/80 hover:text-primary transition-colors">
                Gallery
              </a>
              <a href="#testimonials" className="text-luxury-white/80 hover:text-primary transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="text-luxury-white/80 hover:text-primary transition-colors">
                Contact
              </a>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-playfair font-bold text-primary">Services</h3>
            <nav className="flex flex-col space-y-2">
              <span className="text-luxury-white/80">Wedding Car Rental</span>
              <span className="text-luxury-white/80">Corporate Transportation</span>
              <span className="text-luxury-white/80">Ceremonial Events</span>
              <span className="text-luxury-white/80">Airport Transfer</span>
              <span className="text-luxury-white/80">Chauffeur Service</span>
              <span className="text-luxury-white/80">Long Distance Travel</span>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-playfair font-bold text-primary">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-primary mt-0.5">📍</div>
                <div className="text-luxury-white/80">
                  Jl. Ikan Tongkol No.6<br />
                  Surabaya, Jawa Timur
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-primary">📱</div>
                <div className="text-luxury-white/80">
                  <a href="https://wa.me/62811549180" className="hover:text-primary transition-colors">
                    +62 811 549 180
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-primary">✉️</div>
                <div className="text-luxury-white/80">
                  info@elegancecarrental.com
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-luxury-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-luxury-white/60 text-sm">
              © 2024 Elegance Car Rental. All rights reserved.
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-luxury-white/60 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-luxury-white/60 hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-luxury-white/60 hover:text-primary transition-colors">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;