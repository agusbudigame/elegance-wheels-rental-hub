import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FleetSection from "@/components/FleetSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FleetSection />
      <GallerySection />
      <TestimonialsSection />
      <BookingForm />
      <Footer />
    </div>
  );
};

export default Index;
