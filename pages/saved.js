import { useEffect, useState } from "react";
import {
  SunIcon,
  MoonIcon,
  CheckIcon,
  TrashIcon,
  BookmarkIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";

export default function Saved() {
  const [questions, setQuestions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("all"); // all | solved | unsolved

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    fetch("/api/get-saved-questions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setQuestions(data.questions);
      });
  }, []);

  const markSolved = async (id) => {
    await fetch("/api/mark-solved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, solved: true } : q))
    );
  };

  const deleteQuestion = async (id) => {
    await fetch("/api/delete-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  // ✅ Filtered list
  const filteredQuestions = questions.filter((q) => {
    if (filter === "solved") return q.solved;
    if (filter === "unsolved") return !q.solved;
    return true; // all
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookmarkIcon className="h-7 w-7 text-purple-500" />
          Saved Questions
        </h1>
        <div className="flex items-center space-x-4">
          <a
            href="/"
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <HomeIcon className="h-5 w-5" /> Home
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

      {/* Content */}
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Filter bar */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "all"
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-indigo-500 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unsolved")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "unsolved"
                  ? "bg-red-500 text-white shadow"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-red-500 hover:text-white"
              }`}
            >
              Unsolved
            </button>
            <button
              onClick={() => setFilter("solved")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "solved"
                  ? "bg-green-500 text-white shadow"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-green-500 hover:text-white"
              }`}
            >
              Solved
            </button>
          </div>

          {/* Question list */}
          {filteredQuestions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center mt-20">
              No {filter} questions found. 🚀
            </p>
          ) : (
            <ul className="space-y-4">
              {filteredQuestions.map((q) => (
                <li
                  key={q._id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-100 dark:border-gray-700"
                >
                  <p
                    className={`text-gray-800 dark:text-gray-200 ${
                      q.solved ? "line-through opacity-70" : ""
                    }`}
                  >
                    {q.question}
                  </p>
                  <div className="flex justify-end gap-3 mt-4">
                    {!q.solved && (
                      <button
                        onClick={() => markSolved(q._id)}
                        className="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition"
                      >
                        <CheckIcon className="h-5 w-5" /> Solved
                      </button>
                    )}
                    <button
                      onClick={() => deleteQuestion(q._id)}
                      className="flex items-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
                    >
                      <TrashIcon className="h-5 w-5" /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
