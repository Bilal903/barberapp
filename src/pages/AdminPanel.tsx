import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarDays, 
  Users, 
  Package, 
  LayoutDashboard,
  Menu
} from 'lucide-react';
import AppointmentsTable from '@/components/admin/AppointmentsTable';
import CustomersTable from '@/components/admin/CustomersTable';
import ProductsTable from '@/components/admin/ProductsTable';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalServices: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total appointments
      const { count: appointmentsCount, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });

      if (appointmentsError) throw appointmentsError;

      // Fetch total customers
      const { count: customersCount, error: customersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (customersError) throw customersError;

      // Fetch total products
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (productsError) throw productsError;

      // Fetch total services
      const { count: servicesCount, error: servicesError } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true });

      if (servicesError) throw servicesError;

      setStats({
        totalAppointments: appointmentsCount || 0,
        totalCustomers: customersCount || 0,
        totalProducts: productsCount || 0,
        totalServices: servicesCount || 0
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mb-4"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <nav className="space-y-2">
            <Button 
              variant={activeTab === "dashboard" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              {isSidebarOpen && <span>Dashboard</span>}
            </Button>
            <Button 
              variant={activeTab === "appointments" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("appointments")}
            >
              <CalendarDays className="mr-2 h-5 w-5" />
              {isSidebarOpen && <span>Appointments</span>}
            </Button>
            <Button 
              variant={activeTab === "customers" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("customers")}
            >
              <Users className="mr-2 h-5 w-5" />
              {isSidebarOpen && <span>Customers</span>}
            </Button>
            <Button 
              variant={activeTab === "products" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("products")}
            >
              <Package className="mr-2 h-5 w-5" />
              {isSidebarOpen && <span>Products</span>}
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Total Appointments</h3>
                <p className="text-3xl font-bold">{loading ? "..." : stats.totalAppointments}</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Total Customers</h3>
                <p className="text-3xl font-bold">{loading ? "..." : stats.totalCustomers}</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Total Products</h3>
                <p className="text-3xl font-bold">{loading ? "..." : stats.totalProducts}</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Total Services</h3>
                <p className="text-3xl font-bold">{loading ? "..." : stats.totalServices}</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <AppointmentsTable />
          </TabsContent>

          <TabsContent value="customers" className="mt-6">
            <CustomersTable />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <ProductsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel; 