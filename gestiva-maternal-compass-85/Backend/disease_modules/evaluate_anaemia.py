def evaluate_anaemia(today_symptoms, symptom_weights=None):
    score = 0
    reasons = []
    advice = []
    contributions = []

    if symptom_weights is None:
        symptom_weights = {
            "fatigue": 1.5,
            "dizziness": 1.5,
            "breathlessness": 1.5,
            "heart_rate": 2.0,
            "pale_skin": 1.5,
            "cravings": 1.0,
            "iron_diet": 1.5
        }

    # Color map by importance
    color_map = {
        "fatigue": "#B22222",        # Firebrick
        "dizziness": "#CD5C5C",      # Indian Red
        "breathlessness": "#FF7F50", # Coral
        "heart_rate": "#8B0000",     # Dark Red (high priority)
        "pale_skin": "#FFA07A",      # Light Salmon
        "cravings": "#DAA520",       # Goldenrod
        "iron_diet": "#F4A460"       # Sandy Brown
    }

    # Symptom checks with scoring
    if today_symptoms.get("fatigue", 0) >= 4:
        score += symptom_weights["fatigue"]
        reasons.append("You reported severe fatigue today.")
        advice.append("→ Get your hemoglobin levels tested to rule out iron-deficiency anaemia.")
        contributions.append({
            "symptom": "fatigue",
            "weight": symptom_weights["fatigue"],
            "label": "Fatigue",
            "color": color_map["fatigue"]
        })

    if today_symptoms.get("dizziness", 0) >= 3:
        score += symptom_weights["dizziness"]
        reasons.append("You reported frequent dizziness.")
        advice.append("→ Stay hydrated and consult your doctor if it continues.")
        contributions.append({
            "symptom": "dizziness",
            "weight": symptom_weights["dizziness"],
            "label": "Dizziness",
            "color": color_map["dizziness"]
        })

    if today_symptoms.get("breathlessness", 0) >= 3:
        score += symptom_weights["breathlessness"]
        reasons.append("You are experiencing shortness of breath.")
        advice.append("→ This may indicate low oxygen levels. Get your blood checked.")
        contributions.append({
            "symptom": "breathlessness",
            "weight": symptom_weights["breathlessness"],
            "label": "Breathlessness",
            "color": color_map["breathlessness"]
        })

    if today_symptoms.get("heart_rate", 0) > 100:
        score += symptom_weights["heart_rate"]
        reasons.append("Your heart rate is elevated above 100 bpm.")
        advice.append("→ An increased heart rate may be compensating for low oxygen; consult your doctor.")
        contributions.append({
            "symptom": "heart_rate",
            "weight": symptom_weights["heart_rate"],
            "label": "High Heart Rate",
            "color": color_map["heart_rate"]
        })

    if today_symptoms.get("pale_skin", False):
        score += symptom_weights["pale_skin"]
        reasons.append("Pale skin can be a visible sign of anaemia.")
        advice.append("→ Consider a blood test and discuss iron supplements with your healthcare provider.")
        contributions.append({
            "symptom": "pale_skin",
            "weight": symptom_weights["pale_skin"],
            "label": "Pale Skin",
            "color": color_map["pale_skin"]
        })

    if today_symptoms.get("cravings", False):
        score += symptom_weights["cravings"]
        reasons.append("Unusual cravings (pica) are linked to iron deficiency.")
        advice.append("→ Pica is often related to low iron. Increase iron intake under medical advice.")
        contributions.append({
            "symptom": "cravings",
            "weight": symptom_weights["cravings"],
            "label": "Cravings (Pica)",
            "color": color_map["cravings"]
        })

    if today_symptoms.get("iron_diet", 5) <= 2:
        score += symptom_weights["iron_diet"]
        reasons.append("Your dietary iron intake seems too low.")
        advice.append("→ Add more iron-rich foods like spinach, lentils, dates, and jaggery.")
        contributions.append({
            "symptom": "iron_diet",
            "weight": symptom_weights["iron_diet"],
            "label": "Low Iron Diet",
            "color": color_map["iron_diet"]
        })

    max_score = sum(symptom_weights.values())
    probability = round((score / max_score) * 100) if max_score else 0

    if not reasons:
        risk = "Low Risk"
        probability = 0
        advice = [
            "✅ No major symptoms of anaemia today.",
            "→ Eat iron-rich foods and maintain a balanced diet.",
            "→ Follow up with healthcare provider if symptoms develop."
        ]
        contributions = []  # No pie chart if no contributing symptoms
    else:
        risk = "High" if probability >= 75 else "Moderate" if probability >= 45 else "Low"

    return {
        "risk": risk,
        "probability": f"{probability}%",
        "why": reasons,
        "next_steps": advice,
        "symptom_contributions": contributions
    }
