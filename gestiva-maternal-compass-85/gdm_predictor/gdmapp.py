# gdm_app.py

import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from evaluate_gdm import evaluate_gdm

st.set_page_config(page_title="GDM Risk Predictor", layout="centered")
st.title("🤰 Smart Gestational Diabetes Risk Predictor")

@st.cache_data
def load_data():
    df = pd.read_csv("gdm_with_evaluation.csv")
    return df.dropna()

df = load_data()

# Define input categories
symptom_scale_fields = [
    "thirst", "urination", "fatigue", "blurred_vision",
    "nausea", "vomiting", "sugar_cravings", "sweating"
]

clinical_fields = {
    "fasting": "Fasting glucose (mg/dL)",
    "post_meal": "Post-meal glucose (mg/dL)",
    "urine_sugar": "Urine sugar level (0–5)",
    "heart_rate": "Heart rate (bpm)",
    "bmi": "BMI (e.g., 18–40)",
    "age": "Age (in years)"
}

binary_fields = {
    "previous_gdm": "Previous history of GDM",
    "family_history_diabetes": "Family history of diabetes",
    "pcos": "PCOS (Polycystic Ovary Syndrome)"
}

# Sidebar inputs
st.sidebar.header("📝 Enter Your Health Details")
symptom_inputs = {}

# Symptom ratings (0–5)
for field in symptom_scale_fields:
    label = field.replace("_", " ").capitalize() + " (0–5)"
    symptom_inputs[field] = st.sidebar.slider(label, 0.0, 5.0, step=1.0)

# Clinical values
for field, label in clinical_fields.items():
    if field == "urine_sugar":
        symptom_inputs[field] = st.sidebar.slider(label, 0.0, 5.0, step=1.0)
    else:
        symptom_inputs[field] = st.sidebar.number_input(label, value=None, format="%.1f")

# Binary dropdowns
for field, label in binary_fields.items():
    symptom_inputs[field] = st.sidebar.selectbox(label + " (Yes/No)", ["", "Yes", "No"])

# Predict button
if st.sidebar.button("🔍 Predict Risk"):

    # Validate inputs
    if any(val in [None, "", " "] for val in symptom_inputs.values()):
        st.warning("⚠️ Please fill all inputs before prediction.")
        st.stop()

    # Convert Yes/No fields to 1/0
    for field in binary_fields:
        val = symptom_inputs[field]
        symptom_inputs[field] = 1 if val.lower() == "yes" else 0

    # Run evaluation
    result = evaluate_gdm(symptom_inputs)

    st.header("📊 Prediction Result")
    st.markdown(f"### 🧪 **Risk Level:** {result['risk_level']}")
    st.markdown(f"### 📈 **Probability Score:** {result['probability']}%")

    if result['risk_level'] == "High Risk":
        st.error("⚠️ High risk of Gestational Diabetes. Please consult your doctor.")
    elif result['risk_level'] == "Moderate Risk":
        st.warning("⚠️ Moderate risk. Monitor symptoms regularly.")
    else:
        st.success("✅ Low risk. Stay healthy!")

    st.subheader("🔎 Trigger Symptoms")
    if result["reasons"]:
        st.write(", ".join([r.replace("_", " ").capitalize() for r in result["reasons"]]))
    else:
        st.write("No major symptoms detected.")

    st.subheader("💡 Personalized Advice")
    for tip in result["advice"]:
        st.markdown(f"- {tip}")

    # Graphs
    st.subheader("📊 Your Input vs Dataset Average")
    numeric_inputs = {k: float(v) for k, v in symptom_inputs.items() if isinstance(v, (int, float))}
    user_series = pd.Series(numeric_inputs)
    average_series = df[user_series.index].mean()
    comparison_df = pd.DataFrame({
        "Your Input": user_series,
        "Dataset Avg": average_series
    })
    st.bar_chart(comparison_df)

    st.subheader("📈 Your Symptom Profile")
    st.line_chart(user_series)

    st.subheader("🌡️ Dataset Heatmap")
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.heatmap(df.corr(), annot=True, cmap="coolwarm", fmt=".2f", ax=ax)
    st.pyplot(fig)

    st.subheader("📂 Sample of Training Data")
    st.dataframe(df.head())
