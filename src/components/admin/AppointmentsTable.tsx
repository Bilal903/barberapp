import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type Appointment = Tables<'appointments'> & {
  barbers: { name: string } | null;
  services: { name: string; duration: number } | null;
  profiles: { full_name: string } | null;
};

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          barbers (name),
          services (name, duration),
          profiles (full_name)
        `)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
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

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment status updated successfully",
      });

      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Appointments</h2>
        <Button>Add New Appointment</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Barber</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Loading...
              </TableCell>
            </TableRow>
          ) : appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No appointments found
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.profiles?.full_name || 'N/A'}</TableCell>
                <TableCell>{appointment.services?.name || 'N/A'}</TableCell>
                <TableCell>{appointment.barbers?.name || 'N/A'}</TableCell>
                <TableCell>
                  {format(new Date(`${appointment.appointment_date}T${appointment.appointment_time}`), "MMM dd, yyyy h:mm a")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appointment.status === "completed"
                        ? "secondary"
                        : appointment.status === "cancelled"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {appointment.status || 'scheduled'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(appointment.id, 'completed')}
                      disabled={appointment.status === 'completed'}
                    >
                      Complete
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                      disabled={appointment.status === 'cancelled'}
                    >
                      Cancel
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentsTable; 