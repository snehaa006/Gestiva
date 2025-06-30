// src/pages/DietPlan.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Apple, Coffee, Utensils, Droplets, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type Meal = {
  time: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  foods: string[];
  calories: number;
};

const DietPlan = () => {
  const navigate = useNavigate();
  const [waterIntake, setWaterIntake] = useState(6);
  const [currentView, setCurrentView] = useState("today");
  const targetWater = 8;

  const dailyNutrition = {
    calories: { consumed: 1800, target: 2200 },
    protein: { consumed: 65, target: 80 },
    calcium: { consumed: 800, target: 1200 },
    iron: { consumed: 18, target: 27 }
  };

  const todayMealPlan = [
    { time: "Breakfast", icon: Coffee, foods: ["Fortified cereal with milk", "Sliced banana", "Orange juice"], calories: 420 },
    { time: "Mid-Morning", icon: Apple, foods: ["Greek yogurt", "Mixed berries"], calories: 180 },
    { time: "Lunch", icon: Utensils, foods: ["Grilled salmon", "Quinoa salad", "Steamed broccoli"], calories: 580 },
    { time: "Afternoon", icon: Apple, foods: ["Handful of almonds", "Apple slices"], calories: 220 },
    { time: "Dinner", icon: Utensils, foods: ["Lean chicken breast", "Sweet potato", "Green salad"], calories: 520 }
  ];

  const tomorrowMealPlan = [
    { time: "Breakfast", icon: Coffee, foods: ["Oatmeal with nuts", "Fresh strawberries", "Low-fat milk"], calories: 380 },
    { time: "Mid-Morning", icon: Apple, foods: ["Whole grain crackers", "Cheese slice"], calories: 200 },
    { time: "Lunch", icon: Utensils, foods: ["Grilled chicken salad", "Brown rice", "Steamed vegetables"], calories: 550 },
    { time: "Afternoon", icon: Apple, foods: ["Mixed nuts", "Orange"], calories: 190 },
    { time: "Dinner", icon: Utensils, foods: ["Baked fish", "Quinoa", "Mixed vegetables"], calories: 480 }
  ];

  const dayAfterTomorrowMealPlan = [
    { time: "Breakfast", icon: Coffee, foods: ["Whole grain toast", "Avocado spread", "Fresh orange juice"], calories: 350 },
    { time: "Mid-Morning", icon: Apple, foods: ["Greek yogurt parfait", "Granola"], calories: 210 },
    { time: "Lunch", icon: Utensils, foods: ["Lentil curry", "Brown rice", "Mixed vegetable salad"], calories: 520 },
    { time: "Afternoon", icon: Apple, foods: ["Fruit smoothie", "Whole grain crackers"], calories: 180 },
    { time: "Dinner", icon: Utensils, foods: ["Grilled tofu", "Quinoa pilaf", "Steamed broccoli"], calories: 490 }
  ];

  const supplements = [
    { name: "Prenatal Vitamin", dosage: "1 tablet daily", time: "With breakfast" },
    { name: "Folic Acid", dosage: "400 mcg", time: "Daily" },
    { name: "Iron", dosage: "27 mg", time: "With vitamin C" },
    { name: "Calcium", dosage: "1000 mg", time: "Split throughout day" }
  ];

  const incrementWater = () => {
    if (waterIntake < 12) {
      setWaterIntake(waterIntake + 1);
      toast({ title: "Water intake updated", description: `You've had ${waterIntake + 1} glasses today.` });
    }
  };

  const decrementWater = () => {
    if (waterIntake > 0) {
      setWaterIntake(waterIntake - 1);
      toast({ title: "Water intake updated", description: `Adjusted to ${waterIntake - 1} glasses.` });
    }
  };

  const handleNextDayPlan = () => {
    if (currentView === "today") {
      setCurrentView("tomorrow");
    } else if (currentView === "tomorrow") {
      setCurrentView("dayafter");
    } else {
      setCurrentView("today");
    }
  };

  const getCurrentMealPlan = () => {
    switch (currentView) {
      case "today": return { plan: todayMealPlan, title: "Today's Meal Plan" };
      case "tomorrow": return { plan: tomorrowMealPlan, title: "Tomorrow's Meal Plan" };
      case "dayafter": return { plan: dayAfterTomorrowMealPlan, title: "Day After Tomorrow's Meal Plan" };
      default: return { plan: todayMealPlan, title: "Today's Meal Plan" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4] py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#DB9C60] to-[#AE794B] flex items-center justify-center">
            <Apple className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#6A452C] mb-2">Personalized Diet Plan</h1>
          <p className="text-[#976841]">Nutrition guidance for a healthy pregnancy</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Nutrition Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Nutrition Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(dailyNutrition).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between font-medium">
                        <span className="capitalize">{key}</span>
                        <span>{value.consumed}/{value.target} {key === 'calories' ? 'kcal' : 'mg'}</span>
                      </div>
                      <Progress value={(value.consumed / value.target) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meal Plan */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{getCurrentMealPlan().title}</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={handleNextDayPlan}>
                      {currentView === "today" ? "Tomorrow" : currentView === "tomorrow" ? "Day After" : "Today"}
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/premium")}>
                      Premium
                      
                    </Button>
                    
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {getCurrentMealPlan().plan.map((meal, index) => (
                  <div key={index} className="flex gap-4 bg-[#fef9f4] p-4 rounded-md shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-[#DB9C60] flex items-center justify-center">
                      <meal.icon className="text-white w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between font-medium mb-1">
                        <span>{meal.time}</span>
                        <span>{meal.calories} kcal</span>
                      </div>
                      <ul className="text-sm text-[#6A452C] list-disc ml-5">
                        {meal.foods.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Water Intake */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  Water Intake
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{waterIntake}/{targetWater}</div>
                  <p className="text-muted-foreground">glasses today</p>
                </div>
                <Progress value={(waterIntake / targetWater) * 100} />
                <div className="flex gap-2">
                  <Button onClick={decrementWater} disabled={waterIntake <= 0}>-</Button>
                  <Button onClick={incrementWater} disabled={waterIntake >= 12}>+</Button>
                </div>
              </CardContent>
            </Card>

            {/* Supplements */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Supplements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {supplements.map((item, i) => (
                  <div key={i} className="p-3 bg-[#f9f0e4] rounded-md">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm">{item.dosage}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                ))}
                <Button variant="outline" onClick={() => navigate("/medicine-reminder")}>
                  Set Reminders
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlan;
