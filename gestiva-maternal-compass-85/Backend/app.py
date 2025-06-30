from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

from disease_modules.evaluate_gdm import evaluate_gdm
from disease_modules.evaluate_uti import evaluate_uti
from disease_modules.evaluate_thyroid import evaluate_thyroid
from disease_modules.evaluate_anaemia import evaluate_anaemia
from disease_modules.evaluate_preeclampsia import evaluate_preeclampsia
from disease_modules.evaluate_mental_health import evaluate_mental_health
from disease_modules.evaluate_miscarriage import evaluate_miscarriage
from report_utils import export_health_report_to_pdf

# Firebase init
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin:
        response.headers.add("Access-Control-Allow-Origin", origin)
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    return response

def get_user_static_details(user_id):
    doc = db.collection("users").document(user_id).get()
    if doc.exists:
        data = doc.to_dict()
        return {
            "age": data.get("age"),
            "previous_gdm": data.get("previousGDM"),
            "family_history_diabetes": data.get("familyHistoryDiabetes"),
            "pcos": data.get("pcos"),
            "bmi": data.get("bmi")
        }
    return {}

@app.route('/analyze-symptoms', methods=['POST', 'OPTIONS'])
def analyze_symptoms():
    if request.method == "OPTIONS":
        return '', 204

    try:
        symptom_data = request.get_json()
        if not symptom_data:
            return jsonify({"error": "No symptom data received"}), 400

        user_id = symptom_data.get("user_id", "demo_user")
        today_str = datetime.today().strftime("%Y-%m-%d")

        user_static = get_user_static_details(user_id)

        today_symptoms = {
            "gdm": {
                "frequent_urination": symptom_data.get("frequent_urination", 0),
                "thirst_level": symptom_data.get("thirst_level", 0),
                "hunger": symptom_data.get("hunger", 0),
                "blurred_vision": symptom_data.get("blurred_vision", 0),
                "fatigue": symptom_data.get("fatigue", 0),
                "heart_rate": symptom_data.get("heart_rate", 0),
                "bmi": symptom_data.get("bmi", user_static.get("bmi", 0))
            },
            "mental_health": {
                "mood": symptom_data.get("mood", 0),
                "anxiety": symptom_data.get("anxiety", 0),
                "isolation": symptom_data.get("isolation", 0),
                "overwhelm": symptom_data.get("overwhelm", 0),
                "irritability": symptom_data.get("irritability", 0),
                "sleep": symptom_data.get("sleep", 0)
            },
            "thyroid": {
                "cold_sensitivity": symptom_data.get("cold_sensitivity", 0),
                "hair_loss": symptom_data.get("hair_loss", 0)
            },
            "anaemia": {
                "fatigue": symptom_data.get("fatigue", 0),
                "heart_rate": symptom_data.get("heart_rate", 0),
                "dizziness": symptom_data.get("dizziness", 0),
                "breathlessness": symptom_data.get("breathlessness", 0),
                "headache": symptom_data.get("headache", 0),
                "pale_skin": symptom_data.get("pale_skin", 0),
                "cravings": symptom_data.get("cravings", 0),
                "cold_extremities": symptom_data.get("cold_extremities", 0),
                "iron_diet_score": symptom_data.get("iron_diet_score", 0),
                "previous_anaemia": symptom_data.get("previous_anaemia", False)
            },
            "preeclampsia": {
                "bp": symptom_data.get("bp", 0),
                "swelling": symptom_data.get("swelling", 0),
                "headache": symptom_data.get("headache", 0),
                "visual_changes": symptom_data.get("visual_changes", 0),
                "upper_abdominal_pain": symptom_data.get("upper_abdominal_pain", 0)
            },
            "uti": {
                "burning_urine": symptom_data.get("burning_urine", 0),
                "foul_smell": symptom_data.get("foul_smell", 0),
                "fever": symptom_data.get("fever", 0),
                "lower_abdominal_pain": symptom_data.get("lower_abdominal_pain", 0)
            },
            "miscarriage": {
                "pain": symptom_data.get("pain", 0),
                "spotting": symptom_data.get("spotting", 0),
                "age_over_35": user_static.get("age") and int(user_static.get("age")) > 35
            }
        }

        glucose_test = {
            "fasting": symptom_data.get("fasting", 0),
            "post_meal": symptom_data.get("post_meal", 0),
            "urine_sugar": symptom_data.get("urine_sugar", 0)
        }

        disease_funcs = {
            "gdm": lambda: evaluate_gdm(
                today_symptoms=today_symptoms["gdm"],
                glucose_test=glucose_test,
                static_data=user_static
            ),
            "mental_health": lambda: evaluate_mental_health(today_symptoms=today_symptoms["mental_health"]),
            "uti": lambda: evaluate_uti(today_symptoms=today_symptoms["uti"]),
            "thyroid": lambda: evaluate_thyroid(today_symptoms=today_symptoms["thyroid"]),
            "anaemia": lambda: evaluate_anaemia(today_symptoms=today_symptoms["anaemia"]),
            "preeclampsia": lambda: evaluate_preeclampsia(
                today_symptoms=today_symptoms["preeclampsia"],
                static_data=user_static
            ),
            "miscarriage": lambda: evaluate_miscarriage(today_symptoms=today_symptoms["miscarriage"])
        }

        results = {}
        for disease, func in disease_funcs.items():
            result = func()
            prob_str = str(result.get("probability", "0")).replace("%", "").strip()
            prob = int(float(prob_str))
            prob_str += "%"

            if prob >= 0:
                results[disease] = {
                    "risk_level": f"{result['risk']} ({prob_str})",
                    "probability": prob_str,
                    "why": result.get("why", []),
                    "recommendations": result.get("next_steps", []),
                    "symptom_contributions": result.get("symptom_contributions", [])
                }
        # Save today's results to Firestore
        # ✅ Final report to store in Firestore
        final_report = {
    "date": today_str,
    "disease_analysis": results
}

