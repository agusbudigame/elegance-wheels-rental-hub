import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price_per_day: number;
  transmission: string;
  fuel_type: string;
  seats: number;
  features: string[];
  description: string;
  image_url: string;
  is_featured: boolean;
  categories: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const FleetSection = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarsAndCategories();
  }, []);

  const fetchCarsAndCategories = async () => {
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      // Fetch cars with categories
      const { data: carsData } = await supabase
        .from("cars")
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq("is_available", true)
        .order("is_featured", { ascending: false });

      if (categoriesData) setCategories(categoriesData);
      if (carsData) setCars(carsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = selectedCategory === "all" 
    ? cars 
    : cars.filter(car => car.categories?.name === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">Loading our premium fleet...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="fleet" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4">
            Our Premium <span className="text-gradient-gold">Fleet</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our carefully curated collection of luxury vehicles, 
            each maintained to the highest standards for your special occasions.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "btn-luxury" : "btn-outline-luxury"}
          >
            All Vehicles
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.name)}
              className={selectedCategory === category.name ? "btn-luxury" : "btn-outline-luxury"}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <Card key={car.id} className="card-luxury group">
              <div className="relative overflow-hidden rounded-t-xl">
                {car.is_featured && (
                  <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
                <img
                  src={car.image_url || "/placeholder.svg"}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-playfair font-bold text-foreground">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-muted-foreground">{car.year} • {car.color}</p>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary">
                    {car.categories?.name}
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {car.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {car.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{car.features.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                  <div>Transmission: {car.transmission}</div>
                  <div>Seats: {car.seats}</div>
                  <div>Fuel: {car.fuel_type}</div>
                  <div>Category: {car.categories?.name}</div>
                </div>

                {/* Price and CTA */}
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(car.price_per_day)}
                    <span className="text-sm font-normal text-muted-foreground">/day</span>
                  </div>
                  <Button className="btn-luxury">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No vehicles found in the selected category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FleetSection;