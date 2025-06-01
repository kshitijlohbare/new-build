import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; // Import useEffect and useState
import { supabase } from "@/lib/supabase"; // Import supabase client
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { useToast } from "@/hooks/useToast"; // Import useToast
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

// Define an interface for the appointment data
interface Appointment {
  id: number;
  practitioner_id: number;
  practitioner_name: string;
  date: string;
  time: string;
  session_type: string;
  status: string;
}

const Appointments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<{id: number, practitionerName: string} | null>(null);

  // Fetch appointments when component mounts
  useEffect(() => {
    fetchAppointments();
  }, [user]);

  // Function to fetch appointments
  const fetchAppointments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          practitioner_id,
          practitioner_name, 
          date,
          time,
          session_type,
          status
        `)
        .eq("user_id", user.id)
        .eq("status", "confirmed") // Only show confirmed appointments
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error",
          description: "There was an error loading your appointments. Please try again.",
          variant: "destructive"
        });
      } else {
        setAppointments(data as Appointment[]);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle booking new appointment
  const handleBookNewAppointment = () => {
    navigate("/therapist-listing");
  };

  // Handle reschedule appointment
  const handleReschedule = (appointment: Appointment) => {
    // Navigate to booking page with practitioner ID and existing appointment data
    navigate(`/booking?id=${appointment.practitioner_id}&reschedule=${appointment.id}`);
    toast({
      title: "Reschedule Appointment",
      description: `Select a new date and time for your appointment with ${appointment.practitioner_name}.`
    });
  };

  // Modified to show confirmation dialog first
  const initiateCancel = (appointmentId: number, practitionerName: string) => {
    setAppointmentToCancel({ id: appointmentId, practitionerName });
    setCancelDialogOpen(true);
  };

  // Handle cancel appointment
  const handleCancel = async (appointmentId: number, practitionerName: string) => {
    if (!user || !user.id) {
      toast({
        title: "Error",
        description: "You must be logged in to cancel an appointment.",
        variant: "destructive"
      });
      return;
    }
    try {
      // Update the appointment status to 'cancelled' in the database
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId)
        .eq("user_id", user.id); // user.id is now guaranteed to be a string

      if (error) {
        console.error("Error cancelling appointment:", error);
        toast({
          title: "Error",
          description: "There was an error cancelling your appointment. Please try again.",
          variant: "destructive"
        });
      } else {
        // Update local state to remove the cancelled appointment
        setAppointments(appointments.filter(appt => appt.id !== appointmentId));
        
        toast({
          title: "Appointment Cancelled",
          description: `Your appointment with ${practitionerName} has been cancelled.`
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-happy-monkey text-[#148BAF]">My Appointments</h1>
        <Button 
          className="bg-[#148BAF] text-white font-happy-monkey w-full sm:w-auto"
          onClick={handleBookNewAppointment}
        >
          Book New Appointment
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500 font-happy-monkey">Loading appointments...</p>
          </Card>
        ) : appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="p-4 sm:p-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
                <div className="flex-1">
                  <h3 className="font-happy-monkey text-[#148BAF] text-lg mb-2">
                    {appointment.session_type}
                  </h3>
                  <p className="text-gray-600 mb-1">With {appointment.practitioner_name}</p>
                  <p className="text-gray-600">
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                  <Button 
                    variant="outline" 
                    className="font-happy-monkey text-[#148BAF] border-[#148BAF] w-full sm:w-auto"
                    onClick={() => handleReschedule(appointment)}
                  >
                    Reschedule
                  </Button>
                  <Button 
                    variant="outline" 
                    className="font-happy-monkey text-red-500 border-red-500 w-full sm:w-auto"
                    onClick={() => initiateCancel(appointment.id, appointment.practitioner_name)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500 font-happy-monkey">No appointments scheduled</p>
          </Card>
        )}
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your appointment with {appointmentToCancel?.practitionerName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              No, keep appointment
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (appointmentToCancel) {
                  handleCancel(appointmentToCancel.id, appointmentToCancel.practitionerName);
                  setCancelDialogOpen(false);
                }
              }}
            >
              Yes, cancel appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;