
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Phone, Mail, Plus, Send, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const FamilyAlerts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "John (Husband)",
      phone: "+91 98765 43210",
      email: "john@email.com",
      relationship: "Spouse",
      priority: "Primary"
    },
    {
      id: 2,
      name: "Mom",
      phone: "+91 98765 43211",
      email: "mom@email.com",
      relationship: "Mother",
      priority: "Emergency"
    },
    {
      id: 3,
      name: "Sarah (Sister)",
      phone: "+91 98765 43212",
      email: "sarah@email.com",
      relationship: "Sister",
      priority: "Secondary"
    }
  ]);

  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "",
    priority: "Secondary"
  });

  const [alertMessage, setAlertMessage] = useState("");

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact = {
        id: Date.now(),
        ...newContact
      };
      setContacts([...contacts, contact]);
      setNewContact({
        name: "",
        phone: "",
        email: "",
        relationship: "",
        priority: "Secondary"
      });
      toast({
        title: "Contact Added",
        description: "New emergency contact has been added successfully.",
      });
    }
  };

  const sendAlert = (type: string, message: string) => {
    console.log(`Sending ${type} alert to all contacts:`, message);
    
    // Send to all contacts
    contacts.forEach(contact => {
      console.log(`Sending alert to ${contact.name} at ${contact.phone}`);
    });
    
    toast({
      title: "Alert Sent Successfully",
      description: `Your ${type} alert has been sent to all ${contacts.length} emergency contacts.`,
    });
  };

  const quickAlerts = [
    {
      type: "emergency",
      title: "Emergency Alert",
      message: "I need immediate assistance. Please contact me or call emergency services.",
      color: "from-red-500 to-red-600"
    },
    {
      type: "hospital",
      title: "Going to Hospital",
      message: "I'm heading to the hospital. Will update you soon.",
      color: "from-orange-500 to-orange-600"
    },
    {
      type: "checkup",
      title: "Doctor Visit",
      message: "At the doctor for routine checkup. Everything is fine.",
      color: "from-blue-500 to-blue-600"
    },
    {
      type: "update",
      title: "Health Update",
      message: "Sharing a health update with you.",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4] py-8 px-4">
      <div className="absolute inset-0 logo-bg opacity-5"></div>
      
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#DB9C60] to-[#AE794B] flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#6A452C] mb-2">Family Alerts</h1>
          <p className="text-[#976841]">Keep your loved ones informed about your health</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Alerts */}
          <div className="lg:col-span-2">
            <Card className="mb-8 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#6A452C]">Quick Alerts</CardTitle>
                <p className="text-[#976841]">Send instant updates to your family</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {quickAlerts.map((alert, index) => (
                    <Card key={index} className={`bg-gradient-to-r ${alert.color} text-white hover:scale-105 transition-transform cursor-pointer`}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{alert.title}</h4>
                        <p className="text-sm mb-3 opacity-90">{alert.message}</p>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => sendAlert(alert.type, alert.message)}
                          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Alert
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-[#6A452C] mb-3">Custom Message</h4>
                  <Textarea
                    placeholder="Type your custom message here..."
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    className="mb-4 border-[#AE794B]/30 focus:border-[#AE794B]"
                  />
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 gestiva-gradient text-white hover:opacity-90"
                      onClick={() => {
                        if (alertMessage.trim()) {
                          sendAlert('custom', alertMessage);
                          setAlertMessage("");
                        } else {
                          toast({
                            title: "Message Required",
                            description: "Please enter a message before sending.",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Custom Alert
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                      onClick={() => {
                        sendAlert('location', 'Sharing my current location with you.');
                        toast({
                          title: "Location Shared",
                          description: "Your location has been shared with all contacts.",
                        });
                      }}
                    >
                      Share Location
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-[#6A452C]">Emergency Contacts</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm"
                        className="gestiva-gradient text-white hover:opacity-90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle className="text-[#6A452C]">Add Emergency Contact</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="contactName" className="text-[#6A452C]">Name & Relationship</Label>
                          <Input
                            id="contactName"
                            value={newContact.name}
                            onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                            placeholder="e.g., John (Husband)"
                            className="border-[#AE794B]/30 focus:border-[#AE794B]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactPhone" className="text-[#6A452C]">Phone Number</Label>
                          <Input
                            id="contactPhone"
                            value={newContact.phone}
                            onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                            placeholder="+91 98765 43210"
                            className="border-[#AE794B]/30 focus:border-[#AE794B]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactEmail" className="text-[#6A452C]">Email</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            value={newContact.email}
                            onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                            placeholder="email@example.com"
                            className="border-[#AE794B]/30 focus:border-[#AE794B]"
                          />
                        </div>
                        <Button 
                          onClick={addContact}
                          className="w-full gestiva-gradient text-white hover:opacity-90"
                          disabled={!newContact.name || !newContact.phone}
                        >
                          Add Contact
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="p-4 rounded-lg border border-[#AE794B]/20 bg-gradient-to-r from-[#DB9C60]/5 to-[#AE794B]/5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-[#6A452C]">{contact.name}</h4>
                          <p className="text-sm text-[#976841]">{contact.relationship}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          contact.priority === 'Primary' ? 'bg-red-100 text-red-800' :
                          contact.priority === 'Emergency' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {contact.priority}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                          onClick={() => window.open(`tel:${contact.phone}`)}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                          onClick={() => window.open(`mailto:${contact.email}`)}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Email
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
            {/* Emergency Actions */}
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Emergency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="secondary"
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => {
                    window.open('tel:112');
                    sendAlert('emergency', 'Emergency call made to 112');
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call 112
                </Button>
                <Button 
                  variant="secondary"
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => sendAlert('emergency', 'EMERGENCY: I need immediate assistance. Please contact me or call emergency services.')}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Alert All Contacts
                </Button>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#6A452C]">Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-green-100 border border-green-200">
                  <p className="text-sm text-green-800">Checkup complete - all good!</p>
                  <span className="text-xs text-green-600">2 hours ago</span>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 border border-blue-200">
                  <p className="text-sm text-blue-800">Shared location with family</p>
                  <span className="text-xs text-blue-600">Yesterday</span>
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
                  onClick={() => navigate('/medical-record')}
                >
                  Share Medical Records
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                  onClick={() => navigate('/ultrasound-tracker')}
                >
                  Share Baby Updates
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

export default FamilyAlerts;
