
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ShoppingBag, Crown, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tables } from '@/integrations/supabase/types';

type Appointment = Tables<'appointments'> & {
  barbers: { name: string } | null;
  services: { name: string; duration: number } | null;
};

const Home = () => {
  const { user } = useAuth();
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch next appointment
        const { data: appointments } = await supabase
          .from('appointments')
          .select(`
            *,
            barbers (name),
            services (name, duration)
          `)
          .eq('customer_id', user.id)
          .eq('status', 'scheduled')
          .gte('appointment_date', new Date().toISOString().split('T')[0])
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true })
          .limit(1);

        if (appointments && appointments.length > 0) {
          setNextAppointment(appointments[0] as Appointment);
        }

        // Fetch recent orders
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        setRecentOrders(orders || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100">Ready for your next grooming session?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/book">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">Book Now</h3>
              <p className="text-sm text-gray-600">Schedule appointment</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/shop">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <ShoppingBag className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Shop</h3>
              <p className="text-sm text-gray-600">Hair products</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Next Appointment */}
      {nextAppointment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Next Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{nextAppointment.services?.name}</span>
                <span className="text-sm text-gray-600">{nextAppointment.services?.duration} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">with {nextAppointment.barbers?.name}</span>
                <span className="text-sm font-medium">
                  {new Date(nextAppointment.appointment_date).toLocaleDateString()} at {nextAppointment.appointment_time}
                </span>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Membership Upsell */}
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Premium Membership
              </h3>
              <p className="text-sm text-amber-700">Save up to 25% on all services</p>
            </div>
            <Link to="/membership">
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                Learn More
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Featured Services */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">Classic Haircut</h4>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                45 min
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">$25.00</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600">4.8</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">Premium Cut & Style</h4>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                60 min
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">$40.00</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600">4.9</span>
              </div>
            </div>
          </div>
          
          <Link to="/book">
            <Button className="w-full mt-4">
              Book a Service
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
