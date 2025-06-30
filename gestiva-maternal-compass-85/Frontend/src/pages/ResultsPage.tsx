import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { getAuth } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type SymptomContribution = {
  symptom: string;
  weight: number;
  label: string;
};

type DiseaseData = {
  risk_level: string;
  why: string[];
  recommendations: string[];
  symptom_contributions?: SymptomContribution[];
};

type LocationState = {
  analysisResult: {
    [disease: string]: DiseaseData;
  };
  notifications: string[];
  formData: Record<string, string | number | boolean>;
  userInfo: {
    name: string;
    email: string;
  };
};

const getColorByWeight = (weight: number, maxWeight: number): string => {
  const intensity = Math.floor(255 - (weight / maxWeight) * 155);
  return `rgb(255, ${intensity}, ${intensity})`; // Red gradient
};

const ResultsPage = () => {
  const location = useLocation() as { state: LocationState };
  const navigate = useNavigate();

  if (!location.state) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-500">
          No results found. Please submit your symptoms first.
        </p>
        <Button onClick={() => navigate("/")}>🔙 Go to Symptom Tracker</Button>
      </div>
    );
  }

  const { analysisResult, notifications, formData, userInfo } = location.state;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-primary mb-6">
        🧠 Analysis Results
      </h1>

      {Object.entries(analysisResult).map(([key, data]) => {
        const maxWeight = Math.max(
          ...(data.symptom_contributions?.map((s) => s.weight) || [1])
        );

        return (
          <Card key={key} className="mb-6 bg-muted border rounded-lg">
            <CardHeader>
              <CardTitle className="capitalize text-primary">
                {key.replace("_", " ")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>Risk Level:</strong>{" "}
                <span
                  className={
                    data.risk_level.includes("High")
                      ? "text-red-500"
                      : data.risk_level.includes("Moderate")
                      ? "text-yellow-500"
                      : "text-green-600"
                  }
                >
                  {data.risk_level}
                </span>
              </p>

              {data.why?.length > 0 && (
                <div>
                  <strong>Why:</strong>
                  <ul className="list-disc ml-6 text-sm text-muted-foreground">
                    {data.why.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              {data.recommendations?.length > 0 && (
                <div>
                  <strong>Recommendations:</strong>
                  <ul className="list-disc ml-6 mt-1 text-sm text-muted-foreground">
                    {data.recommendations.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}

              {data.symptom_contributions?.length > 0 && (
                <div className="mt-6">
                  <strong>Symptom Contribution:</strong>
                  <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.symptom_contributions}
                          dataKey="weight"
                          nameKey="label"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name }) => name}
                        >
                          {data.symptom_contributions.map((entry, idx) => (
                            <Cell
                              key={`cell-${idx}`}
                              fill={getColorByWeight(entry.weight, maxWeight)}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Export PDF */}
      <div className="flex justify-center mt-8 gap-4">
        <Button
          onClick={async () => {
            try {
              const response = await fetch("http://localhost:5001/export-pdf", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  user_name: userInfo?.name,
                  email: userInfo?.email,
                  age: formData.age,
                  disease_analysis: analysisResult,
                  notifications: notifications,
                  history: {},
                }),
              });

              if (!response.ok) throw new Error("Export failed");

              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "Pregnancy_Health_Report.pdf";
              link.click();
            } catch (err) {
              console.error("❌ Export failed:", err);
              toast({
                title: "❌ Export Failed",
                description: "Could not download the PDF. Try again.",
                variant: "destructive",
              });
            }
          }}
        >
          📄 Export PDF
        </Button>

        {/* 💾 Save Report Button */}
        <Button
          variant="outline"
          className="border-[#AE794B] text-[#AE794B]"
          onClick={async () => {
            try {
              const user = getAuth().currentUser;
              if (!user) {
                toast({
                  title: "❌ Not Logged In",
                  description: "Please log in to save your report.",
                  variant: "destructive",
                });
                return;
              }

              const today = new Date().toISOString().split("T")[0];
              const ref = doc(db, "symptom_logs", user.uid, "days", today);

              await setDoc(ref, {
                user_id: user.uid,
                disease_analysis: analysisResult,
                submitted_at: serverTimestamp(),
              });

              toast({
                title: "✅ Report Saved",
                description: `Analysis for ${today} is now visible in your Weekly Trends.`,
              });
            } catch (err) {
              console.error("❌ Error saving report:", err);
              toast({
                title: "❌ Failed to Save",
                description: "Could not save report to trends. Try again.",
                variant: "destructive",
              });
            }
          }}
        >
          💾 Save Report to Trends
        </Button>
      </div>

      {/* Notifications */}
      {notifications?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-primary mb-2">
            🔔 Notifications
          </h2>
          <ul className="list-disc ml-6 text-sm text-muted-foreground">
            {notifications.map((note: string, idx: number) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Button
          className="bg-gradient-to-r from-[#DB9C60] to-[#AE794B] text-white hover:opacity-90"
          onClick={() => navigate("/dashboard")}
        >
          ⬅️ Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
