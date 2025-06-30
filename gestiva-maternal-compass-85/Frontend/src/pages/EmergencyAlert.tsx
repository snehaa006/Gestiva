
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MapPin, Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmergencyAlert = () => {
  const navigate = useNavigate();

  const emergencyContacts = [
    { name: "Emergency Services", number: "911", type: "primary" },
    { name: "Poison Control", number: "1-800-222-1222", type: "secondary" },
    { name: "Pregnancy Helpline", number: "1-800-PREGNANT", type: "secondary" },
    { name: "Your Doctor", number: "9345678102", type: "primary" }
  ];

  const nearbyHospitals = [
    { name: "City General Hospital", distance: "2.3 miles", eta: "8 min" },
    { name: "Women's Medical Center", distance: "3.1 miles", eta: "12 min" },
    { name: "Emergency Care Center", distance: "4.2 miles", eta: "15 min" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4] py-8 px-4">
      <div className="absolute inset-0 logo-bg opacity-5"></div>
      
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#E85A85] to-[#DB7093] flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#6A452C] mb-2">Emergency Alert</h1>
          <p className="text-[#976841]">Quick access to emergency services and nearby facilities</p>
        </div>

        {/* SOS Button */}
        <Card className="mb-8 bg-gradient-to-r from-[#E85A85] to-[#DB7093] text-white animate-bounce-in">
          <CardContent className="p-8 text-center">
            <Button 
              size="lg" 
              className="bg-white text-[#E85A85] hover:bg-gray-100 text-2xl font-bold py-8 px-12 rounded-full"
              onClick={() => window.open('tel:911')}
            >
              <Phone className="w-8 h-8 mr-4" />
              SOS - CALL 911
            </Button>
            <p className="mt-4 text-lg">Press for immediate emergency assistance</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Contacts */}
          <Card className="bg-white/90 backdrop-blur-sm animate-slide-up">
            <CardHeader>
              <CardTitle className="text-[#6A452C] flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${contact.type === 'primary' ? 'bg-gradient-to-r from-[#E85A85]/10 to-[#DB7093]/10 border border-[#E85A85]/20' : 'bg-gradient-to-r from-[#DB9C60]/10 to-[#AE794B]/10'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-[#6A452C]">{contact.name}</h4>
                      <p className="text-[#976841]">{contact.number}</p>
                    </div>
                    <Button 
                      size="sm" 
                      className={contact.type === 'primary' ? 'bg-[#E85A85] hover:bg-[#DB7093]' : 'gestiva-gradient'}
                      onClick={() => window.open(`tel:${contact.number}`)}
                    >
                      Call
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Nearby Hospitals */}
          <Card className="bg-white/90 backdrop-blur-sm animate-slide-up" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <CardTitle className="text-[#6A452C] flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Nearby Hospitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nearbyHospitals.map((hospital, index) => (
                <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-[#DB9C60]/10 to-[#AE794B]/10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-[#6A452C]">{hospital.name}</h4>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-[#AE794B] text-[#6A452C]"
                      onClick={() => window.open(`https://maps.google.com/?q=${hospital.name}`)}
                    >
                      Directions
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-[#976841]">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hospital.distance}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {hospital.eta}
                    </span>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                onClick={() => window.open('https://maps.google.com/?q=hospitals+near+me')}
              >
                View All on Map
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Button 
            className="gestiva-gradient text-white hover:opacity-90 py-6"
            onClick={() => navigate('/consult-doctor')}
          >
            <Phone className="w-5 h-5 mr-2" />
            Consult Doctor
          </Button>
          <Button 
            className="gestiva-gradient text-white hover:opacity-90 py-6"
            onClick={() => navigate('/family-alerts')}
          >
            <Phone className="w-5 h-5 mr-2" />
            Alert Family
          </Button>
          <Button 
            variant="outline" 
            className="border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white py-6"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;
