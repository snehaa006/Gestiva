
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HealthDetails from "./pages/HealthDetails";
import Dashboard from "./pages/Dashboard";
import SymptomTracker from "./pages/SymptomTracker";
import WeeklyTrends from "./pages/WeeklyTrends";
import ConsultDoctor from "./pages/ConsultDoctor";
import EmergencyAlert from "./pages/EmergencyAlert";
import DietPlan from "./pages/DietPlan";
import UltrasoundTracker from "./pages/UltrasoundTracker";
import MedicalRecord from "./pages/MedicalRecord";
import MedicineReminder from "./pages/MedicineReminder";
import FamilyAlerts from "./pages/FamilyAlerts";
import NotFound from "./pages/NotFound";
import ResultsPage from "./pages/ResultsPage";
import ProfilePage from "./pages/ProfilePage";
import FeedbackForm from "./pages/FeedbackForm";
import PersonalizedDietPlan from "./pages/PersonalizedDietPlan";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/health-details" element={<HealthDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/symptom-tracker" element={<SymptomTracker />} />
          <Route path="/consult-doctor" element={<ConsultDoctor />} />
          <Route path="/emergency-alert" element={<EmergencyAlert />} />
          <Route path="/diet-plan" element={<DietPlan />} />
          <Route path="/ultrasound-tracker" element={<UltrasoundTracker />} />
          <Route path="/medical-record" element={<MedicalRecord />} />
          <Route path="/medicine-reminder" element={<MedicineReminder />} />
          <Route path="/family-alerts" element={<FamilyAlerts />} />
          <Route path="/weekly-trends" element={<WeeklyTrends />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/premium" element={<PersonalizedDietPlan />} />
          


          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
