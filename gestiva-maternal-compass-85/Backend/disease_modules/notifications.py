from datetime import datetime

def generate_tracking_notifications(history, today_date, last_input_date):
    notifications = []

    # --- DAILY REMINDER IF INPUT MISSING ---
    if last_input_date.date() != today_date.date():
        notifications.append("🔔 You haven’t logged today’s symptoms. Please update to get accurate insights.")

    # --- HELPER FUNCTION ---
    def recent_trend(symptom, threshold, comparison=">=", days=3):
        values = history.get(symptom, [])
        if len(values) < days:
            return False
        recent = values[-days:]
        if comparison == ">=":
            return all(v >= threshold for v in recent)
        elif comparison == "<=":
            return all(v <= threshold for v in recent)
        elif comparison == "==":
            return all(v == threshold for v in recent)
        return False

    # --- MENTAL HEALTH (track for 3 days) ---
    if recent_trend("mood", 2, "<="):
        notifications.append("⚠️ Mood low for 3+ days — possible emotional health issue.")
    if recent_trend("anxiety", 4, ">="):
        notifications.append("📌 Anxiety has been high for 3+ days. Consider stress relief or speaking with someone.")

    # --- GESTATIONAL DIABETES (3-day check okay) ---
    if recent_trend("thirst", 4, ">="):
        notifications.append("⚠️ Excessive thirst for 3+ days — possible GDM sign.")
    if recent_trend("urination", 10, ">="):
        notifications.append("📌 Frequent urination for 3+ days — monitor sugar-related symptoms.")

    # --- ANAEMIA (3-day fatigue + high HR) ---
    if recent_trend("fatigue", 4, ">=") and recent_trend("heart_rate", 100, ">="):
        notifications.append("⚠️ Fatigue with high heart rate for 3+ days — possible anaemia. Track iron intake.")

    # --- THYROID (some symptoms need longer) ---
    if recent_trend("cold_sensitivity", 4, ">=", days=5):
        notifications.append("📌 Persistent cold sensitivity over 5+ days — possible thyroid issue.")
    if recent_trend("hair_loss", 3, ">=", days=5):
        notifications.append("📌 Hair loss continues over 5+ days — may be related to hypothyroidism.")

    # --- PREECLAMPSIA (3-day check enough) ---
    if recent_trend("bp", 140, ">="):
        notifications.append("⚠️ High blood pressure for 3+ days — possible preeclampsia.")
    if recent_trend("swelling", 3, ">="):
        notifications.append("📌 Swelling present for 3+ days — monitor with other BP symptoms.")

    # --- UTI (3-day burning or smell) ---
    if recent_trend("burning_urine", 3, ">="):
        notifications.append("📌 Pain while urinating for 3+ days — possible UTI.")
    if recent_trend("foul_smell", 2, ">="):
        notifications.append("📌 Foul urine smell for 3+ days — may indicate infection.")

    # --- MISCARRIAGE RISK (2-day spotting + pain) ---
    if recent_trend("spotting", 1, ">=", days=2) and recent_trend("pain", 3, ">=", days=2):
        notifications.append("⚠️ Spotting with pain — could be early miscarriage warning. Seek medical attention.")

    return notifications




