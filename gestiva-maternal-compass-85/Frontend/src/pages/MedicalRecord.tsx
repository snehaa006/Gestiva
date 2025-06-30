import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MedicalRecord = () => {
  const navigate = useNavigate();

  const records = [
    { date: "2024-04-15" },
    { date: "2024-04-01" },
    { date: "2024-03-15" },
    { date: "2024-03-01" }
  ];

  const vitals = {
    bloodPressure: "118/76 mmHg",
    weight: "145 lbs",
    heartRate: "72 bpm",
    temperature: "98.6°F"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4] py-8 px-4">
      <div className="absolute inset-0 logo-bg opacity-5"></div>
      
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#DB9C60] to-[#AE794B] flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#6A452C] mb-2">Medical Records</h1>
          <p className="text-[#976841]">Your complete pregnancy health records</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Records List */}
          <div className="lg:col-span-2">
            <Card className="mb-8 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-[#6A452C]">Recent Records</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {records.map((record, index) => (
                    <div key={index} className="p-4 rounded-lg border border-[#AE794B]/20 bg-[#AE794B]/5 text-[#6A452C]">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{record.date}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Vitals */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#6A452C] flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Current Vitals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(vitals).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-[#DB9C60]/10 to-[#AE794B]/10">
                    <span className="font-medium text-[#6A452C] capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-[#976841]">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Health Summary */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#6A452C]">Health Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-green-100 border border-green-200">
                  <h4 className="font-medium text-green-800">Overall Health</h4>
                  <p className="text-sm text-green-700">Excellent - No concerns</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 border border-blue-200">
                  <h4 className="font-medium text-blue-800">Baby Development</h4>
                  <p className="text-sm text-blue-700">On track for 24 weeks</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-100 border border-yellow-200">
                  <h4 className="font-medium text-yellow-800">Next Checkup</h4>
                  <p className="text-sm text-yellow-700">April 29, 2024</p>
                </div>
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
                  onClick={() => navigate('/consult-doctor')}
                >
                  Book Appointment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                  onClick={() => navigate('/symptom-tracker')}
                >
                  Log Symptoms
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

export default MedicalRecord;