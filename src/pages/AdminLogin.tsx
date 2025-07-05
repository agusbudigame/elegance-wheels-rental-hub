import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has admin role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", data.user.id)
          .single();

        if (profile?.role === "admin") {
          toast({
            title: "Login Successful",
            description: "Welcome to the admin dashboard!",
          });
          navigate("/admin");
        } else {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
        }
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create admin profile
        await supabase
          .from("profiles")
          .insert({
            user_id: data.user.id,
            full_name: "Admin User",
            role: "admin"
          });

        toast({
          title: "Account Created",
          description: "Admin account created successfully. Please check your email to verify.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md">
        {/* Back to Website Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            ← Back to Website
          </Button>
        </div>

        <Card className="card-luxury">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl font-playfair">E</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-playfair font-bold">
              Admin <span className="text-gradient-gold">Login</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="admin@elegancecarrental.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-luxury w-full"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="btn-outline-luxury w-full"
                >
                  Create Admin Account
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Demo Admin Credentials:</p>
              <p>Email: admin@elegancecarrental.com</p>
              <p>Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;