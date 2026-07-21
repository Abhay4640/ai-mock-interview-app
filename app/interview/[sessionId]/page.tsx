"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function InterviewPage() {
  const params = useParams();

const sessionId = Array.isArray(params.sessionID)
  ? params.sessionID[0]
  : params.sessionId;

console.log("Params:", params);
console.log("Session ID:", sessionId);

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [allFeedback, setAllFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15 * 60); 

  useEffect(() => {
  console.log("Loading interview...");

  if (!sessionId) {
    console.log("Session ID is undefined");
    setLoading(false);
    return;
  }

  const key = `questions-${sessionId}`;

  console.log("Key:", key);

  const stored = localStorage.getItem(key);

  console.log("Stored:", stored);

  if (stored) {
    setQuestions(JSON.parse(stored));
  } else {
    console.log("No questions found in localStorage");
  }

  setLoading(false);
}, [sessionId]);

  useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);

        setFinished(true);

        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);

useEffect(() => {
  if (typeof window === "undefined") return;

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    setSpeechSupported(false);
    return;
  }

  const recog = new SpeechRecognition();

  recog.continuous = true;
  recog.interimResults = true;
  recog.lang = "en-US";

  recog.onresult = (event: any) => {
    let transcript = "";

    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + " ";
    }

    setAnswer(transcript);
  };

  recog.onend = () => {
    setIsListening(false);
  };

  setRecognition(recog);
}, []);


  async function submitAnswer() {
    console.log("Submit clicked:", currentIndex);
    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          question: questions[currentIndex],
          answer,
        }),
      });

      const data = await res.json();

          if (!res.ok) {
      toast.error(data.error || "Failed to submit answer");
      console.error("API Error:", data);
      return;
    }

    console.log("Evaluation Result:", data);

setFeedback(data);

// Save every question's feedback
setAllFeedback((prev) => [...prev, data]);

    } catch (err) {
    console.error("Submit Error:", err);
    toast.error("Something went wrong");
  }
}

  function handleNext() {
    if (currentIndex === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setAnswer("");
    setFeedback(null);
  }


function handlePrevious() {
  if (currentIndex === 0) return;

  setCurrentIndex((prev) => prev - 1);
  setAnswer("");
  setFeedback(null);
}

function toggleListening() {
  if (!recognition) return;

  if (isListening) {
    recognition.stop();
    setIsListening(false);
  } else {
    recognition.start();
    setIsListening(true);
  }
}

  if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"></div>

        <p className="mt-4 text-lg font-medium text-gray-600">
          Loading Interview...
        </p>
      </div>
    </div>
  );
}

  if (questions.length === 0) {
    return (
      <div className="text-center mt-20">
        No questions found.
      </div>
    );
  }

  if (finished) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

      <div className="glass-card max-w-2xl w-full rounded-3xl p-10 shadow-soft text-center">

        <div className="text-6xl mb-6">
          🎉
        </div>

        <h1 className="font-display text-5xl">
          Interview Completed
        </h1>

        <p className="mt-5 text-lg text-gray-500">
          Congratulations! You successfully completed your AI interview.
        </p>

        <div className="my-10 rounded-3xl bg-violet-50 p-8">

          <p className="text-sm uppercase tracking-widest text-violet-600">
            Questions Answered
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            {questions.length}
          </h2>

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="rounded-xl border border-gray-300 bg-white py-4 font-semibold hover:bg-gray-100 transition"
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => (window.location.href = "/interview/new")}
            className="rounded-xl bg-gradient-primary py-4 font-semibold text-white shadow-purple transition hover:scale-105"
          >
            🚀 New Interview
          </button>

        </div>

      </div>

    </div>
  );
}

  return (
  <div className="min-h-screen bg-slate-50 py-12">
    <div className="container-custom max-w-4xl px-6">

      {/* Header */}
      <div className="mb-10">

        <div className="flex items-center justify-between mb-5">

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
              AI Interview Session
            </p>

            <h1 className="font-display mt-2 text-4xl">
              Frontend Developer
            </h1>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-soft">
            <p className="text-sm text-gray-500">
  Time Left
</p>

<h2 className="text-2xl font-bold text-violet-600">
  {Math.floor(timeLeft / 60)}:
  {(timeLeft % 60).toString().padStart(2, "0")}
</h2>

<p className="mt-2 text-sm text-gray-500">
  Question {currentIndex + 1}/{questions.length}
</p>
          </div>

        </div>

        {/* Progress Bar */}

        <div className="h-3 overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full bg-gradient-primary transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />

        </div>

      </div>

      {/* Question Card */}

      <div className="glass-card rounded-3xl p-8 shadow-soft">

        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-600">
          Interview Question
        </p>

        <h2 className="text-3xl leading-relaxed font-semibold">
          {questions[currentIndex]}
        </h2>

      </div>

      {/* Answer */}

      <div className="mt-8">

       <div className="mb-3 flex items-center justify-between">

  <label className="text-sm font-semibold text-gray-600">
    Your Answer
  </label>

  {isListening && (
    <div className="flex items-center gap-2 text-red-500 font-medium">

      <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>

      Listening...

    </div>
  )}

</div>

        <textarea
          rows={8}
          value={answer}
          disabled={feedback !== null}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer here..."
          className="w-full resize-none rounded-3xl border border-gray-300 p-6 text-lg outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        />

        <div className="mt-3 flex justify-between text-sm text-gray-400">

          <span>
            Give a detailed explanation.
          </span>

          <span>
            {answer.length} Characters
          </span>

        </div>

        {speechSupported && (
  <button
    type="button"
    onClick={toggleListening}
    className={`mt-4 rounded-xl px-6 py-3 font-semibold transition ${
      isListening
        ? "bg-red-500 text-white"
        : "border border-violet-300 text-violet-700 hover:bg-violet-50"
    }`}
  >
    {isListening ? "🛑 Stop Speaking" : "🎤 Start Speaking"}
  </button>
)}

      </div>

      {/* Submit */}

      {!feedback ? (

        <button
  onClick={submitAnswer}
  disabled={!answer.trim()}
  className="mt-8 rounded-xl bg-gradient-primary px-8 py-4 text-lg font-semibold text-white shadow-purple transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
>
  Submit Answer
</button>

      ) : (

        <>
          {/* Feedback */}

          <div className="glass-card mt-10 rounded-3xl border border-violet-100 p-8 shadow-soft">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
                  AI Feedback
                </p>

                <h3 className="mt-2 text-4xl font-bold">
                  ⭐ {feedback.score}/10
                </h3>

              </div>

              <div className="rounded-full bg-violet-100 px-5 py-2 font-semibold text-violet-700">
                Evaluated
              </div>

            </div>

            <p className="mt-8 leading-8 text-gray-600">
              {feedback.feedback}
            </p>

          </div>

          <button
            onClick={handleNext}
            className="mt-8 rounded-xl bg-gradient-primary px-8 py-4 text-lg font-semibold text-white shadow-purple transition hover:scale-105"
          >
            {currentIndex === questions.length - 1
              ? "Finish Interview"
              : "Next Question →"}
          </button>

        </>

      )}

    </div>
  </div>
);
}