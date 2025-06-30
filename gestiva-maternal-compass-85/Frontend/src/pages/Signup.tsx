import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    location: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (loading) return;
    setLoading(true);
  
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
  
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        createdAt: new Date().toISOString()
      });
  
      toast({
        title: "✅ Signup Successful",
        description: "Welcome to Gestiva!",
      });
  
      navigate("/health-details");
  
    } catch (error: unknown) {
      let errorMessage = "Unknown error occurred";
  
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = String((error as { message?: unknown }).message);
      }
  
      if (errorMessage.includes("auth/email-already-in-use")) {
        toast({
          title: "⚠️ Account Already Exists",
          description: "Redirecting to login...",
          variant: "destructive"
        });
  
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }
  
      toast({
        title: "❌ Signup Failed",
        description: errorMessage,
        variant: "destructive"
      });
  
    } finally {
      setLoading(false); 
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4] flex items-center justify-center p-4">
      <div className="absolute inset-0 logo-bg opacity-5"></div>
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#DB9C60] to-[#AE794B] flex items-center justify-center">
            <img
              src="/lovable-uploads/8d50e58a-79d3-4b5c-9071-612145003593.png"
              alt="Gestiva Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#6A452C]">
            Join Gestiva
          </CardTitle>
          <p className="text-[#976841]">Create your pregnancy care account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                type="text"
                placeholder="Enter your city/location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, rememberMe: checked as boolean })
                }
              />
              <Label htmlFor="rememberMe" className="text-sm text-[#976841]">
                Remember me and keep me signed in
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full gestiva-gradient text-white hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#976841]">
              Already have an account?{" "}
              <Button
                variant="link"
                className="text-[#AE794B] hover:text-[#6A452C] p-0"
                onClick={() => navigate("/login")}
              >
                Sign in here
              </Button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              className="text-[#976841] hover:text-[#6A452C]"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
