def evaluate_mental_health(today_symptoms, symptom_weights=None):
    score = 0
    reasons = []
    advice = []
    contributions = []

    if symptom_weights is None:
        symptom_weights = {
            "mood": 2.0,
            "anxiety": 2.0,
            "sleep_disturbance": 1.5,
            "feeling_overwhelmed": 1.5,
            "hopelessness": 2.0,
            "harm_thoughts": 3.0,
            "support_level": 1.5
        }

    # Priority-based color coding
    color_map = {
        "mood": "#FF6B6B",
        "anxiety": "#FFA500",
        "sleep_disturbance": "#6A5ACD",
        "feeling_overwhelmed": "#20B2AA",
        "hopelessness": "#DC143C",
        "harm_thoughts": "#8B0000",  # High severity
        "support_level": "#9ACD32"
    }

    def add_contribution(symptom, label):
        contributions.append({
            "symptom": symptom,
            "weight": symptom_weights[symptom],
            "label": label,
            "color": color_map[symptom]
        })

    # --- Evaluate Symptoms ---
    if today_symptoms.get("mood", 0) <= 2:
        score += symptom_weights["mood"]
        reasons.append("Very low mood reported today.")
        advice.append("→ Talk to a counselor or therapist about emotional lows.")
        add_contribution("mood", "Low Mood")

    if today_symptoms.get("anxiety", 0) >= 4:
        score += symptom_weights["anxiety"]
        reasons.append("High anxiety observed.")
        advice.append("→ Practice calming techniques like deep breathing or journaling.")
        add_contribution("anxiety", "Anxiety")

    if today_symptoms.get("sleep_disturbance", 0) >= 4:
        score += symptom_weights["sleep_disturbance"]
        reasons.append("Severe sleep disturbance noted.")
        advice.append("→ Try sleep hygiene routines or relaxation exercises before bed.")
        add_contribution("sleep_disturbance", "Sleep Issues")

    if today_symptoms.get("feeling_overwhelmed", 0) >= 4:
        score += symptom_weights["feeling_overwhelmed"]
        reasons.append("Feeling overwhelmed today.")
        advice.append("→ Break tasks into smaller parts and ask for help.")
        add_contribution("feeling_overwhelmed", "Feeling Overwhelmed")

    if today_symptoms.get("hopelessness", 0) >= 4:
        score += symptom_weights["hopelessness"]
        reasons.append("Hopelessness is significantly high.")
        advice.append("→ Talk to a counselor or therapist about emotional lows.")
        add_contribution("hopelessness", "Hopelessness")

    if today_symptoms.get("harm_thoughts", False):
        score += symptom_weights["harm_thoughts"]
        reasons.append("Presence of harmful thoughts detected.")
        advice.append("→ Seek immediate support from a professional or trusted person.")
        add_contribution("harm_thoughts", "Harmful Thoughts")

    if today_symptoms.get("support_level", 5) <= 2:
        score += symptom_weights["support_level"]
        reasons.append("Low emotional or social support.")
        advice.append("→ Reach out to a friend, partner, or support group.")
        add_contribution("support_level", "Low Support")

    # --- Risk Scoring ---
    max_score = sum(symptom_weights.values())
    probability = round((score / max_score) * 100) if max_score else 0

    if not reasons:
        risk = "Low Risk"
        probability = 0
        advice = [
            "✅ No major symptoms of mental health concerns today.",
            "→ Practice stress reduction and self-care.",
            "→ Reach out for support if you notice changes in mood."
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
