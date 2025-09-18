import { useState, useEffect } from "react";
import {
  SunIcon,
  MoonIcon,
  ClipboardIcon,
  CheckIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [savedIndex, setSavedIndex] = useState(null);
  const [difficulty, setDifficulty] = useState("easy"); // adaptive difficulty

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // ✅ Submit handler with adaptive difficulty
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle || !category) return alert("Please fill both fields.");

    setLoading(true);
    setQuestions([]);

    try {
      // fetch history to get next difficulty
      const histRes = await fetch("/api/get-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, category }),
      });
      const histData = await histRes.json();
      const nextDiff = histData.success ? histData.nextDifficulty : "easy";
      setDifficulty(nextDiff);

      // generate questions
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, category, difficulty: nextDiff }),
      });
      const data = await res.json();

      if (data.success) setQuestions(data.questions);
      else alert("❌ Error: " + data.error);
    } catch (err) {
      alert("❌ Network error: " + err.message);
    }

    setLoading(false);
  };

  // ✅ Copy
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // ✅ Save
  const saveQuestion = async (q, index) => {
    try {
      const res = await fetch("/api/save-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, category, question: q }),
      });
      const data = await res.json();

      if (data.success) {
        setSavedIndex(index);
        setTimeout(() => setSavedIndex(null), 1500);
      } else {
        alert("❌ Save error: " + data.error);
      }
    } catch (err) {
      alert("❌ Network error: " + err.message);
    }
  };

  // ✅ Save Progress (correct/wrong)
  const saveProgress = async (q, isCorrect) => {
    try {
      await fetch("/api/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, category, question: q, difficulty, isCorrect }),
      });
    } catch (err) {
      alert("❌ Error saving progress: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Interview Generator
        </h1>
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Home
          </a>
          <a
            href="#questions"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Questions
          </a>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            )}
          </button>
        </div>
      </nav>

      {/* Hero / Form */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 py-10">
        <div className="text-center max-w-2xl mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Generate Interview Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Adaptive difficulty:{" "}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {difficulty.toUpperCase()}
            </span>
          </p>
        </div>

        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Enter job title (e.g. SDE Intern)"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-black placeholder-gray-500 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-black dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select Category</option>
              <option value="DSA">DSA</option>
              <option value="System Design">System Design</option>
              <option value="Behavioral">Behavioral</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-70"
            >
              {loading ? "⏳ Generating..." : "🚀 Generate Questions"}
            </button>
          </form>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-8 animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        )}

        {/* Generated Questions */}
        {questions.length > 0 && (
          <div
            id="questions"
            className="mt-10 w-full max-w-2xl bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-inner p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Questions:
            </h2>
            <ul className="space-y-3">
              {questions.map((q, i) => (
                <li
                  key={i}
                  className="flex flex-col bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-md transition"
                >
                  <span className="text-gray-800 dark:text-gray-200 flex-1">{q}</span>

                  <div className="flex space-x-2 mt-2">
                    {/* Copy */}
                    <button
                      onClick={() => copyToClipboard(q, i)}
                      className="p-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-indigo-500 hover:text-white transition"
                    >
                      {copiedIndex === i ? (
                        <CheckIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <ClipboardIcon className="h-5 w-5" />
                      )}
                    </button>

                    {/* Save */}
                    <button
                      onClick={() => saveQuestion(q, i)}
                      className="p-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-purple-500 hover:text-white transition"
                    >
                      {savedIndex === i ? (
                        <CheckIcon className="h-5 w-5 text-purple-500" />
                      ) : (
                        <BookmarkIcon className="h-5 w-5" />
                      )}
                    </button>

                    {/* Correct / Wrong */}
                    <button
                      onClick={() => saveProgress(q, true)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      ✔
                    </button>
                    <button
                      onClick={() => saveProgress(q, false)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-gray-900 py-6 shadow-inner">
        <div className="max-w-4xl mx-auto text-center text-gray-600 dark:text-gray-400 space-x-4">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            About
          </a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Contact
          </a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Privacy
          </a>
        </div>
        <p className="mt-3 text-center text-gray-500 dark:text-gray-500 text-sm">
          © 2025 AI Interview Generator. All rights reserved.
        </p>
      </footer>
    </div>
  );
}