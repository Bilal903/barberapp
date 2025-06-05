
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Clock, User, Scissors } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Service = Tables<'services'>;
type Barber = Tables<'barbers'>;

const Book = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  useEffect(() => {
    fetchServices();
    fetchBarbers();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('price');
    if (data) setServices(data);
  };

  const fetchBarbers = async () => {
    const { data } = await supabase
      .from('barbers')
      .select('*')
      .order('rating', { ascending: false });
    if (data) setBarbers(data);
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime || !user) {
      toast({
        title: 'Missing Information',
        description: 'Please select service, barber, date and time',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    const totalAmount = selectedService.price + (selectedBarber.premium_fee || 0);
    
    const { error } = await supabase
      .from('appointments')
      .insert({
        customer_id: user.id,
        service_id: selectedService.id,
        barber_id: selectedBarber.id,
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: selectedTime,
        total_amount: totalAmount,
        status: 'scheduled'
      });

    if (error) {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Booking Confirmed!',
        description: 'Your appointment has been scheduled successfully.',
      });
      // Reset form
      setSelectedService(null);
      setSelectedBarber(null);
      setSelectedDate(undefined);
      setSelectedTime('');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Book Appointment</h1>
        <p className="text-gray-600">Choose your service, barber, and preferred time</p>
      </div>

      {/* Services Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Select Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedService?.id === service.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedService(service)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.duration} min
                    </span>
                    {service.is_premium && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-bold">${(service.price / 100).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Barber Selection */}
      {selectedService && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Select Barber
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedBarber?.id === barber.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedBarber(barber)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{barber.name}</h3>
                    <p className="text-sm text-gray-600">{barber.bio}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">
                        ⭐ {barber.rating} • {barber.years_experience} years
                      </span>
                      {barber.is_premium && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                  {barber.premium_fee > 0 && (
                    <span className="text-sm font-medium">
                      +${(barber.premium_fee / 100).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Date Selection */}
      {selectedBarber && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date.getDay() === 0}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      )}

      {/* Time Selection */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Select Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Summary */}
      {selectedService && selectedBarber && selectedDate && selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Service:</span>
              <span>{selectedService.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Barber:</span>
              <span>{selectedBarber.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{selectedDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{selectedTime}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>${((selectedService.price + (selectedBarber.premium_fee || 0)) / 100).toFixed(2)}</span>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={handleBooking}
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Book;
