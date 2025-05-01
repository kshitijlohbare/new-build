import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Appointments = () => {
  const appointments = [
    {
      id: 1,
      practitioner: "Dr. Sarah Johnson",
      date: "2025-05-01",
      time: "10:00 AM",
      type: "Initial Consultation",
      status: "upcoming"
    },
    {
      id: 2,
      practitioner: "Dr. Michael Smith",
      date: "2025-05-03",
      time: "2:30 PM",
      type: "Follow-up Session",
      status: "upcoming"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-happy-monkey text-[#148BAF]">My Appointments</h1>
        <Button className="bg-[#148BAF] text-white font-happy-monkey">
          Book New Appointment
        </Button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-happy-monkey text-[#148BAF] text-lg mb-2">
                  {appointment.type}
                </h3>
                <p className="text-gray-600 mb-1">With {appointment.practitioner}</p>
                <p className="text-gray-600">
                  {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="font-happy-monkey text-[#148BAF] border-[#148BAF]">
                  Reschedule
                </Button>
                <Button variant="outline" className="font-happy-monkey text-red-500 border-red-500">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {appointments.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-gray-500 font-happy-monkey">No appointments scheduled</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Appointments;