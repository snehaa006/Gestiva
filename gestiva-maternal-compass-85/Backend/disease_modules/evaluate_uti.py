def evaluate_uti(today_symptoms, symptom_weights=None):
    score = 0
    reasons = []
    advice = []
    contributions = []

    if symptom_weights is None:
        symptom_weights = {
            "burning_urination": 2.0,
            "frequent_urination": 1.5,
            "cloudy_urine": 1.5,
            "fever": 1.5,
            "blood_in_urine": 2.0,
            "incomplete_emptying": 1.5
        }

    color_map = {
        "burning_urination": "#FF4500",       # Orange Red
        "frequent_urination": "#FFA500",      # Orange
        "cloudy_urine": "#BDB76B",            # Dark Khaki
        "fever": "#DC143C",                   # Crimson
        "blood_in_urine": "#8B0000",          # Dark Red
        "incomplete_emptying": "#DAA520"      # Goldenrod
    }

    def add_contribution(symptom, label):
        contributions.append({
            "symptom": symptom,
            "weight": symptom_weights[symptom],
            "label": label,
            "color": color_map[symptom]
        })

    # --- Symptom Checks ---
    if today_symptoms.get('burning_urination', 0) >= 3:
        score += symptom_weights['burning_urination']
        reasons.append("Burning sensation while urinating is severe today.")
        advice.append("→ Increase water intake to help flush out bacteria.")
        add_contribution("burning_urination", "Burning Urination")

    if today_symptoms.get('frequent_urination', 0) >= 9:
        score += symptom_weights['frequent_urination']
        reasons.append("Urination frequency is high today.")
        advice.append("→ Try not to hold urine for long durations.")
        add_contribution("frequent_urination", "Frequent Urination")

    if today_symptoms.get('cloudy_urine', False):
        score += symptom_weights['cloudy_urine']
        reasons.append("Cloudy or foul-smelling urine reported.")
        advice.append("→ Maintain good hygiene and drink more fluids.")
        add_contribution("cloudy_urine", "Cloudy Urine")

    if today_symptoms.get('fever', 0) >= 1:
        score += symptom_weights['fever']
        reasons.append("Fever detected — possible sign of infection.")
        advice.append("→ If fever persists, seek medical consultation.")
        add_contribution("fever", "Fever")

    if today_symptoms.get('blood_in_urine', False):
        score += symptom_weights['blood_in_urine']
        reasons.append("Blood in urine may indicate a more severe UTI.")
        advice.append("→ Visit a doctor immediately for a urine test.")
        add_contribution("blood_in_urine", "Blood in Urine")

    if today_symptoms.get('incomplete_emptying', 0) >= 3:
        score += symptom_weights['incomplete_emptying']
        reasons.append("Bladder does not feel fully empty after urination.")
        advice.append("→ Keep track of urination patterns and consult if persistent.")
        add_contribution("incomplete_emptying", "Incomplete Emptying")

    # --- Scoring ---
    max_score = sum(symptom_weights.values())
    probability = round((score / max_score) * 100) if max_score else 0

    if not reasons:
        risk = "Low Risk"
        probability = 0
        reasons = ["✅ No major symptoms of UTI today."]
        advice = [
            "→ Stay hydrated and maintain hygiene.",
            "→ Track urination and discomfort regularly."
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
