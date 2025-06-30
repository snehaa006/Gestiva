import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";

import { serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Inside component
const auth = getAuth();
const user = auth.currentUser;

const SymptomTracker = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fasting: "",
    post_meal: "",
    urine_sugar: "",
    bp: "",
    heart_rate: "",
    thirst_level: "",
    frequent_urination: "",
    fatigue: "",
    hunger: "",
    blurred_vision: "",
    mood: "",
    anxiety: "",
    cold_sensitivity: "",
    hair_loss: "",
    swelling: "",
    pain: "",
    spotting: "",
    burning_urine: "",
    irritability: "",
    foul_smell: "",
    family_history_diabetes: "",
    previous_gdm: "",
    pcos: "",
    bmi: "",
    age: "",
    sleep: "",
    isolation: "",
    overwhelm: "",
    fever: "",
    cramping: "", // 0–5
    dry_skin: "", // 0–5
    support_level: "", // 0–5 (emotional support)
    pale_skin: "", // 0–5
    pica_craving: "", // 0–5 (craving for chalk, soil, etc.)
    cold_feet_hands: "", // 0–5
    headache: "", // 0–5
    dizziness: "", // 0–5
    breathlessness: "",
  });
  type DiseaseAnalysis = {
    [disease: string]: {
      risk_level: string;
      why: string[];
      recommendations: string[];
    };
  };

  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysis | null>(
    null
  );
  const [notifications, setNotifications] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value.trim() !== "") {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const REQUIRED_FIELDS = [
    "bp",
    "heart_rate",
    "thirst_level",
    "frequent_urination",
    "fatigue",
    "hunger",
    "blurred_vision",
    "sleep",
    "irritability",
    "isolation",
    "overwhelm",
    "mood",
    "anxiety",
    "cold_sensitivity",
    "hair_loss",
    "swelling",
    "pain",
    "spotting",
    "burning_urine",
    "foul_smell",
    "support_level",
    "cramping",
    "headache",
    "dizziness",
    "breathlessness",
    "pale_skin",
    "pica_craving",
    "cold_feet_hands",
    "bmi"
  ];
  
  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    let hasErrors = false;
  
    REQUIRED_FIELDS.forEach((key) => {
      const value = formData[key];
      const isEmpty =
        value === "" ||
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "");
  
      if (isEmpty) {
        newErrors[key] = true;
        hasErrors = true;
      }
    });
  
    setErrors(newErrors);
    return !hasErrors;
  };
  
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      toast({
        title: "❌ Incomplete Form",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }
  
    const processedData: Record<string, string | number | boolean> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value === "true") processedData[key] = true;
      else if (value === "false") processedData[key] = false;
      else if (!isNaN(Number(value))) processedData[key] = Number(value);
      else processedData[key] = value;
    });
  
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    const userId = currentUser?.uid || "demo_user";
  
    const payload = {
      ...processedData,
      user_id: userId,
    };
  
    try {
      // ✅ 1. Save to main collection (existing)
      await addDoc(collection(db, "symptom_logs"), {
        user_id: userId,
        submitted_at: serverTimestamp(),
        symptoms: processedData,
      });
  
      // ✅ 2. Save to `symptomTracker/{userId}/entries`
      await addDoc(collection(db, "symptomTracker", userId, "entries"), {
        ...processedData,
        timestamp: serverTimestamp(), // Required for ordering
      });
  
      // ✅ 3. Call backend for analysis
      const backendResponse = await fetch("http://localhost:5001/analyze-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const result = await backendResponse.json();
      console.log("✅ Backend result:", result);
  
      if (!backendResponse.ok || !result.success) {
        throw new Error(result?.error || "Failed to analyze symptoms");
      }
  
      // ✅ 4. Navigate to results
      navigate("/results", {
        state: {
          analysisResult: result.disease_analysis || {},
          notifications: result.notifications || [],
          formData: formData,
          userInfo: {
            name: currentUser?.displayName || "Anonymous",
            email: currentUser?.email || "N/A",
          },
        },
      });
    } catch (error) {
      console.error("❌ Submission/analysis error:", error);
      toast({
        title: "❌ Submission Error",
        description: "Failed to analyze your symptoms. Try again.",
        variant: "destructive",
      });
    }
  };
  

  return (
    <div className="min-h-screen bg-background">
      <div className="gestiva-gradient text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center animate-fade-in">
            🩺 Symptom Tracker
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto animate-slide-up">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Clinical Symptoms Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔬</span>
                  <h2 className="text-xl font-semibold text-primary">
                    Clinical Symptoms
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fasting"
                      className={errors.fasting ? "text-destructive" : ""}
                    >
                      Fasting Blood Sugar (mg/dL)
                    </Label>
                    <Input
                      id="fasting"
                      type="number"
                      value={formData.fasting}
                      onChange={(e) =>
                        handleInputChange("fasting", e.target.value)
                      }
                      className={errors.fasting ? "border-destructive" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="fever"
                      className={errors.fever ? "text-destructive" : ""}
                    >
                      Body Temperature (°F)
                    </Label>
                    <Input
                      id="fever"
                      type="number"
                      value={formData.fever}
                      onChange={(e) =>
                        handleInputChange("fever", e.target.value)
                      }
                      className={errors.fever ? "border-destructive" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="post_meal"
                      className={errors.post_meal ? "text-destructive" : ""}
                    >
                      Post-meal Blood Sugar (mg/dL)
                    </Label>
                    <Input
                      id="post_meal"
                      type="number"
                      value={formData.post_meal}
                      onChange={(e) =>
                        handleInputChange("post_meal", e.target.value)
                      }
                      className={errors.post_meal ? "border-destructive" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="urine_sugar"
                      className={errors.urine_sugar ? "text-destructive" : ""}
                    >
                      Urine Sugar Level
                    </Label>
                    <Select
                      value={formData.urine_sugar}
                      onValueChange={(value) =>
                        handleInputChange("urine_sugar", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          errors.urine_sugar ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">+</SelectItem>
                        <SelectItem value="2">++</SelectItem>
                        <SelectItem value="3">+++</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="bp"
                      className={errors.bp ? "text-destructive" : ""}
                    >
                      Blood Pressure (systolic) *
                    </Label>
                    <Input
                      id="bp"
                      type="number"
                      value={formData.bp}
                      onChange={(e) => handleInputChange("bp", e.target.value)}
                      className={errors.bp ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="heart_rate"
                      className={errors.heart_rate ? "text-destructive" : ""}
                    >
                      Heart Rate (bpm) *
                    </Label>
                    <Input
                      id="heart_rate"
                      type="number"
                      value={formData.heart_rate}
                      onChange={(e) =>
                        handleInputChange("heart_rate", e.target.value)
                      }
                      className={errors.heart_rate ? "border-destructive" : ""}
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Physical Symptoms Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👩‍⚕</span>
                  <h2 className="text-xl font-semibold text-primary">
                    Physical Symptoms(low = 0 , high = 5)
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="thirst_level"
                      className={errors.thirst_level ? "text-destructive" : ""}
                    >
                      Excessive Thirst (0–5) *
                    </Label>
                    <Input
                      id="thirst_level"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.thirst_level}
                      onChange={(e) =>
                        handleInputChange("thirst_level", e.target.value)
                      }
                      className={
                        errors.thirst_level ? "border-destructive" : ""
                      }
                      required
                    />
                  </div>
                  {/* Support Level (0–5) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="support_level"
                      className={errors.support_level ? "text-destructive" : ""}
                    >
                      Emotional/Social Support Level (0–5)
                    </Label>
                    <Input
                      id="support_level"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.support_level}
                      onChange={(e) =>
                        handleInputChange("support_level", e.target.value)
                      }
                      className={
                        errors.support_level ? "border-destructive" : ""
                      }
                      required
                    />
                  </div>
                  {/* Cramping (0–5) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="cramping"
                      className={errors.cramping ? "text-destructive" : ""}
                    >
                      Cramping (0–5)
                    </Label>
                    <Input
                      id="cramping"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.cramping}
                      onChange={(e) =>
                        handleInputChange("cramping", e.target.value)
                      }
                      className={errors.cramping ? "border-destructive" : ""}
                      required
                    />
                  </div>
                  {/* Dizziness (0–5) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="dizziness"
                      className={errors.dizziness ? "text-destructive" : ""}
                    >
                      Dizziness (0–5)
                    </Label>
                    <Input
                      id="dizziness"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.dizziness}
                      onChange={(e) =>
                        handleInputChange("dizziness", e.target.value)
                      }
                      className={errors.dizziness ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  {/* Breathlessness (0–5) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="breathlessness"
                      className={
                        errors.breathlessness ? "text-destructive" : ""
                      }
                    >
                      Breathlessness (0–5)
                    </Label>
                    <Input
                      id="breathlessness"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.breathlessness}
                      onChange={(e) =>
                        handleInputChange("breathlessness", e.target.value)
                      }
                      className={
                        errors.breathlessness ? "border-destructive" : ""
                      }
                      required
                    />
                  </div>

                  {/* Headache (0–5) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="headache"
                      className={errors.headache ? "text-destructive" : ""}
                    >
                      Headache (0–5)
                    </Label>
                    <Input
                      id="headache"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.headache}
                      onChange={(e) =>
                        handleInputChange("headache", e.target.value)
                      }
                      className={errors.headache ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  {/* Pale Skin (0–5) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="pale_skin"
                      className={errors.pale_skin ? "text-destructive" : ""}
                    >
                      Pale Skin (0–5)
                    </Label>
                    <Input
                      id="pale_skin"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.pale_skin}
                      onChange={(e) =>
                        handleInputChange("pale_skin", e.target.value)
                      }
                      className={errors.pale_skin ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  {/* Pica Cravings (0–5) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="pica_craving"
                      className={errors.pica_craving ? "text-destructive" : ""}
                    >
                      Cravings for non-food items (0–5)
                    </Label>
                    <Input
                      id="pica_craving"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.pica_craving}
                      onChange={(e) =>
                        handleInputChange("pica_craving", e.target.value)
                      }
                      className={
                        errors.pica_craving ? "border-destructive" : ""
                      }
                      required
                    />
                  </div>

                  {/* Cold Hands/Feet (0–5) */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="cold_feet_hands"
                      className={
                        errors.cold_feet_hands ? "text-destructive" : ""
                      }
                    >
                      Cold Hands or Feet (0–5)
                    </Label>
                    <Input
                      id="cold_feet_hands"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.cold_feet_hands}
                      onChange={(e) =>
                        handleInputChange("cold_feet_hands", e.target.value)
                      }
                      className={
                        errors.cold_feet_hands ? "border-destructive" : ""
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="frequent_urination"
                      className={
                        errors.frequent_urination ? "text-destructive" : ""
                      }
                    >
                      Urination Count (per day) *
                    </Label>
                    <Input
                      id="frequent_urination"
                      type="number"
                      value={formData.frequent_urination}
                      onChange={(e) =>
                        handleInputChange("frequent_urination", e.target.value)
                      }
                      className={
                        errors.frequent_urination ? "border-destructive" : ""
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="fatigue"
                      className={errors.fatigue ? "text-destructive" : ""}
                    >
                      Fatigue Level (0–5) *
                    </Label>
                    <Input
                      id="fatigue"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.fatigue}
                      onChange={(e) =>
                        handleInputChange("fatigue", e.target.value)
                      }
                      className={errors.fatigue ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="hunger"
                      className={errors.hunger ? "text-destructive" : ""}
                    >
                      Increased Hunger (0–5) *
                    </Label>
                    <Input
                      id="hunger"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.hunger}
                      onChange={(e) =>
                        handleInputChange("hunger", e.target.value)
                      }
                      className={errors.hunger ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="blurred_vision"
                      className={
                        errors.blurred_vision ? "text-destructive" : ""
                      }
                    >
                      Blurred Vision? *
                    </Label>
                    <Select
                      value={formData.blurred_vision}
                      onValueChange={(value) =>
                        handleInputChange("blurred_vision", value)
                      }
                      required
                    >
                      <SelectTrigger
                        className={
                          errors.blurred_vision ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="sleep"
                      className={errors.sleep ? "text-destructive" : ""}
                    >
                      Sleep Disturbance (0–5) *
                    </Label>
                    <Input
                      id="sleep"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.sleep}
                      onChange={(e) => {
                        handleInputChange("sleep", e.target.value); // value is string
                      }}
                      className={errors.sleep ? "border-destructive" : ""}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="irritability"
                      className={errors.irritability ? "text-destructive" : ""}
                    >
                      Irritability (1 to 5) *
                    </Label>
                    <Input
                      id="irritability"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.irritability}
                      onChange={(e) =>
                        handleInputChange("irritability", e.target.value)
                      } // ← keep as string
                      className={
                        errors.irritability ? "border-destructive" : ""
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="isolation"
                      className={errors.isolation ? "text-destructive" : ""}
                    >
                      Isolation (1–5) *
                    </Label>
                    <Input
                      id="isolation"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.isolation}
                      onChange={(e) =>
                        handleInputChange("isolation", e.target.value)
                      }
                      className={errors.isolation ? "border-destructive" : ""}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="overwhelm"
                      className={errors.overwhelm ? "text-destructive" : ""}
                    >
                      Feeling Overwhelmed (1–5) *
                    </Label>
                    <Input
                      id="overwhelm"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.overwhelm}
                      onChange={(e) =>
                        handleInputChange("overwhelm", e.target.value)
                      }
                      className={errors.overwhelm ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="mood"
                      className={errors.mood ? "text-destructive" : ""}
                    >
                      Mood (0–5) *
                    </Label>
                    <Input
                      id="mood"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.mood}
                      onChange={(e) =>
                        handleInputChange("mood", e.target.value)
                      }
                      className={errors.mood ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="anxiety"
                      className={errors.anxiety ? "text-destructive" : ""}
                    >
                      Anxiety (0–5) *
                    </Label>
                    <Input
                      id="anxiety"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.anxiety}
                      onChange={(e) =>
                        handleInputChange("anxiety", e.target.value)
                      }
                      className={errors.anxiety ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="cold_sensitivity"
                      className={
                        errors.cold_sensitivity ? "text-destructive" : ""
                      }
                    >
                      Cold Sensitivity (0–5) *
                    </Label>
                    <Input
                      id="cold_sensitivity"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.cold_sensitivity}
                      onChange={(e) =>
                        handleInputChange("cold_sensitivity", e.target.value)
                      }
                      className={
                        errors.cold_sensitivity ? "border-destructive" : ""
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="hair_loss"
                      className={errors.hair_loss ? "text-destructive" : ""}
                    >
                      Hair Loss Level (0–5) *
                    </Label>
                    <Input
                      id="hair_loss"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.hair_loss}
                      onChange={(e) =>
                        handleInputChange("hair_loss", e.target.value)
                      }
                      className={errors.hair_loss ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="swelling"
                      className={errors.swelling ? "text-destructive" : ""}
                    >
                      Swelling (0–5) *
                    </Label>
                    <Input
                      id="swelling"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.swelling}
                      onChange={(e) =>
                        handleInputChange("swelling", e.target.value)
                      }
                      className={errors.swelling ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="pain"
                      className={errors.pain ? "text-destructive" : ""}
                    >
                      Abdominal Pain (0–5) *
                    </Label>
                    <Input
                      id="pain"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.pain}
                      onChange={(e) =>
                        handleInputChange("pain", e.target.value)
                      }
                      className={errors.pain ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="spotting"
                      className={errors.spotting ? "text-destructive" : ""}
                    >
                      Spotting (0–5) *
                    </Label>
                    <Input
                      id="spotting"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.spotting}
                      onChange={(e) =>
                        handleInputChange("spotting", e.target.value)
                      }
                      className={errors.spotting ? "border-destructive" : ""}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="burning_urine"
                      className={errors.burning_urine ? "text-destructive" : ""}
                    >
                      Burning Urine (0–5) *
                    </Label>
                    <Input
                      id="burning_urine"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.burning_urine}
                      onChange={(e) =>
                        handleInputChange("burning_urine", e.target.value)
                      }
                      className={
                        errors.burning_urine ? "border-destructive" : ""
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="foul_smell"
                      className={errors.foul_smell ? "text-destructive" : ""}
                    >
                      Foul Urine Smell (0–5) *
                    </Label>
                    <Input
                      id="foul_smell"
                      type="number"
                      min="0"
                      max="5"
                      value={formData.foul_smell}
                      onChange={(e) =>
                        handleInputChange("foul_smell", e.target.value)
                      }
                      className={errors.foul_smell ? "border-destructive" : ""}
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Risk Factors Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧬</span>
                  <h2 className="text-xl font-semibold text-primary">
                    Risk Factors
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="bmi"
                      className={errors.bmi ? "text-destructive" : ""}
                    >
                      BMI *
                    </Label>
                    <Input
                      id="bmi"
                      type="number"
                      value={formData.bmi}
                      onChange={(e) => handleInputChange("bmi", e.target.value)}
                      className={errors.bmi ? "border-destructive" : ""}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto px-8"
                >
                  ✅ Submit Symptoms
                </Button>
              </div>
            </form>

            {analysisResult &&
              Object.entries(analysisResult)
                .filter(
                  ([_, data]) =>
                    data.risk_level !== undefined && data.risk_level !== null
                )
                .map(([key, data]) => (
                  <Card key={key} className="bg-muted border rounded-md mb-4">
                    <CardHeader>
                      <CardTitle className="capitalize text-primary">
                        {key.replace("_", " ")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">
                        <strong>Risk:</strong>{" "}
                        <span
                          className={
                            data.risk_level === "High"
                              ? "text-red-500"
                              : data.risk_level === "Moderate"
                              ? "text-yellow-500"
                              : "text-green-500"
                          }
                        >
                          {data.risk_level}
                        </span>
                      </p>
                      {data.why && data.why.length > 0 && (
                        <p className="text-sm">
                          <strong>Why:</strong> {data.why.join(", ")}
                        </p>
                      )}
                      {data.recommendations &&
                        data.recommendations.length > 0 && (
                          <p className="text-sm">
                            <strong>Recommendations:</strong>{" "}
                            {data.recommendations.join(", ")}
                          </p>
                        )}
                    </CardContent>
                  </Card>
                ))}
            <Button
              className="mt-6"
              onClick={async () => {
                try {
                  const response = await fetch("/api/export-pdf", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      user_name: user?.displayName || "Anonymous",
                      age: formData.age,
                      email: user?.email || "N/A",
                      history: {}, // ⛳️ (optional for now; you can send 7-day history later)
                      disease_analysis: analysisResult,
                      notifications: notifications,
                    }),
                  });

                  if (!response.ok) throw new Error("Failed to export PDF");

                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "Pregnancy_Health_Report.pdf";
                  link.click();
                } catch (err) {
                  console.error("❌ PDF export failed:", err);
                  toast({
                    title: "❌ Export Failed",
                    description:
                      "There was an issue exporting your PDF report.",
                    variant: "destructive",
                  });
                }
              }}
            >
              📄 Export PDF
            </Button>

            {notifications.length > 0 && (
              <div className="mt-10 space-y-4">
                <h2 className="text-xl font-semibold text-primary">
                  🔔 Notifications
                </h2>
                <ul className="list-disc ml-6 text-sm">
                  {notifications.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};



export default SymptomTracker;
