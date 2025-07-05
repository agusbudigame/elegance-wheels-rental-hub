-- Create categories table for car classification
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cars table for vehicle inventory
CREATE TABLE public.cars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  transmission TEXT NOT NULL CHECK (transmission IN ('Manual', 'Automatic')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
  seats INTEGER NOT NULL DEFAULT 4,
  features TEXT[], -- Array of features like ['AC', 'GPS', 'Leather Seats']
  description TEXT,
  image_url TEXT,
  gallery_images TEXT[], -- Array of additional image URLs
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table for rental orders
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table for customer reviews
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_title TEXT, -- e.g., "CEO at Company"
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create galleries table for event photos
CREATE TABLE public.galleries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  event_type TEXT, -- e.g., 'wedding', 'corporate', 'ceremonial'
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access to categories, cars, testimonials, galleries
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Cars are viewable by everyone" 
ON public.cars FOR SELECT USING (true);

CREATE POLICY "Featured testimonials are viewable by everyone" 
ON public.testimonials FOR SELECT USING (is_featured = true);

CREATE POLICY "Galleries are viewable by everyone" 
ON public.galleries FOR SELECT USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for bookings (customers can only see their own)
CREATE POLICY "Bookings are viewable by admins or booking owner" 
ON public.bookings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  ) 
  OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Anyone can create bookings" 
ON public.bookings FOR INSERT WITH CHECK (true);

-- Admin policies for CRUD operations
CREATE POLICY "Admins can manage all tables" 
ON public.categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can manage cars" 
ON public.cars FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can manage testimonials" 
ON public.testimonials FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can manage galleries" 
ON public.galleries FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can manage bookings" 
ON public.bookings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON public.cars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON public.galleries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
('Wedding', 'Luxury cars perfect for wedding ceremonies and photo sessions'),
('Ceremonial', 'Premium vehicles for formal events and ceremonies'),
('Corporate', 'Professional cars for business meetings and corporate events');

-- Insert sample cars
INSERT INTO public.cars (category_id, brand, model, year, color, price_per_day, transmission, fuel_type, seats, features, description, is_featured) VALUES
((SELECT id FROM public.categories WHERE name = 'Wedding'), 'BMW', '7 Series', 2023, 'Pearl White', 2500000, 'Automatic', 'Petrol', 5, ARRAY['AC', 'Leather Seats', 'Sunroof', 'Premium Sound'], 'Elegant BMW 7 Series perfect for your special day', true),
((SELECT id FROM public.categories WHERE name = 'Wedding'), 'Mercedes-Benz', 'S-Class', 2023, 'Midnight Black', 3000000, 'Automatic', 'Petrol', 5, ARRAY['AC', 'Massage Seats', 'Chauffeur Service', 'Champagne Bar'], 'The ultimate luxury experience for weddings', true),
((SELECT id FROM public.categories WHERE name = 'Corporate'), 'Audi', 'A8', 2022, 'Space Gray', 2200000, 'Automatic', 'Petrol', 5, ARRAY['AC', 'WiFi', 'Business Package', 'Tinted Windows'], 'Professional luxury for corporate events', false),
((SELECT id FROM public.categories WHERE name = 'Ceremonial'), 'Rolls-Royce', 'Ghost', 2023, 'Arctic White', 5000000, 'Automatic', 'Petrol', 5, ARRAY['AC', 'Starlight Headliner', 'Champagne Cooler', 'Silk Carpets'], 'The pinnacle of automotive luxury', true);

-- Insert sample testimonials
INSERT INTO public.testimonials (customer_name, customer_title, content, rating, is_featured) VALUES
('Amanda & David', 'Wedding Couple', 'Elegance Car Rental made our wedding day absolutely perfect. The BMW 7 Series was immaculate and the service was exceptional!', 5, true),
('PT. Mandiri Sukses', 'Corporate Client', 'Professional service for our company events. Always on time and the cars are in perfect condition.', 5, true),
('Sarah Wijaya', 'Event Organizer', 'Reliable partner for all our luxury events. Their attention to detail is remarkable.', 5, true);

-- Insert sample gallery
INSERT INTO public.galleries (title, description, event_type, is_featured) VALUES
('Elegant Wedding at Shangri-La', 'Beautiful wedding ceremony with our premium BMW 7 Series', 'wedding', true),
('Corporate Summit 2023', 'Successful corporate event with our professional fleet', 'corporate', true),
('Golden Anniversary Celebration', 'Memorable ceremonial event with luxury transportation', 'ceremonial', true);