# ✅ Save under user > days > [date]
        db.collection("symptom_logs").document(user_id).collection("days").document(today_str).set(final_report)


        return jsonify({
            "success": True,
            "user": user_id,
            "date": today_str,
            "disease_analysis": results
        })

    except Exception as e:
        print("❌ Error in analyze-symptoms:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/api/search-doctors", methods=["GET"])
def search_doctors():
    query = request.args.get("query", "").lower()

    doctors = [
        {
            "name": "Dr. Priya Sharma",
            "specialty": "Obstetrician & Gynecologist",
            "rating": 4.9,
            "reviews": 234,
            "location": "Apollo Women's Hospital, Mumbai",
            "distance": "2.3 km",
            "availability": "Available Today",
            "image": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=300&q=80",
            "consultationFee": "₹800",
            "nextAvailable": "2:00 PM Today",
            "phone": "+91 98765 43210"
        },
        {
            "name": "Dr. Rajesh Kumar",
            "specialty": "Maternal-Fetal Medicine",
            "rating": 4.8,
            "reviews": 189,
            "location": "Fortis Healthcare, Delhi",
            "distance": "3.1 km",
            "availability": "Available Tomorrow",
            "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
            "consultationFee": "₹1200",
            "nextAvailable": "10:00 AM Tomorrow",
            "phone": "+91 98765 43211"
        }
    ]

    filtered = [
        d for d in doctors if
        query in d["name"].lower() or
        query in d["specialty"].lower() or
        query in d["location"].lower()
    ]

    return jsonify(filtered or doctors)

@app.route('/export-pdf', methods=['POST', 'OPTIONS'])
def export_pdf():
    if request.method == "OPTIONS":
        return '', 204

    req = request.get_json()
    if not req:
        return jsonify({"error": "No data received"}), 400

    disease_analysis = req.get("disease_analysis")
    if not isinstance(disease_analysis, dict):
        return jsonify({"error": "Invalid or missing 'disease_analysis'"}), 400

    user_profile = {
        "name": req.get("user_name", "Unknown"),
        "age": req.get("age", "NA"),
        "email": req.get("email", "N/A")
    }

    filename = f"{user_profile['name'].replace(' ', '_')}_report.pdf"

    export_health_report_to_pdf(
        user_profile=user_profile,
        history={},  # You can update this if needed
        risks={k: v.get("risk_level", "Unknown") for k, v in disease_analysis.items()},
        details=disease_analysis,
        notifications=req.get("notifications", []),
        filename=filename
    )

    return send_file(filename, as_attachment=True)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
