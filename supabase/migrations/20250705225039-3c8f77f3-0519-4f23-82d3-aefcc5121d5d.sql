-- Fix galleries table by making image_url nullable or providing default values
-- Drop and recreate galleries table with nullable image_url
DROP TABLE IF EXISTS public.galleries CASCADE;

-- Create galleries table with nullable image_url
CREATE TABLE public.galleries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT, -- Made nullable
  event_type TEXT, -- e.g., 'wedding', 'corporate', 'ceremonial'
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

-- RLS Policy for galleries
CREATE POLICY "Galleries are viewable by everyone" 
ON public.galleries FOR SELECT USING (true);

CREATE POLICY "Admins can manage galleries" 
ON public.galleries FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_galleries_updated_at BEFORE UPDATE ON public.galleries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample gallery with proper image URLs
INSERT INTO public.galleries (title, description, image_url, event_type, is_featured) VALUES
('Elegant Wedding at Shangri-La', 'Beautiful wedding ceremony with our premium BMW 7 Series', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80', 'wedding', true),
('Corporate Summit 2023', 'Successful corporate event with our professional fleet', 'https://images.unsplash.com/photo-1556742049-0b04535c0c8c?auto=format&fit=crop&w=800&q=80', 'corporate', true),
('Golden Anniversary Celebration', 'Memorable ceremonial event with luxury transportation', 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=800&q=80', 'ceremonial', true);

-- Also add sample car images
UPDATE public.cars SET image_url = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80' WHERE brand = 'BMW' AND model = '7 Series';
UPDATE public.cars SET image_url = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80' WHERE brand = 'Mercedes-Benz' AND model = 'S-Class';
UPDATE public.cars SET image_url = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80' WHERE brand = 'Audi' AND model = 'A8';
UPDATE public.cars SET image_url = 'https://images.unsplash.com/photo-1631295868785-3b670d1dfb3d?auto=format&fit=crop&w=800&q=80' WHERE brand = 'Rolls-Royce' AND model = 'Ghost';