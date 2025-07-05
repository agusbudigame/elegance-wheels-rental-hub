import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  event_type: string | null;
  is_featured: boolean;
}

const GallerySection = () => {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const { data } = await supabase
        .from("galleries")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (data) setGalleries(data);
    } catch (error) {
      console.error("Error fetching galleries:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "all", label: "All Events" },
    { value: "wedding", label: "Weddings" },
    { value: "corporate", label: "Corporate" },
    { value: "ceremonial", label: "Ceremonial" },
  ];

  const filteredGalleries = selectedCategory === "all" 
    ? galleries 
    : galleries.filter(item => item.event_type === selectedCategory);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading gallery...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4">
            Event <span className="text-gradient-gold">Gallery</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take a look at some of our memorable moments serving clients at their 
            most important events and celebrations.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category.value
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)]" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGalleries.map((item) => (
            <Card key={item.id} className="card-luxury group overflow-hidden">
              <div className="relative">
                {item.is_featured && (
                  <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
                
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-luxury-white">
                    <h3 className="text-xl font-playfair font-bold mb-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-luxury-white/90 text-sm">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-playfair font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.event_type && (
                    <Badge variant="outline" className="text-primary border-primary capitalize">
                      {item.event_type}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGalleries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No gallery items found for the selected category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;