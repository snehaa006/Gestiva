import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Stethoscope,
  AlertTriangle,
  Apple,
  Baby,
  FileText,
  Pill,
  Users,
  Phone,
  FlaskConical, // ✅ NEW ICON
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type ScheduleItem = {
  day: string;
  activity: string;
};

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FlaskConical,
      title: "GDM Risk Detector",
      description: "Predict your gestational diabetes risk with AI",
      path: "http://localhost:8501", 
      color: "from-[#E85A85] to-[#DB9C60]",
      external: true, 
    },
    {
      icon: Activity,
      title: "Daily Symptom Tracker",
      description: "Track your daily symptoms and health",
      path: "/symptom-tracker",
      color: "from-[#DB9C60] to-[#AE794B]",
    },
    {
      icon: Stethoscope,
      title: "Consult a Doctor",
      description: "Find and book appointments with specialists",
      path: "/consult-doctor",
      color: "from-[#AE794B] to-[#976841]",
    },
    {
      icon: AlertTriangle,
      title: "Emergency Alert",
      description: "Quick access to emergency services",
      path: "/emergency-alert",
      color: "from-[#E85A85] to-[#DB7093]",
    },
    {
      icon: Apple,
      title: "Personalized Diet Plan",
      description: "Custom nutrition plans for your pregnancy",
      path: "/diet-plan",
      color: "from-[#976841] to-[#6A452C]",
    },
    {
      icon: Baby,
      title: "Ultrasound Tracker",
      description: "Track your baby's development",
      path: "/ultrasound-tracker",
      color: "from-[#DB9C60] to-[#AE794B]",
    },
    {
      icon: FileText,
      title: "Medical Records",
      description: "Access your complete medical history",
      path: "/medical-record",
      color: "from-[#AE794B] to-[#976841]",
    },
    {
      icon: Pill,
      title: "Medicine Reminder",
      description: "Never miss your medications",
      path: "/medicine-reminder",
      color: "from-[#976841] to-[#6A452C]",
    },
    {
      icon: Users,
      title: "Family Alerts",
      description: "Keep your family informed",
      path: "/family-alerts",
      color: "from-[#DB9C60] to-[#AE794B]",
    },
  ];

  const weeklySchedule = [
    { day: "Monday", activity: "Prenatal Yoga", time: "10:00 AM", clickable: true },
    { day: "Tuesday", activity: "Dr. Priya Sharma", time: "2:00 PM", clickable: true },
    { day: "Wednesday", activity: "Nutrition Class", time: "11:00 AM", clickable: true },
    { day: "Thursday", activity: "Ultrasound", time: "3:00 PM", clickable: true },
    { day: "Friday", activity: "Rest Day", time: "All Day", clickable: true },
    { day: "Saturday", activity: "Prenatal Massage", time: "4:00 PM", clickable: true },
    { day: "Sunday", activity: "Family Time", time: "All Day", clickable: true },
  ];

  const handleScheduleClick = (item: ScheduleItem) => {
    if (item.activity.includes("Dr.")) navigate("/consult-doctor");
    else if (item.activity === "Ultrasound") navigate("/ultrasound-tracker");
    else if (item.activity === "Nutrition Class") navigate("/diet-plan");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4]">
      <div className="absolute inset-0 logo-bg opacity-5"></div>

      <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#DB9C60] to-[#AE794B] flex items-center justify-center">
              <img
                src="/lovable-uploads/8d50e58a-79d3-4b5c-9071-612145003593.png"
                alt="Gestiva Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#6A452C]">Gestiva Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
              onClick={() => navigate("/emergency-alert")}
            >
              <Phone className="w-4 h-4 mr-2" />
              SOS
            </Button>
            <Button
              variant="outline"
              className="border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
              onClick={() => navigate("/profile")}
            >
              My Profile
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-[#6A452C] mb-4">Welcome back! 👶</h2>
        </div>

        <Card className="mb-8 bg-white/90 backdrop-blur-sm animate-slide-up">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-[#6A452C]">Weekly Schedule</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weeklySchedule.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gradient-to-br from-[#DB9C60]/10 to-[#AE794B]/10 cursor-pointer hover:scale-105 transition-transform hover:shadow-md"
                  onClick={() => handleScheduleClick(item)}
                >
                  <div className="font-semibold text-[#6A452C]">{item.day}</div>
                  <div className="text-sm text-[#976841]">{item.activity}</div>
                  <div className="text-xs text-[#AE794B]">{item.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/90 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => {
                if (feature.external) {
                  window.open(feature.path, "_blank");
                } else {
                  navigate(feature.path);
                }
              }}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-[#6A452C] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#976841] mb-4">{feature.description}</p>
                <Button
                  size="sm"
                  className={`bg-gradient-to-r ${feature.color} text-white hover:opacity-90`}
                >
                  Access
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-10 gap-6">
          <Button
            className="bg-gradient-to-r from-[#DB9C60] to-[#AE794B] text-white px-6 py-3 hover:opacity-90"
            onClick={() => {
              const today = new Date().toISOString().split("T")[0];
              navigate(`/weekly-trends?date=${today}`);
            }}
          >
            📈 Trend Dashboard
          </Button>

          <Button
            className="bg-gradient-to-r from-[#DB9C60] to-[#AE794B] text-white px-6 py-3 hover:opacity-90"
            onClick={() => navigate("/feedback")}
          >
            📝 Feedback Form
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
