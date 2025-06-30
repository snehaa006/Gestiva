import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Users, Award, Baby,BellPlus, Stethoscope,  FileBarChart2,Phone, Pill , MapPin,ShieldCheck,Thermometer} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(false); // This would be managed by auth context in real app

  const services = [
    { icon: Baby, title: "Maternal Risk Monitoring", description: "Continuous tracking to detect high-risk issues" },
    { icon: MapPin, title: "Location Based Support Mapping", description: "Suggests nearest health facilities, doctors based on user’s area." },
    { icon: ShieldCheck, title: "Diet Plans", description: "Trimester-wise meal planning to support your changing nutritional needs" },
    { icon: Thermometer, title: "Health Vitals Tracking", description: "Monitor BP, glucose, and Doppler readings regularly." },
    { icon: Pill, title: "Medication Reminder", description: "Add your medicines and get alerts when it’s time" },
    { icon: BellPlus, title: "Shared Notifications", description: "Instantly notify family during emergencies — real-time alerts at one click." },
    { icon: Users, title: "Trimester-Based Health Tips", description: "Tips based on stage of pregnancy, updated regularly" },
    { icon: FileBarChart2, title: "Weekly Reports", description: "Weekly insights to stay consistent" }
  ];

  const whyChooseUs = [
    {title :"Support through every pregnancy stage"},
    { title :"Care beyond just checkups"},
    { title: "Empathy meets smart technology"},
    { title: "Listens when your body speaks"}
  ];

  const handleAccessDashboard = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      toast({
        title: "Please sign in first",
        description: "You need to login to access the dashboard",
        variant: "destructive"
      });
      navigate('/login');
    }
  };

  const handleLearnMore = () => {
    // Scroll to services section
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#DB9C60] to-[#AE794B] flex items-center justify-center">
              <img 
                src="/lovable-uploads/logo.jpg" 
                alt="Gestiva Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#6A452C]">Gestiva</h1>
          </div>
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              className="border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button 
              className="gestiva-gradient text-white hover:opacity-90"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center animate-fade-in">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-[#6A452C] mb-6">
              Your Pregnancy Journey, <span className="text-[#AE794B]">Guided & Protected</span>
            </h2>
            <p className="text-xl text-[#976841] mb-8">
            More than tracking — Gestiva detects early warning signs and alerts you and your family instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gestiva-gradient text-white hover:opacity-90 animate-bounce-in"
                onClick={() => navigate('/signup')}
              >
                Get Started Today
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#DB9C60] to-[#AE794B] text-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 animate-slide-up">
              <img 
                src="/lovable-uploads/cfe5a1ad-b321-4382-b942-b08896e2b0b8.png" 
                alt="Pregnant Woman" 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="lg:w-1/2">
              <h3 className="text-4xl font-bold mb-6">WHY CHOOSE GESTIVA?</h3>
              <p className="text-lg mb-8 opacity-90">
              Because pregnancy deserves more than just a calendar.
              Gestiva gives you clarity, confidence, and care — every single day.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="py-16 px-4 bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4]">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold text-[#6A452C] mb-12">Our Services and Facilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm hover:scale-105 transition-transform duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#DB9C60] to-[#AE794B] rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-[#6A452C] mb-2">{service.title}</h4>
                  <p className="text-sm text-[#976841]">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4]">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-[#6A452C] mb-6">Ready to Begin Your Journey?</h3>
          <p className="text-lg text-[#976841] mb-8">
            Join thousands of mothers who trust Gestiva for their pregnancy care
          </p>
          <Button 
            size="lg" 
            className="gestiva-gradient text-white hover:opacity-90"
            onClick={() => navigate('/signup')}
          >
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#6A452C] text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DB9C60] to-[#AE794B] flex items-center justify-center">
              <img 
                src="/lovable-uploads/logo.jpg" 
                alt="Gestiva Logo" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="text-xl font-bold">Gestiva</span>
          </div>
          <p className="text-[#AE794B]">
            © 2025 Gestiva. All rights reserved. Your trusted pregnancy companion.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
