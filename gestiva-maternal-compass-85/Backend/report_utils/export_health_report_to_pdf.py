import os
import smtplib
import matplotlib.pyplot as plt # type: ignore
from fpdf import FPDF # type: ignore
from email.message import EmailMessage
from datetime import datetime, timedelta

# ------------------ Symptom Graph Generator ------------------
def generate_symptom_trend_graph(history, output_path="symptom_trends.png"):
    plt.figure(figsize=(10, 5))
    days = history['dates']
    for symptom in ['thirst', 'urination', 'fatigue']:
        if symptom in history:
            plt.plot(days, history[symptom], label=symptom.capitalize(), marker='o')

    plt.title("🩺 Weekly Symptom Trends")
    plt.xlabel("Date")
    plt.ylabel("Severity / Frequency")
    plt.xticks(rotation=45)
    plt.legend()
    plt.tight_layout()
    plt.grid(True)
    plt.savefig(output_path)
    plt.close()

# ------------------ Health Report Export ------------------
def export_health_report_to_pdf(user_profile, history, risks, details, notifications, filename="health_report.pdf"):
    graph_path = "symptom_trends.png"
    generate_symptom_trend_graph(history, graph_path)

    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Title
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, f"{user_profile['name']}'s Pregnancy Health Report", ln=True, align='C')
    pdf.set_font("Arial", "", 12)
    pdf.cell(0, 10, f"Date: {datetime.today().strftime('%Y-%m-%d')}", ln=True, align='C')
    pdf.ln(10)

    # Profile
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "👤 Profile", ln=True)
    pdf.set_font("Arial", "", 12)
    for k, v in user_profile.items():
        pdf.cell(0, 8, f"{k.title()}: {v}", ln=True)
    pdf.ln(5)

    # Risk Summary
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "🩺 Condition Risk Levels", ln=True)
    pdf.set_font("Arial", "", 12)
    for disease, risk in risks.items():
        pdf.cell(0, 10, f"• {disease.replace('_', ' ').title()}: {risk}", ln=True)
    pdf.ln(5)

    # Details
    for disease, info in details.items():
        pdf.set_font("Arial", "B", 13)
        pdf.cell(0, 10, f"🔍 {disease.replace('_', ' ').title()}", ln=True)

        if info.get("why"):
            pdf.set_font("Arial", "I", 12)
            pdf.cell(0, 8, "Reasons:", ln=True)
            pdf.set_font("Arial", "", 12)
            for reason in info["why"]:
                pdf.multi_cell(0, 8, f"→ {reason}")

        if info.get("recommendations"):
            pdf.set_font("Arial", "I", 12)
            pdf.cell(0, 8, "Recommendations:", ln=True)
            pdf.set_font("Arial", "", 12)
            for rec in info["recommendations"]:
                pdf.multi_cell(0, 8, f"→ {rec}")

        pdf.ln(5)

    # Notifications
    if notifications:
        pdf.set_font("Arial", "B", 13)
        pdf.cell(0, 10, "🔔 Notifications", ln=True)
        pdf.set_font("Arial", "", 12)
        for note in notifications:
            pdf.multi_cell(0, 8, f"• {note}")

    # Graph page
    if os.path.exists(graph_path):
        pdf.add_page()
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, "📈 Weekly Symptom Trends", ln=True)
        pdf.image(graph_path, x=10, y=30, w=180)

    pdf.output(filename)
    print(f"✅ PDF exported: {filename}")

# ------------------ Email Report ------------------
def send_health_report_email(sender_email, app_password, recipient_email, subject, body, pdf_path):
    msg = EmailMessage()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.set_content(body)

    with open(pdf_path, 'rb') as f:
        file_data = f.read()
        file_name = os.path.basename(pdf_path)
        msg.add_attachment(file_data, maintype='application', subtype='pdf', filename=file_name)

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(sender_email, app_password)
        smtp.send_message(msg)

    print(f"✅ Email sent to {recipient_email}")