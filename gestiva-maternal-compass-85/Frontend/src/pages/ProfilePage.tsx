import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
type UserProfile = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  age?: number;
  height?: number;
  currentPregnancyWeek?: number;
  familyHistoryDiabetes?: boolean;
  pcos?: boolean;
  previousGDM?: boolean;
  previousPregnancies?: string;
  miscarriages?: string;
  fertilityIssues?: boolean | string;
  currentMedications?: string;
  chronicDiseases?: string | Record<string, boolean | string>;
  substanceUse?: string | Record<string, boolean>;
  exposureRisks?: boolean;
  exposureDetails?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        // Merge healthData into main object
        const merged = {
          ...data,
          ...(data.healthData || {}),
        };
        setProfile(merged);
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!profile)
    return <div className="text-center mt-10">Profile not found.</div>;

  // Helper function to check if value is not empty
  const hasValue = (val: unknown): boolean => {
    if (typeof val === "string") return val.trim() !== "";
    return val !== undefined && val !== null;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-[#6A3E2F]">
        My Pregnancy Profile
      </h2>
      <Card className="shadow-lg bg-[#FAF3EF]">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {hasValue(profile.fullName) && (
            <div>
              <Label>Full Name</Label>
              <Input value={profile.fullName} disabled />
            </div>
          )}
          {hasValue(profile.email) && (
            <div>
              <Label>Email</Label>
              <Input value={profile.email} disabled />
            </div>
          )}
          {hasValue(profile.phoneNumber) && (
            <div>
              <Label>Phone</Label>
              <Input value={profile.phoneNumber} disabled />
            </div>
          )}
          {hasValue(profile.location) && (
            <div>
              <Label>Location</Label>
              <Input value={profile.location} disabled />
            </div>
          )}
          {hasValue(profile.age) && (
            <div>
              <Label>Age</Label>
              <Input value={profile.age} disabled />
            </div>
          )}
          {hasValue(profile.height) && (
            <div>
              <Label>Height (cm)</Label>
              <Input value={profile.height} disabled />
            </div>
          )}
          {hasValue(profile.currentPregnancyWeek) && (
            <div>
              <Label>Pregnancy Week</Label>
              <Input value={profile.currentPregnancyWeek} disabled />
            </div>
          )}
          {hasValue(profile.familyHistoryDiabetes) && (
            <div className="flex items-center justify-between col-span-2">
              <Label>Family History of Diabetes</Label>
              <Switch checked={profile.familyHistoryDiabetes} disabled />
            </div>
          )}
          {hasValue(profile.pcos) && (
            <div className="flex items-center justify-between col-span-2">
              <Label>PCOS</Label>
              <Switch checked={profile.pcos} disabled />
            </div>
          )}
          {hasValue(profile.previousGDM) && (
            <div className="flex items-center justify-between col-span-2">
              <Label>Previous GDM</Label>
              <Switch checked={profile.previousGDM} disabled />
            </div>
          )}
          {hasValue(profile.previousPregnancies) && (
            <div className="col-span-2">
              <Label>Previous Pregnancies</Label>
              <Input value={profile.previousPregnancies} disabled />
            </div>
          )}
          {hasValue(profile.miscarriages) && (
            <div className="col-span-2">
              <Label>Miscarriages</Label>
              <Input value={profile.miscarriages} disabled />
            </div>
          )}
          {hasValue(profile.fertilityIssues) && (
            <div className="col-span-2">
              <Label>Fertility Issues</Label>
              <Textarea value={String(profile.fertilityIssues)} disabled />
            </div>
          )}
          {hasValue(profile.currentMedications) && (
            <div className="col-span-2">
              <Label>Current Medications</Label>
              <Textarea value={profile.currentMedications} disabled />
            </div>
          )}
          {hasValue(profile.chronicDiseases) && (
            <div className="col-span-2">
              <Label>Chronic Diseases</Label>
              <Textarea
                value={
                  typeof profile.chronicDiseases === "string"
                    ? profile.chronicDiseases
                    : JSON.stringify(profile.chronicDiseases)
                }
                disabled
              />
            </div>
          )}
          {hasValue(profile.substanceUse) && (
            <div className="col-span-2">
              <Label>Substance Use</Label>
              <Textarea
                value={
                  typeof profile.substanceUse === "string"
                    ? profile.substanceUse
                    : JSON.stringify(profile.substanceUse)
                }
                disabled
              />
            </div>
          )}
          {profile.exposureRisks && hasValue(profile.exposureDetails) && (
            <div className="col-span-2">
              <Label>Exposure Details</Label>
              <Textarea value={profile.exposureDetails} disabled />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
