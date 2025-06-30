import React, { useState } from "react";

const FeedbackForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [recommend, setRecommend] = useState("");
  const [featuresUsed, setFeaturesUsed] = useState<string[]>([]);
  const [overallExperience, setOverallExperience] = useState("");

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCheckboxChange = (feature: string) => {
    setFeaturesUsed(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage({ type: "error", text: "Please enter your name." });
      return;
    }

    if (!rating) {
      setMessage({ type: "error", text: "Please provide a rating." });
      return;
    }

    const feedbackData = {
      name,
      email,
      rating,
      liked,
      suggestions,
      recommend,
      featuresUsed,
      overallExperience,
      submittedAt: new Date().toISOString()
    };

    console.log("Feedback submitted:", feedbackData);
    setMessage({ type: "success", text: "Thank you for your feedback!" });

    // Reset form
    setName("");
    setEmail("");
    setRating(0);
    setLiked("");
    setSuggestions("");
    setRecommend("");
    setFeaturesUsed([]);
    setOverallExperience("");
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-100 font-sans">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-[#AE794B]">Feedback Form 📝</h2>

        {message && (
          <div className={`p-3 rounded text-center ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block font-medium text-gray-700">Name *</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded mt-1"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Email (optional)</label>
          <input
            type="email"
            className="w-full border px-4 py-2 rounded mt-1"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Rating *</label>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-400"}`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">What did you like the most?</label>
          <textarea
            className="w-full border px-4 py-2 rounded mt-1"
            rows={4}
            value={liked}
            onChange={e => setLiked(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Suggestions for improvement</label>
          <textarea
            className="w-full border px-4 py-2 rounded mt-1"
            rows={4}
            value={suggestions}
            onChange={e => setSuggestions(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Would you recommend our app?</label>
          <div className="flex gap-6 mt-2">
            {["Yes", "No"].map(opt => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="recommend"
                  value={opt}
                  checked={recommend === opt}
                  onChange={e => setRecommend(e.target.value)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Which features did you use?</label>
          <div className="grid grid-cols-2 gap-2">
            {["Symptom Tracker", "Doctor Chat", "Diet Plan", "Emergency Alert", "Report Upload"].map(feature => (
              <label key={feature} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={featuresUsed.includes(feature)}
                  onChange={() => handleCheckboxChange(feature)}
                />
                {feature}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">How was your overall experience?</label>
          <select
            className="w-full border px-4 py-2 rounded mt-1"
            value={overallExperience}
            onChange={e => setOverallExperience(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Okay">Okay</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-[#AE794B] text-white px-8 py-2 rounded hover:bg-[#945f38] transition"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </section>
  );
};

export default FeedbackForm;