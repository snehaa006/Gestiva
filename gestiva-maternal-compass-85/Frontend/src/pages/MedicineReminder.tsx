
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pill, Clock, Plus, Check, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MedicineReminder = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Prenatal Vitamin",
      dosage: "1 tablet",
      frequency: "Daily",
      time: "8:00 AM",
      taken: true,
      nextDue: "Tomorrow 8:00 AM"
    },
    {
      id: 2,
      name: "Folic Acid",
      dosage: "400 mcg",
      frequency: "Daily",
      time: "8:00 AM",
      taken: true,
      nextDue: "Tomorrow 8:00 AM"
    },
    {
      id: 3,
      name: "Iron Supplement",
      dosage: "27 mg",
      frequency: "Daily",
      time: "2:00 PM",
      taken: false,
      nextDue: "Today 2:00 PM"
    },
    {
      id: 4,
      name: "Calcium",
      dosage: "500 mg",
      frequency: "Twice daily",
      time: "9:00 AM, 9:00 PM",
      taken: false,
      nextDue: "Today 9:00 PM"
    }
  ]);

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: ""
  });

  const markAsTaken = (id: number) => {
    setMedicines(medicines.map(med => 
      med.id === id ? {...med, taken: true} : med
    ));
  };

  const addMedicine = () => {
    if (newMedicine.name) {
      const newMed = {
        id: Date.now(),
        ...newMedicine,
        taken: false,
        nextDue: `Today ${newMedicine.time}`
      };
      setMedicines([...medicines, newMed]);
      setNewMedicine({ name: "", dosage: "", frequency: "", time: "" });
    }
  };

  const todaysMedicines = medicines.filter(med => !med.taken);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4] py-8 px-4">
      <div className="absolute inset-0 logo-bg opacity-5"></div>
      
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#DB9C60] to-[#AE794B] flex items-center justify-center">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#6A452C] mb-2">Medicine Reminder</h1>
          <p className="text-[#976841]">Never miss your medications</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Medicines */}
          <div className="lg:col-span-2">
            <Card className="mb-8 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-[#6A452C]">Today's Medicines</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm"
                        className="gestiva-gradient text-white hover:opacity-90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Medicine
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Medicine</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="medicineName">Medicine Name</Label>
                          <Input
                            id="medicineName"
                            value={newMedicine.name}
                            onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                            placeholder="e.g., Prenatal Vitamin"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dosage">Dosage</Label>
                          <Input
                            id="dosage"
                            value={newMedicine.dosage}
                            onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})}
                            placeholder="e.g., 1 tablet, 400 mg"
                          />
                        </div>
                        <div>
                          <Label htmlFor="frequency">Frequency</Label>
                          <Input
                            id="frequency"
                            value={newMedicine.frequency}
                            onChange={(e) => setNewMedicine({...newMedicine, frequency: e.target.value})}
                            placeholder="e.g., Daily, Twice daily"
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newMedicine.time}
                            onChange={(e) => setNewMedicine({...newMedicine, time: e.target.value})}
                          />
                        </div>
                        <Button 
                          onClick={addMedicine}
                          className="w-full gestiva-gradient text-white hover:opacity-90"
                        >
                          Add Medicine
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicines.map((medicine) => (
                    <div key={medicine.id} className={`p-4 rounded-lg border ${medicine.taken ? 'bg-green-50 border-green-200' : 'bg-white border-[#AE794B]/20'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-[#6A452C]">{medicine.name}</h4>
                          <p className="text-sm text-[#976841]">{medicine.dosage} - {medicine.frequency}</p>
                        </div>
                        <Badge 
                          variant={medicine.taken ? "default" : "outline"}
                          className={medicine.taken ? "bg-green-500" : "border-[#AE794B] text-[#6A452C]"}
                        >
                          {medicine.taken ? "Taken" : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#976841] flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {medicine.time}
                        </span>
                        {!medicine.taken && (
                          <Button 
                            size="sm"
                            onClick={() => markAsTaken(medicine.id)}
                            className="gestiva-gradient text-white hover:opacity-90"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark as Taken
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#6A452C]">Today's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-r from-[#DB9C60]/10 to-[#AE794B]/10">
                    <div className="text-2xl font-bold text-[#AE794B]">
                      {medicines.filter(m => m.taken).length}/{medicines.length}
                    </div>
                    <p className="text-sm text-[#976841]">Medicines taken</p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-100 border border-yellow-200">
                    <h4 className="font-medium text-yellow-800">Pending</h4>
                    <p className="text-sm text-yellow-700">{todaysMedicines.length} medicines due</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reminder Settings */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#6A452C] flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Reminder Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-[#DB9C60]/10 to-[#AE794B]/10">
                  <h4 className="font-medium text-[#6A452C]">Push Notifications</h4>
                  <p className="text-sm text-[#976841]">Enabled for all medicines</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-[#DB9C60]/10 to-[#AE794B]/10">
                  <h4 className="font-medium text-[#6A452C]">Reminder Time</h4>
                  <p className="text-sm text-[#976841]">15 minutes before</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                >
                  Manage Settings
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#6A452C]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full gestiva-gradient text-white hover:opacity-90"
                  onClick={() => navigate('/diet-plan')}
                >
                  View Diet Plan
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                  onClick={() => navigate('/consult-doctor')}
                >
                  Consult Doctor
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineReminder;
