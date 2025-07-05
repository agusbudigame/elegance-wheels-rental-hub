import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  customer_name: string;
  customer_title: string | null;
  content: string;
  rating: number;
  image_url: string | null;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      if (data) setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? "text-primary" : "text-muted-foreground"}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading testimonials...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4">
            What Our <span className="text-gradient-gold">Clients Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers 
            have to say about their luxury car rental experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="card-luxury">
              <CardContent className="p-6">
                {/* Stars */}
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Content */}
                <blockquote className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </blockquote>

                {/* Customer Info */}
                <div className="flex items-center">
                  {testimonial.image_url ? (
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.customer_name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-4">
                      <span className="text-primary-foreground font-bold">
                        {testimonial.customer_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.customer_name}
                    </div>
                    {testimonial.customer_title && (
                      <div className="text-sm text-muted-foreground">
                        {testimonial.customer_title}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No testimonials available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;