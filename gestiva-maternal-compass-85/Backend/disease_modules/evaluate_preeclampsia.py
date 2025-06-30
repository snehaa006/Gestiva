def evaluate_preeclampsia(today_symptoms, static_data, symptom_weights=None):
    score = 0
    reasons = []
    advice = []
    contributions = []

    if symptom_weights is None:
        symptom_weights = {
            "bp": 3.0,
            "swelling": 2.0,
            "headache": 1.5,
            "blurred_vision": 1.5,
            "frequent_urination": 1.0,
            "chronic_hypertension": 2.0,
            "diabetes": 2.0
        }

    color_map = {
        "bp": "#8B0000",                     # Dark Red
        "swelling": "#FF8C00",              # Dark Orange
        "headache": "#FF4500",              # Orange Red
        "blurred_vision": "#9932CC",        # Dark Orchid
        "frequent_urination": "#1E90FF",    # Dodger Blue
        "chronic_hypertension": "#DA70D6",  # Orchid
        "diabetes": "#FF69B4"               # Hot Pink
    }

    def add_contribution(symptom, label):
        contributions.append({
            "symptom": symptom,
            "weight": symptom_weights[symptom],
            "label": label,
            "color": color_map[symptom]
        })

    # --- Today's Symptoms ---
    if today_symptoms.get('bp', 0) >= 140:
        score += symptom_weights['bp']
        reasons.append("Blood pressure is high today (≥140 mmHg).")
        advice.append("→ Monitor your BP regularly and consult your doctor.")
        add_contribution("bp", "High Blood Pressure")

    if today_symptoms.get('swelling'):
        score += symptom_weights['swelling']
        reasons.append("Swelling in hands or face is present.")
        advice.append("→ Reduce salt intake and rest with feet elevated.")
        add_contribution("swelling", "Swelling")

    if today_symptoms.get('headache', 0) >= 4:
        score += symptom_weights['headache']
        reasons.append("Severe headache reported today.")
        advice.append("→ Take adequate rest and inform your healthcare provider.")
        add_contribution("headache", "Severe Headache")

    if today_symptoms.get('blurred_vision'):
        score += symptom_weights['blurred_vision']
        reasons.append("Blurred vision or visual disturbance reported.")
        advice.append("→ Avoid screen time and get your eyes checked.")
        add_contribution("blurred_vision", "Blurred Vision")

    if today_symptoms.get('frequent_urination', 0) <= 1:
        score += symptom_weights['frequent_urination']
        reasons.append("Very low urine output reported today.")
        advice.append("→ Ensure you're staying hydrated and inform your doctor.")
        add_contribution("frequent_urination", "Low Urination")

    # --- Static Risk Factors ---
    if static_data.get('chronic_hypertension'):
        score += symptom_weights['chronic_hypertension']
        reasons.append("Pre-existing chronic hypertension increases your risk.")
        advice.append("→ Follow your hypertension management plan carefully.")
        add_contribution("chronic_hypertension", "Chronic Hypertension")

    if static_data.get('diabetes'):
        score += symptom_weights['diabetes']
        reasons.append("History of diabetes is a known risk factor.")
        advice.append("→ Keep your blood sugar under control and avoid stress.")
        add_contribution("diabetes", "Diabetes History")

    max_score = sum(symptom_weights.values())
    probability = round((score / max_score) * 100) if max_score else 0

    if not reasons:
        risk = "Low Risk"
        probability = 0
        reasons = ["No major symptoms of preeclampsia were detected today."]
        advice = [
            "→ Continue tracking your BP and swelling daily.",
            "→ Maintain hydration and avoid high-sodium foods."
        ]
        contributions = []

    else:
        risk = "High" if probability >= 75 else "Moderate" if probability >= 45 else "Low"

    return {
        "risk": risk,
        "probability": f"{probability}%",
        "why": reasons,
        "next_steps": advice,
        "symptom_contributions": contributions
    }
