import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const HealthDetails = () => {
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState({
    previousPregnancies: "",
    miscarriages: "",
    fertilityIssues: false,
    currentMedications: "",
    chronicDiseases: {
      diabetes: false,
      thyroid: false,
      hypertension: false,
      other: "",
    },
    substanceUse: {
      smoking: false,
      alcohol: false,
      drugs: false,
    },
    exposureRisks: false,
    exposureDetails: "",
    familyHistoryDiabetes: false,
    pcos: false,
    previousGDM: false,
    age: "",
    height: "",
    currentPregnancyWeek: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please login first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        healthData,
      });

      toast({
        title: "✅ Health details saved!",
        description: "Redirecting to dashboard...",
      });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("Error saving health data:", error);
      toast({
        title: "❌ Error saving data",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4] py-8 px-4">
      <div className="absolute inset-0 logo-bg opacity-5"></div>
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl animate-fade-in">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#DB9C60] to-[#AE794B] flex items-center justify-center">
              <img
                src="/lovable-uploads/8d50e58a-79d3-4b5c-9071-612145003593.png"
                alt="Gestiva Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-[#6A452C]">
              Health & Medical History
            </CardTitle>
            <p className="text-[#976841]">
              All fields are mandatory for personalized care
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pregnancies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Previous Pregnancies *"
                  value={healthData.previousPregnancies}
                  onChange={(v) =>
                    setHealthData({ ...healthData, previousPregnancies: v })
                  }
                />
                <InputField
                  label="Miscarriages *"
                  value={healthData.miscarriages}
                  onChange={(v) =>
                    setHealthData({ ...healthData, miscarriages: v })
                  }
                />
              </div>

              {/* Age, Height, Pregnancy Week */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Age *"
                  value={healthData.age}
                  onChange={(v) => setHealthData({ ...healthData, age: v })}
                />
                <InputField
                  label="Height (cm) *"
                  value={healthData.height}
                  onChange={(v) => setHealthData({ ...healthData, height: v })}
                />
                <InputField
                  label="Pregnancy Week *"
                  value={healthData.currentPregnancyWeek}
                  onChange={(v) =>
                    setHealthData({ ...healthData, currentPregnancyWeek: v })
                  }
                />
              </div>

              {/* Fertility Issues */}
              <CheckboxItem
                label="Known fertility issues"
                value={healthData.fertilityIssues}
                onChange={(val) =>
                  setHealthData({ ...healthData, fertilityIssues: val })
                }
              />

              {/* Medications */}
              <Label className="text-[#6A452C] font-medium">
                Current Medications *
              </Label>
              <Textarea
                placeholder="List any medications you're currently taking"
                value={healthData.currentMedications}
                onChange={(e) =>
                  setHealthData({
                    ...healthData,
                    currentMedications: e.target.value,
                  })
                }
                className="border-[#AE794B]/30 focus:border-[#AE794B]"
                required
              />

              {/* Chronic Diseases */}
              <Label className="text-[#6A452C] font-medium">
                Chronic Diseases *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(["diabetes", "thyroid", "hypertension"] as const).map(
                  (disease) => (
                    <CheckboxItem
                      key={disease}
                      label={disease.charAt(0).toUpperCase() + disease.slice(1)}
                      value={healthData.chronicDiseases[disease]}
                      onChange={(val) =>
                        setHealthData({
                          ...healthData,
                          chronicDiseases: {
                            ...healthData.chronicDiseases,
                            [disease]: val,
                          },
                        })
                      }
                    />
                  )
                )}
              </div>
              <Input
                placeholder="Other chronic conditions"
                value={healthData.chronicDiseases.other}
                onChange={(e) =>
                  setHealthData({
                    ...healthData,
                    chronicDiseases: {
                      ...healthData.chronicDiseases,
                      other: e.target.value,
                    },
                  })
                }
                className="border-[#AE794B]/30 focus:border-[#AE794B]"
              />

              {/* Conditions: Family History, PCOS, GDM */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <CheckboxItem
                  label="Family history of diabetes"
                  value={healthData.familyHistoryDiabetes}
                  onChange={(val) =>
                    setHealthData({ ...healthData, familyHistoryDiabetes: val })
                  }
                />
                <CheckboxItem
                  label="PCOS"
                  value={healthData.pcos}
                  onChange={(val) =>
                    setHealthData({ ...healthData, pcos: val })
                  }
                />
                <CheckboxItem
                  label="Previous GDM"
                  value={healthData.previousGDM}
                  onChange={(val) =>
                    setHealthData({ ...healthData, previousGDM: val })
                  }
                />
              </div>

              {/* Substance Use */}
              <Label className="text-[#6A452C] font-medium">
                Substance Use *
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {["smoking", "alcohol", "drugs"].map((item) => (
                  <CheckboxItem
                    key={item}
                    label={item.charAt(0).toUpperCase() + item.slice(1)}
                    value={
                      healthData.substanceUse[
                        item as keyof typeof healthData.substanceUse
                      ]
                    }
                    onChange={(val) =>
                      setHealthData({
                        ...healthData,
                        substanceUse: {
                          ...healthData.substanceUse,
                          [item]: val,
                        },
                      })
                    }
                  />
                ))}
              </div>

              {/* Exposure */}
              <CheckboxItem
                label="Exposure to radiation or toxic chemicals"
                value={healthData.exposureRisks}
                onChange={(val) =>
                  setHealthData({ ...healthData, exposureRisks: val })
                }
              />
              {healthData.exposureRisks && (
                <Textarea
                  placeholder="Please describe the exposure details"
                  value={healthData.exposureDetails}
                  onChange={(e) =>
                    setHealthData({
                      ...healthData,
                      exposureDetails: e.target.value,
                    })
                  }
                  className="border-[#AE794B]/30 focus:border-[#AE794B]"
                  required
                />
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-[#AE794B] text-[#6A452C] hover:bg-[#AE794B] hover:text-white"
                  onClick={() => navigate("/signup")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gestiva-gradient text-white hover:opacity-90"
                >
                  Continue to Dashboard
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Reusable Input field
const InputField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div className="space-y-2">
    <Label className="text-[#6A452C] font-medium">{label}</Label>
    <Input
      type="number"
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border-[#AE794B]/30 focus:border-[#AE794B]"
      required
    />
  </div>
);

// Reusable Checkbox
const CheckboxItem = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
}) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      checked={value}
      onCheckedChange={(checked) => onChange(checked as boolean)}
      className="border-[#AE794B] data-[state=checked]:bg-[#AE794B]"
    />
    <Label className="text-sm text-[#976841]">{label}</Label>
  </div>
);

export default HealthDetails;
