import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import Splash from "./screens/Splash";
import Onboarding from "./screens/Onboarding";
import Auth from "./screens/Auth";
import Home from "./screens/Home";
import Timeline from "./screens/Timeline";
import MatchMap from "./screens/MatchMap";
import MatchList from "./screens/MatchList";
import Chat from "./screens/Chat";
import Profile from "./screens/Profile";
import Feedback from "./screens/Feedback";
import Settings from "./screens/Settings";
import Notifications from "./screens/Notifications";

type Screen =
  | "splash"
  | "onboarding"
  | "auth"
  | "home"
  | "timeline"
  | "match-map"
  | "match-list"
  | "chat"
  | "profile"
  | "feedback"
  | "settings"
  | "notifications";

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("splash");
  const [darkMode, setDarkMode] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedMood, setSelectedMood] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Splash screen timeout
    const timer = setTimeout(() => {
      setCurrentScreen("onboarding");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleMoodSubmit = (mood: string) => {
    setSelectedMood(mood);
    setShowFeedback(true);
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    navigate("timeline");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      {/* Dark mode toggle - fixed position */}
      {currentScreen !== "splash" &&
        currentScreen !== "onboarding" && (
          <button
            onClick={toggleDarkMode}
            className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-[#FFA502]" />
            ) : (
              <Moon className="w-5 h-5 text-[#6C5CE7]" />
            )}
          </button>
        )}

      {/* Screen Router */}
      <div className="bg-[#FAFAFA] dark:bg-gray-900 transition-colors min-h-screen">
        {currentScreen === "splash" && <Splash />}
        {currentScreen === "onboarding" && (
          <Onboarding onComplete={() => navigate("auth")} />
        )}
        {currentScreen === "auth" && (
          <Auth onLogin={() => navigate("home")} />
        )}
        {currentScreen === "home" && (
          <Home
            onMoodSubmit={handleMoodSubmit}
            onNavigate={navigate}
            darkMode={darkMode}
          />
        )}
        {currentScreen === "timeline" && (
          <Timeline onNavigate={navigate} darkMode={darkMode} />
        )}
        {currentScreen === "match-map" && (
          <MatchMap onNavigate={navigate} darkMode={darkMode} />
        )}
        {currentScreen === "match-list" && (
          <MatchList
            onNavigate={navigate}
            darkMode={darkMode}
          />
        )}
        {currentScreen === "chat" && (
          <Chat onNavigate={navigate} darkMode={darkMode} />
        )}
        {currentScreen === "profile" && (
          <Profile onNavigate={navigate} darkMode={darkMode} />
        )}
        {currentScreen === "settings" && (
          <Settings
            onNavigate={navigate}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        )}
        {currentScreen === "notifications" && (
          <Notifications
            onNavigate={navigate}
            darkMode={darkMode}
          />
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <Feedback
          mood={selectedMood || ""}
          onClose={handleFeedbackClose}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}