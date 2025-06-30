import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

type DiseaseReport = {
  risk_level: string;
  why: string[];
  recommendations?: string[];
};

type ReportData = {
  [disease: string]: DiseaseReport;
};

const WeeklyTrends = () => {
  const [reports, setReports] = useState<{ [date: string]: ReportData }>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      const daysRef = collection(db, "symptom_logs", user.uid, "days");
      const snapshot = await getDocs(daysRef);
      const fetched: { [key: string]: ReportData } = {};

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.disease_analysis) {
          fetched[docSnap.id] = data.disease_analysis;
        }
      });

      setReports(fetched);
      const sortedDates = Object.keys(fetched).sort().reverse();
      setSelectedDate(sortedDates[0] || "");
      setLoading(false);
    };

    fetchReports();
  }, []);

  const currentReport = reports[selectedDate];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#F5F0E8] to-[#E8DDD4]">
      <h1 className="text-2xl font-bold text-[#6A452C] mb-4">📅 Trends Dashboard</h1>

      {/* Dropdown for date selection */}
      <div className="mb-6">
        <label className="text-[#6A452C] font-semibold mr-2">Select Date:</label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-[#AE794B] px-4 py-2 rounded-md"
        >
          {Object.keys(reports)
            .sort()
            .reverse()
            .map((date) => (
              <option key={date} value={date}>
                {format(new Date(date), "EEE, dd MMM")}
              </option>
            ))}
        </select>
      </div>

      {/* Report display */}
      {loading ? (
        <p>Loading reports...</p>
      ) : currentReport && Object.keys(currentReport).length > 0 ? (
        <Card className="bg-white/90 backdrop-blur-sm p-4">
          <CardContent>
            <h2 className="text-xl font-semibold text-[#6A452C] mb-4">
              Analysis for {format(new Date(selectedDate), "do MMM yyyy")}
            </h2>

            {Object.entries(currentReport).map(([disease, data]) => (
              <div key={disease} className="mb-4">
                <h3 className="text-[#976841] font-semibold">{disease.toUpperCase()}</h3>
                <p className="text-sm mb-1">Risk: <strong>{data.risk_level}</strong></p>
                <ul className="list-disc ml-5 text-sm text-[#6A452C]">
                  {data.why.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <p className="text-[#976841]">No report found for {selectedDate}</p>
      )}
    </div>
  );
};

export default WeeklyTrends;
