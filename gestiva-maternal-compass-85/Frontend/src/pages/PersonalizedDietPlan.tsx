import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Apple } from "lucide-react";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase"; // 🔁 Update path to your Firebase config

interface SymptomData {
  fatigue: number;
  heartRate: number;
  urinationCount: number;
  burningUrine: number;
  foulSmell: number;
  bloodPressure: number;
  swelling: number;
  coldSensitivity: number;
  hairLoss: number;
  fastingSugar: number;
  postMealSugar: number;
  pcos: boolean;
  previousGDM: boolean;
  mood: number;
  anxiety: number;
  irritability: number;
  abdominalPain: number;
  spotting: number;
}

interface Recommendation {
  condition: string;
  tips: string[];
}

const getPersonalizedDiet = (symptoms: SymptomData): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  if (symptoms.fatigue >= 3 && symptoms.heartRate < 60) {
    recommendations.push({
      condition: "Anaemia",
      tips: [
        "Eat iron-rich foods: spinach, beetroot, dates",
        "Pair with Vitamin C (e.g., lemon, orange) for better absorption",
        "Avoid tea/coffee right after meals",
      ],
    });
  }

  if (symptoms.urinationCount > 7 && (symptoms.burningUrine > 2 || symptoms.foulSmell > 2)) {
    recommendations.push({
      condition: "UTI",
      tips: [
        "Drink 3L of water daily",
        "Consume cranberry juice and probiotic curd",
        "Avoid spicy and oily foods",
      ],
    });
  }

  if (
    symptoms.fastingSugar > 95 ||
    symptoms.postMealSugar > 140 ||
    symptoms.pcos ||
    symptoms.previousGDM
  ) {
    recommendations.push({
      condition: "GDM",
      tips: [
        "Choose low GI foods: oats, dalia, multigrain chapati",
        "Eat small, frequent meals",
        "Avoid sugar, white rice, and fruit juices",
      ],
    });
  }

  if (symptoms.hairLoss > 2 && symptoms.coldSensitivity > 2) {
    recommendations.push({
      condition: "Thyroid",
      tips: [
        "Consume iodine-rich foods and nuts",
        "Avoid raw cabbage, cauliflower in large quantities",
        "Add selenium from sunflower seeds, eggs",
      ],
    });
  }

  if (symptoms.bloodPressure > 140 && symptoms.swelling > 2) {
    recommendations.push({
      condition: "Preeclampsia",
      tips: [
        "Reduce salt intake",
        "Include potassium-rich foods like banana, sweet potato",
        "Use healthy fats like olive oil and flaxseeds",
      ],
    });
  }

  if (symptoms.anxiety > 2 || symptoms.mood < 2 || symptoms.irritability > 2) {
    recommendations.push({
      condition: "Mental Health",
      tips: [
        "Add omega-3 sources: walnuts, chia seeds",
        "Consume tryptophan-rich foods like milk, almonds",
        "Include magnesium sources like spinach, banana",
      ],
    });
  }

  if (symptoms.abdominalPain > 2 || symptoms.spotting > 1) {
    recommendations.push({
      condition: "Miscarriage Risk",
      tips: [
        "Eat folate-rich foods: lentils, spinach, beets",
        "Avoid raw/papaya/pineapple",
        "Drink warm fluids and maintain rest",
      ],
    });
  }

  return recommendations;
};

const PersonalizedDietPlan = () => {
  const [personalizedDiet, setPersonalizedDiet] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          toast({ title: "Not logged in", description: "Please log in to view your diet plan." });
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "symptomTracker", user.uid, "entries"),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          toast({ title: "No symptom data found", description: "Please fill your symptom tracker." });
          setLoading(false);
          return;
        }

        const latestEntry = snapshot.docs[0].data() as SymptomData;
        const result = getPersonalizedDiet(latestEntry);
        setPersonalizedDiet(result);
      } catch (err) {
        console.error("Error fetching symptoms:", err);
        toast({ title: "Error", description: "Unable to load personalized diet plan." });
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#DB9C60] to-[#AE794B] flex items-center justify-center">
            <Apple className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#6A452C] mb-2">Personalized Diet Plan</h1>
          <p className="text-[#976841]">Tailored nutrition based on your current symptoms</p>
        </div>

        {loading ? (
          <p className="text-center text-[#976841]">Loading your personalized diet...</p>
        ) : personalizedDiet.length > 0 ? (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#6A452C]">Diet Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {personalizedDiet.map((plan, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-semibold text-[#6A452C] mb-2">{plan.condition}</h4>
                  <ul className="text-sm text-[#976841] list-disc ml-4">
                    {plan.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-[#976841]">No personalized recommendations found for current input.</p>
        )}
      </div>
    </div>
  );
};

export default PersonalizedDietPlan;
