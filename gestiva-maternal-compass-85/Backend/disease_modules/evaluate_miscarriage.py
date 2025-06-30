def evaluate_miscarriage(today_symptoms, user_static_data=None, symptom_weights=None):
    score = 0
    reasons = []
    advice = []
    contributions = []

    if symptom_weights is None:
        symptom_weights = {
            "spotting": 2.0,
            "abdominal_pain": 2.0,
            "cramping": 1.5,
            "swelling": 1.0,
            "fever": 1.5,
            "previous_miscarriage": 2.0
        }

    # Priority color map for pie chart
    color_map = {
        "spotting": "#DC143C",             # Crimson
        "abdominal_pain": "#B22222",       # Firebrick
        "cramping": "#FF6347",             # Tomato
        "swelling": "#FFD700",             # Gold
        "fever": "#8B0000",                # Dark Red
        "previous_miscarriage": "#8A2BE2"  # Blue Violet
    }

    def add_contribution(symptom, label):
        contributions.append({
            "symptom": symptom,
            "weight": symptom_weights[symptom],
            "label": label,
            "color": color_map[symptom]
        })

    # --- Symptom Checks ---
    if today_symptoms.get("spotting", 0) >= 3:
        score += symptom_weights["spotting"]
        reasons.append("Spotting or light bleeding detected.")
        advice.append("→ Contact your doctor immediately to rule out complications.")
        add_contribution("spotting", "Spotting")

    if today_symptoms.get("abdominal_pain", 0) >= 3:
        score += symptom_weights["abdominal_pain"]
        reasons.append("Moderate to severe abdominal pain reported.")
        advice.append("→ Rest and consult your doctor if pain persists or worsens.")
        add_contribution("abdominal_pain", "Abdominal Pain")

    if today_symptoms.get("cramping", 0) >= 3:
        score += symptom_weights["cramping"]
        reasons.append("Notable cramping reported today.")
        advice.append("→ Mild cramps can be normal, but severe cramping should be evaluated.")
        add_contribution("cramping", "Cramping")

    if today_symptoms.get("swelling", 0) >= 3:
        score += symptom_weights["swelling"]
        reasons.append("Unusual swelling observed.")
        advice.append("→ Monitor swelling alongside other symptoms and consult your doctor.")
        add_contribution("swelling", "Swelling")

    if today_symptoms.get("fever", 0) and today_symptoms["fever"] >= 1:
        score += symptom_weights["fever"]
        reasons.append("Fever/body temperature is elevated.")
        advice.append("→ Fever during early pregnancy should not be ignored. Seek medical care.")
        add_contribution("fever", "Fever")

    if user_static_data and user_static_data.get("previous_miscarriage", False):
        score += symptom_weights["previous_miscarriage"]
        reasons.append("History of miscarriage increases current risk.")
        advice.append("→ Regular prenatal checkups are essential due to past miscarriage.")
        add_contribution("previous_miscarriage", "Past Miscarriage")

    # --- Scoring ---
    max_score = sum(symptom_weights.values())
    probability = round((score / max_score) * 100) if max_score else 0

    if not reasons:
        risk = "Low Risk"
        probability = 0
        advice = [
            "✅ No major signs of miscarriage risk today.",
            "→ Maintain a healthy lifestyle and prenatal care.",
            "→ Seek medical advice if unusual symptoms arise."
        ]
        contributions = []  # No pie chart for low risk

    else:
        risk = "High" if probability >= 75 else "Moderate" if probability >= 45 else "Low"

    return {
        "risk": risk,
        "probability": f"{probability}%",
        "why": reasons,
        "next_steps": advice,
        "symptom_contributions": contributions
    }
