-- Enable Row Level Security on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

CREATE POLICY "Cars are viewable by everyone" 
ON public.cars FOR SELECT USING (true);

CREATE POLICY "Featured testimonials are viewable by everyone" 
ON public.testimonials FOR SELECT USING (is_featured = true);

CREATE POLICY "Galleries are viewable by everyone" 
ON public.galleries FOR SELECT USING (true);

-- Profile policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (user_id = auth.uid());

-- Booking policies
CREATE POLICY "Anyone can create bookings" 
ON public.bookings FOR INSERT WITH CHECK (true);

-- Admin policies (will work after admin user is created)
CREATE POLICY "Admins can manage categories" 
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

-- Insert sample data
INSERT INTO public.categories (name, description) VALUES
('Wedding', 'Luxury cars perfect for wedding ceremonies and photo sessions'),
('Ceremonial', 'Premium vehicles for formal events and ceremonies'),
('Corporate', 'Professional cars for business meetings and corporate events');

INSERT INTO public.cars (category_id, brand, model, year, color, price_per_day, transmission, fuel_type, seats, features, description, image_url, is_featured) VALUES
((SELECT id FROM public.categories WHERE name = 'Wedding'), 'BMW', '7 Series', 2023, 'Pearl White', 2500000, 'Automatic', 'Petrol', 5, ARRAY['AC', 'Leather Seats', 'Sunroof', 'Premium Sound'], 'Elegant BMW 7 Series perfect for your special day', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80', true),
((SELECT id FROM public.categories WHERE name = 'Wedding'), 'Mercedes-Benz', 'S-Class', 2023, 'Midnight Black', 3000000, 'Automatic', 'Petrol', 5, ARRAY['AC', 'Massage Seats', 'Chauffeur Service', 'Champagne Bar'], 'The ultimate luxury experience for weddings', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80', true),
((SELECT id FROM public.categories WHERE name = 'Corporate'), 'Audi', 'A8', 2022, 'Space Gray', 2200000, 'Automatic', 'Petrol', 5, ARRAY['AC', 'WiFi', 'Business Package', 'Tinted Windows'], 'Professional luxury for corporate events', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80', false),
((SELECT id FROM public.categories WHERE name = 'Ceremonial'), 'Rolls-Royce', 'Ghost', 2023, 'Arctic White', 5000000, 'Automatic', 'Petrol', 5, ARRAY['AC', 'Starlight Headliner', 'Champagne Cooler', 'Silk Carpets'], 'The pinnacle of automotive luxury', 'https://images.unsplash.com/photo-1631295868785-3b670d1dfb3d?auto=format&fit=crop&w=800&q=80', true);

INSERT INTO public.testimonials (customer_name, customer_title, content, rating, is_featured) VALUES
('Amanda & David', 'Wedding Couple', 'Elegance Car Rental made our wedding day absolutely perfect. The BMW 7 Series was immaculate and the service was exceptional!', 5, true),
('PT. Mandiri Sukses', 'Corporate Client', 'Professional service for our company events. Always on time and the cars are in perfect condition.', 5, true),
('Sarah Wijaya', 'Event Organizer', 'Reliable partner for all our luxury events. Their attention to detail is remarkable.', 5, true);

INSERT INTO public.galleries (title, description, image_url, event_type, is_featured) VALUES
('Elegant Wedding at Shangri-La', 'Beautiful wedding ceremony with our premium BMW 7 Series', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80', 'wedding', true),
('Corporate Summit 2023', 'Successful corporate event with our professional fleet', 'https://images.unsplash.com/photo-1556742049-0b04535c0c8c?auto=format&fit=crop&w=800&q=80', 'corporate', true),
('Golden Anniversary Celebration', 'Memorable ceremonial event with luxury transportation', 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80', 'ceremonial', true);