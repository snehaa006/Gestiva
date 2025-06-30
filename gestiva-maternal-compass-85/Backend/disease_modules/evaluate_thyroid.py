def evaluate_thyroid(today_symptoms, symptom_weights=None):
    score = 0
    reasons = []
    advice = []
    contributions = []

    if symptom_weights is None:
        symptom_weights = {
            "fatigue": 2.0,
            "weight_gain": 1.5,
            "cold_intolerance": 2.0,
            "hair_loss": 1.5,
            "dry_skin": 1.0,
            "heart_rate": 1.5
        }

    color_map = {
        "fatigue": "#B22222",          # Firebrick
        "cold_intolerance": "#4682B4", # Steel Blue
        "hair_loss": "#DAA520",        # Goldenrod
        "dry_skin": "#D2B48C",         # Tan
        "weight_gain": "#A0522D",      # Sienna
        "heart_rate": "#8B0000"        # Dark Red
    }

    def add_contribution(symptom, label):
        contributions.append({
            "symptom": symptom,
            "weight": symptom_weights[symptom],
            "label": label,
            "color": color_map[symptom]
        })

    if today_symptoms.get('fatigue', 0) >= 4:
        score += symptom_weights["fatigue"]
        reasons.append("Severe fatigue reported.")
        advice.append("→ Get thyroid levels checked as fatigue is a common symptom of hypothyroidism.")
        add_contribution("fatigue", "Fatigue")

    if today_symptoms.get('cold_intolerance', 0) >= 3:
        score += symptom_weights["cold_intolerance"]
        reasons.append("Sensitivity to cold detected.")
        advice.append("→ This may indicate low thyroid function. Keep warm and consider a check-up.")
        add_contribution("cold_intolerance", "Cold Intolerance")

    if today_symptoms.get('hair_loss', 0) >= 3:
        score += symptom_weights["hair_loss"]
        reasons.append("Significant hair loss observed.")
        advice.append("→ Hair thinning could be due to thyroid imbalance. Discuss with your doctor.")
        add_contribution("hair_loss", "Hair Loss")

    if today_symptoms.get('dry_skin', 0) >= 3:
        score += symptom_weights["dry_skin"]
        reasons.append("Dry or rough skin noticed.")
        advice.append("→ Stay hydrated and consider thyroid testing.")
        add_contribution("dry_skin", "Dry Skin")

    if today_symptoms.get('weight_gain', 0) >= 2:
        score += symptom_weights["weight_gain"]
        reasons.append("Unusual weight gain without dietary change.")
        advice.append("→ Thyroid hormones regulate metabolism — get tested.")
        add_contribution("weight_gain", "Weight Gain")

    if today_symptoms.get('heart_rate', 0) < 60 and today_symptoms.get('heart_rate', 0) > 0:
        score += symptom_weights["heart_rate"]
        reasons.append("Low heart rate observed.")
        advice.append("→ Bradycardia can be linked to hypothyroidism. Monitor closely.")
        add_contribution("heart_rate", "Low Heart Rate")

    max_score = sum(symptom_weights.values())
    probability = round((score / max_score) * 100) if max_score else 0

    if not reasons:
        risk = "Low Risk"
        probability = 0
        reasons = ["No significant thyroid-related symptoms reported today."]
        advice = [
            "→ Keep tracking key symptoms weekly.",
            "→ Maintain a balanced diet and healthy routine."
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
