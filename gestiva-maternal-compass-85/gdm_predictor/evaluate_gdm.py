# evaluate_gdm.py

def evaluate_gdm(symptoms: dict) -> dict:
    symptom_weights = {
        "thirst": 0.1,
        "urination": 0.1,
        "fatigue": 0.1,
        "blurred_vision": 0.1,
        "nausea": 0.05,
        "vomiting": 0.05,
        "sugar_cravings": 0.05,
        "sweating": 0.05,
    }

    clinical_weights = {
        "fasting": 0.15,         # value expected in mg/dL
        "post_meal": 0.15,       # value expected in mg/dL
        "urine_sugar": 0.1,      # rating or presence 0–5
        "heart_rate": 0.05,      # actual value, e.g., 85
        "bmi": 0.05,             # actual BMI, e.g., 28
        "age": 0.05              # age in years
    }

    binary_factors = {
        "previous_gdm": 10,
        "family_history_diabetes": 10,
        "pcos": 10,
    }

    advice_map = {
        "thirst": "Stay hydrated and track water intake.",
        "urination": "Frequent urination can indicate high sugar levels.",
        "fatigue": "Ongoing fatigue may reflect sugar imbalance.",
        "blurred_vision": "Could be caused by elevated glucose.",
        "nausea": "Monitor if persistent.",
        "vomiting": "May require urgent care if severe.",
        "sugar_cravings": "Can relate to insulin imbalance.",
        "sweating": "Unusual sweating could suggest fluctuations.",
        "fasting": "High fasting glucose is a strong GDM indicator.",
        "post_meal": "Elevated post-meal glucose is significant for GDM.",
        "urine_sugar": "Sugar in urine suggests elevated blood sugar.",
        "heart_rate": "Elevated heart rate can accompany metabolic stress.",
        "bmi": "High BMI is a known GDM risk factor.",
        "age": "Age over 30 increases GDM risk.",
        "previous_gdm": "Previous GDM increases recurrence risk.",
        "family_history_diabetes": "Family history increases predisposition.",
        "pcos": "PCOS raises insulin resistance, increasing GDM risk.",
    }

    score = 0
    total_weight = 0
    reasons = []

    # SYMPTOM SCALE: 0–5 inputs
    for key, weight in symptom_weights.items():
        if key in symptoms and symptoms[key] not in [None, ""]:
            try:
                val = float(symptoms[key])
                score += val * weight
                total_weight += weight
                if val >= 3:
                    reasons.append(key)
            except ValueError:
                continue

    # CLINICAL: Apply thresholds and map them to 0–5 internally
    clinical_thresholds = {
        "fasting": lambda x: 5 if x >= 95 else 0,
        "post_meal": lambda x: 5 if x >= 140 else 0,
        "urine_sugar": lambda x: x if 0 <= x <= 5 else 0,
        "heart_rate": lambda x: 5 if x > 100 else 0,
        "bmi": lambda x: 5 if x >= 25 else 0,
        "age": lambda x: 5 if x >= 30 else 0,
    }

    for key, weight in clinical_weights.items():
        if key in symptoms and symptoms[key] not in [None, ""]:
            try:
                val = float(symptoms[key])
                mapped_val = clinical_thresholds[key](val)
                score += mapped_val * weight
                total_weight += weight
                if mapped_val >= 3:
                    reasons.append(key)
            except ValueError:
                continue

    # YES/NO FIELDS
    for key, points in binary_factors.items():
        if key in symptoms:
            value = str(symptoms[key]).lower()
            if value in ["1", "yes", "true"]:
                score += points
                total_weight += points
                reasons.append(key)

    probability = min((score / (total_weight or 1)) * 100, 100)

    if probability >= 60:
        risk = "High Risk"
    elif probability >= 30:
        risk = "Moderate Risk"
    else:
        risk = "Low Risk"

    final_advice = [advice_map[r] for r in reasons if r in advice_map]

    return {
        "risk_level": risk,
        "probability": round(probability, 2),
        "reasons": reasons,
        "advice": final_advice
    }
