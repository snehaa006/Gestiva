import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Phone, MessageCircle, MapPin, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  city: string;
  phone: string;
  experience: string;
  consultationFee: number;
  photoUrl: string;
};

const ConsultDoctor = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const snapshot = await getDocs(collection(db, "doctors"));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
        setDoctors(list);
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Failed to load doctor data." });
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const q = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.specialization.toLowerCase().includes(q) ||
      doc.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4] py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#6A452C]">Consult a Doctor</h1>
          <p className="text-[#976841]">Find and instantly chat or call a doctor near you.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 bg-white/90 backdrop-blur-sm p-6 rounded-lg">
          <div className="flex items-center gap-4">
            <Search className="text-[#976841] w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, or specialization..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Doctor Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/90 rounded-lg mb-6">
            <TabsTrigger value="available">Available Doctors</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Doctor List */}
              <div className="lg:col-span-2 space-y-6">
                {filteredDoctors.length === 0 && (
                  <p className="text-[#976841]">No doctors found for your search.</p>
                )}

                {filteredDoctors.map((doc) => (
                  <Card key={doc.id} className="bg-white/90 backdrop-blur-sm hover:shadow-md">
                    <CardContent className="flex gap-4 p-6">
                      {/* Profile Image */}
                      {doc.photoUrl ? (
                        <img
                          src={doc.photoUrl}
                          alt={doc.name}
                          className="w-24 h-24 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full border flex items-center justify-center bg-[#f4eae1]">
                          <User className="w-10 h-10 text-[#AE794B]" />
                        </div>
                      )}

                      {/* Doctor Info */}
                      <div className="flex-1 ml-2">
                        <h3 className="text-[#6A452C] font-semibold text-lg mb-1">{doc.name}</h3>
                        <p className="text-[#976841] text-sm mb-1">{doc.specialization}</p>
                        <p className="text-sm text-[#976841]">
                          <MapPin className="inline w-4 h-4 mr-1" />
                          {doc.city}
                        </p>
                        <p className="text-sm text-[#976841] mt-1">Experience: {doc.experience}</p>
                        <p className="text-sm text-[#976841] mt-1">Fee: ₹{doc.consultationFee}</p>

                        {/* Contact Buttons */}
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`tel:${doc.phone}`)}
                          >
                            <Phone className="w-4 h-4 mr-1" /> Call
                          </Button>
                          <Button
                            size="sm"
                            className="gestiva-gradient text-white"
                            onClick={() =>
                              window.open(
                                `https://wa.me/${doc.phone.replace(/\D/g, "")}?text=Hello%20Dr.%20${encodeURIComponent(doc.name)}`,
                                "_blank"
                              )
                            }
                          >
                            <MessageCircle className="w-4 h-4 mr-1" /> Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="bg-white/90 backdrop-blur-sm p-6">
                  <CardTitle className="text-[#6A452C] mb-4">Quick Actions</CardTitle>
                  <Button
                    className="w-full gestiva-gradient mb-3"
                    onClick={() => navigate("/emergency-alert")}
                  >
                    🚨 Emergency Alert
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full mb-3"
                    onClick={() => navigate("/medical-record")}
                  >
                    🗂 View Medical Records
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/dashboard")}
                  >
                    🔙 Back to Dashboard
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsultDoctor;
