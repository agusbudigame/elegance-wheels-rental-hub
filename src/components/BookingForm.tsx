import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  notes: string;
}

interface BookingFormProps {
  selectedCar?: {
    id: string;
    brand: string;
    model: string;
    price_per_day: number;
  } | null;
  onClose?: () => void;
}

const BookingForm = ({ selectedCar, onClose }: BookingFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BookingFormData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    start_date: "",
    end_date: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalDays = () => {
    if (!formData.start_date || !formData.end_date) return 0;
    
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(1, diffDays);
  };

  const calculateTotalPrice = () => {
    if (!selectedCar) return 0;
    return selectedCar.price_per_day * calculateTotalDays();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCar) {
      toast({
        title: "Error",
        description: "Please select a car first",
        variant: "destructive",
      });
      return;
    }

    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone || 
        !formData.start_date || !formData.end_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (startDate >= endDate) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const totalDays = calculateTotalDays();
      const totalPrice = calculateTotalPrice();

      const { error } = await supabase
        .from("bookings")
        .insert({
          car_id: selectedCar.id,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          start_date: formData.start_date,
          end_date: formData.end_date,
          total_days: totalDays,
          total_price: totalPrice,
          notes: formData.notes,
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Booking Submitted!",
        description: "We'll contact you shortly to confirm your reservation.",
      });

      // Reset form
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        start_date: "",
        end_date: "",
        notes: "",
      });

      if (onClose) onClose();

    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4">
              Book Your <span className="text-gradient-gold">Luxury Ride</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Ready to experience luxury? Fill out the form below and we'll get back to you shortly.
            </p>
          </div>

          <Card className="card-luxury">
            {selectedCar && (
              <CardHeader className="border-b">
                <CardTitle className="flex justify-between items-center">
                  <span className="font-playfair">
                    {selectedCar.brand} {selectedCar.model}
                  </span>
                  <span className="text-primary">
                    {formatPrice(selectedCar.price_per_day)}/day
                  </span>
                </CardTitle>
              </CardHeader>
            )}

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customer_name" className="text-foreground font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="customer_name"
                        name="customer_name"
                        type="text"
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="customer_email" className="text-foreground font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="customer_email"
                        name="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="customer_phone" className="text-foreground font-medium">
                        Phone Number *
                      </Label>
                      <Input
                        id="customer_phone"
                        name="customer_phone"
                        type="tel"
                        value={formData.customer_phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="start_date" className="text-foreground font-medium">
                        Start Date *
                      </Label>
                      <Input
                        id="start_date"
                        name="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        className="mt-1"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="end_date" className="text-foreground font-medium">
                        End Date *
                      </Label>
                      <Input
                        id="end_date"
                        name="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        className="mt-1"
                        min={formData.start_date || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    {/* Price Summary */}
                    {selectedCar && formData.start_date && formData.end_date && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span>Duration:</span>
                          <span className="font-semibold">{calculateTotalDays()} days</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold text-primary">
                          <span>Total Price:</span>
                          <span>{formatPrice(calculateTotalPrice())}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="text-foreground font-medium">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Any special requests or additional information..."
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-luxury px-12 py-3 text-lg"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;