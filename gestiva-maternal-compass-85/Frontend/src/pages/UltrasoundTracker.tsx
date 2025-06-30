import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UltrasoundTracker = () => {
  const navigate = useNavigate();

  const currentWeek = 24;

  const milestones = [
    { week: 12, title: "First Trimester Scan", status: "completed", date: "2024-01-15" },
    { week: 20, title: "Anatomy Scan", status: "completed", date: "2024-03-10" },
    { week: 24, title: "Growth Check", status: "current", date: "2024-04-15" },
    { week: 28, title: "Third Trimester Scan", status: "upcoming", date: "2024-05-15" },
    { week: 32, title: "Growth Assessment", status: "upcoming", date: "2024-06-10" },
    { week: 36, title: "Final Position Check", status: "upcoming", date: "2024-07-05" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4] py-8 px-4">
      <div className="absolute inset-0 logo-bg opacity-5"></div>

      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#DB9C60] to-[#AE794B] flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#6A452C] mb-2">Ultrasound Tracker</h1>
          <p className="text-[#976841]">Track your baby's development - Week {currentWeek}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-3">
            {/* Scan Schedule */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#6A452C] flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Scan Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${
                      milestone.status === 'completed' ? 'bg-green-100 border border-green-200' :
                      milestone.status === 'current' ? 'bg-[#AE794B]/20 border border-[#AE794B]' :
                      'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-[#6A452C]">{milestone.title}</h4>
                        <p className="text-sm text-[#976841]">Week {milestone.week}</p>
                      </div>
                      <div className="text-sm text-[#976841]">{milestone.date}</div>
                    </div>
                  </div>
                ))}
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
                  Book Next Scan
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                  onClick={() => navigate('/medical-record')}
                >
                  View All Records
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

export default UltrasoundTracker;