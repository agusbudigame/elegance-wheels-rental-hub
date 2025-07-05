import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalCars: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch cars count
      const { count: carsCount } = await supabase
        .from("cars")
        .select("*", { count: "exact", head: true });

      // Fetch bookings stats
      const { data: bookingsData, count: bookingsCount } = await supabase
        .from("bookings")
        .select("total_price, status", { count: "exact" });

      const pendingCount = bookingsData?.filter(b => b.status === "pending").length || 0;
      const totalRevenue = bookingsData?.reduce((sum, booking) => sum + Number(booking.total_price), 0) || 0;

      setStats({
        totalCars: carsCount || 0,
        totalBookings: bookingsCount || 0,
        pendingBookings: pendingCount,
        totalRevenue: totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const menuItems = [
    { title: "Manage Cars", description: "Add, edit, and manage vehicle inventory", path: "/admin/cars" },
    { title: "Bookings", description: "View and manage customer bookings", path: "/admin/bookings" },
    { title: "Testimonials", description: "Manage customer testimonials", path: "/admin/testimonials" },
    { title: "Gallery", description: "Manage event gallery images", path: "/admin/gallery" },
    { title: "Reports", description: "View booking and financial reports", path: "/admin/reports" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                ← Back to Website
              </Button>
              <h1 className="text-2xl font-playfair font-bold text-foreground">
                Admin <span className="text-gradient-gold">Dashboard</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-luxury">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{loading ? "..." : stats.totalCars}</div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{loading ? "..." : stats.totalBookings}</div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{loading ? "..." : stats.pendingBookings}</div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {loading ? "..." : formatPrice(stats.totalRevenue)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Card key={index} className="card-luxury group cursor-pointer" onClick={() => navigate(item.path)}>
              <CardHeader>
                <CardTitle className="font-playfair group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <Button className="btn-luxury w-full">
                  Open {item.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-xl font-playfair font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button className="btn-luxury" onClick={() => navigate("/admin/cars")}>
              Add New Car
            </Button>
            <Button className="btn-outline-luxury" onClick={() => navigate("/admin/bookings")}>
              View Recent Bookings
            </Button>
            <Button className="btn-outline-luxury" onClick={() => navigate("/admin/reports")}>
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;