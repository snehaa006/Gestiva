def evaluate_gdm(today_symptoms, glucose_test=None, static_data=None, symptom_weights=None):
    score = 0
    reasons = []
    advice = []
    contributions = []

    if symptom_weights is None:
        symptom_weights = {
            "thirst": 1.5,
            "urination": 1.5,
            "fatigue": 1.0,
            "blurred_vision": 2.0,
            "increased_hunger": 1.5,
            "glucose": 3.0,
            "urine_sugar": 2.0,
            "bmi": 2.0,
            "heart_rate": 1.5,
            "age": 1.0,
            "previous_gdm": 2.0,
            "family_history_diabetes": 2.0,
            "pcos": 1.5
        }

    # Color map based on priority
    color_map = {
        "thirst": "#FFA07A",
        "urination": "#FFD700",
        "fatigue": "#E9967A",
        "blurred_vision": "#FF4500",
        "increased_hunger": "#F4A460",
        "glucose": "#8B0000",  # highest priority
        "urine_sugar": "#CD5C5C",
        "bmi": "#DA70D6",
        "heart_rate": "#BC8F8F",
        "age": "#9ACD32",
        "previous_gdm": "#DC143C",
        "family_history_diabetes": "#8A2BE2",
        "pcos": "#FF69B4"
    }

    def get_num(val):
        try:
            return float(val) if val is not None else 0
        except (ValueError, TypeError):
            return 0

    def add_contribution(symptom, label):
        contributions.append({
            "symptom": symptom,
            "weight": symptom_weights[symptom],
            "label": label,
            "color": color_map[symptom]
        })

    if get_num(today_symptoms.get("thirst_level")) >= 4:
        score += symptom_weights["thirst"]
        reasons.append("Unusually high thirst reported.")
        advice.append("→ Drink more water and monitor thirst throughout the day.")
        add_contribution("thirst", "High Thirst")

    if get_num(today_symptoms.get("frequent_urination")) >= 4:
        score += symptom_weights["urination"]
        reasons.append("Frequent urination observed.")
        advice.append("→ Avoid excess fluids before bedtime and track urination pattern.")
        add_contribution("urination", "Frequent Urination")

    if get_num(today_symptoms.get("fatigue")) >= 4:
        score += symptom_weights["fatigue"]
        reasons.append("Severe fatigue reported.")
        advice.append("→ Get adequate rest and monitor your energy levels.")
        add_contribution("fatigue", "Fatigue")

    if get_num(today_symptoms.get("hunger")) >= 4:
        score += symptom_weights["increased_hunger"]
        reasons.append("Increased hunger noted.")
        advice.append("→ Opt for high-fiber foods and avoid skipping meals.")
        add_contribution("increased_hunger", "Increased Hunger")

    if today_symptoms.get("blurred_vision", False):
        score += symptom_weights["blurred_vision"]
        reasons.append("Blurred vision can indicate glucose fluctuations.")
        advice.append("→ Consider getting your blood sugar checked soon.")
        add_contribution("blurred_vision", "Blurred Vision")

    if get_num(today_symptoms.get("heart_rate")) > 100:
        score += symptom_weights["heart_rate"]
        reasons.append("High heart rate detected (>100 bpm).")
        advice.append("→ Stay hydrated and avoid overexertion.")
        add_contribution("heart_rate", "High Heart Rate")

    if get_num(today_symptoms.get("bmi")) >= 28:
        score += symptom_weights["bmi"]
        reasons.append("High BMI increases GDM risk.")
        advice.append("→ Maintain a balanced diet and engage in safe physical activity.")
        add_contribution("bmi", "High BMI")

    if static_data:
        if get_num(static_data.get("age")) >= 30:
            score += symptom_weights["age"]
            reasons.append("Age ≥ 30 lowers insulin sensitivity.")
            advice.append("→ Attend regular glucose screening after age 30.")
            add_contribution("age", "Age ≥ 30")

        if static_data.get("previous_gdm", False):
            score += symptom_weights["previous_gdm"]
            reasons.append("Previous GDM increases recurrence risk.")
            advice.append("→ Early OGTT is strongly recommended.")
            add_contribution("previous_gdm", "Previous GDM")

        if static_data.get("family_history_diabetes", False):
            score += symptom_weights["family_history_diabetes"]
            reasons.append("Family history of diabetes present.")
            advice.append("→ Be extra mindful of diet and exercise.")
            add_contribution("family_history_diabetes", "Family History")

        if static_data.get("pcos", False):
            score += symptom_weights["pcos"]
            reasons.append("PCOS is linked to insulin resistance.")
            advice.append("→ Reduce refined sugar intake and monitor weight.")
            add_contribution("pcos", "PCOS")

    if glucose_test:
        if glucose_test.get("fasting") is not None and get_num(glucose_test.get("fasting")) > 95:
            score += symptom_weights["glucose"]
            reasons.append("Fasting glucose above 95 mg/dL.")
            advice.append("→ Consult your doctor for OGTT if not already done.")
            add_contribution("glucose", "High Fasting Glucose")

        if glucose_test.get("post_meal") is not None and get_num(glucose_test.get("post_meal")) > 140:
            score += symptom_weights["glucose"]
            reasons.append("Post-meal glucose > 140 mg/dL.")
            advice.append("→ Maintain low glycemic index meals post-lunch.")
            add_contribution("glucose", "High Post-meal Glucose")

        if glucose_test.get("urine_sugar") is not None and get_num(glucose_test.get("urine_sugar")) >= 2:
            score += symptom_weights["urine_sugar"]
            reasons.append("High urine sugar (++ or +++).")
            advice.append("→ Consider checking blood glucose levels.")
            add_contribution("urine_sugar", "High Urine Sugar")

    max_score = sum(symptom_weights.values())
    probability = round((score / max_score) * 100) if max_score else 0

    if not reasons:
        risk = "Low Risk"
        probability = 0
        advice = [
            "✅ No major symptoms of gestational diabetes (GDM) today.",
            "→ Maintain a balanced diet and regular exercise.",
            "→ Attend routine check-ups and glucose screenings."
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
