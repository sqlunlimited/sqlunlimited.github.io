import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  CheckCircle,
  XCircle,
  Upload,
  Book,
  Code,
  Table,
  Github,
  RefreshCw,
  Filter,
  X,
  User,
  Search,
  Database,
  BookOpen,
  Info,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Menu,
  Flame,
  Home,
  Plus
} from "lucide-react";
const SQLPracticePlatform = ({ onNavigate }) => {
  const [SQL, setSQL] = useState(null);
  const [PGlite, setPGlite] = useState(null);
  const [db, setDb] = useState(null);
  const [pgDb, setPgDb] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userQuery, setUserQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEngine, setSelectedEngine] = useState("SQLite");
  const [showLearningResources, setShowLearningResources] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [mobileContinue, setMobileContinue] = useState(false);
  const [isQuestionsPanelCollapsed, setIsQuestionsPanelCollapsed] =
    useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState("question");
  const [showMobileQuestionsList, setShowMobileQuestionsList] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const [questions, setQuestions] = useState([]);
  const [questionsLoaded, setQuestionsLoaded] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [showTestCases, setShowTestCases] = useState(false);
  const { questionId } = useParams(); // Get question ID from URL
  const navigate = useNavigate(); // For programmatic navigation
  const containerRef = useRef(null);
  // NEW STATES
  const [testResult, setTestResult] = useState(null);
  const [testError, setTestError] = useState('');
  const [showTestOutput, setShowTestOutput] = useState(false);
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );
      const isSmallScreen = window.innerWidth <= 768;
      const wasMobile = isMobile;
      setIsMobile(isMobileDevice || isSmallScreen);
      // Show warning only on first detection and if not already continued
      if ((isMobileDevice || isSmallScreen) && !wasMobile && !mobileContinue) {
        setShowMobileWarning(true);
      }
      // Auto-collapse questions panel on mobile
      if (isMobileDevice || isSmallScreen) {
        setIsQuestionsPanelCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileContinue, isMobile]);
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  // Utility function to check if two dates are consecutive days
  const isConsecutiveDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  };
  // Load streak data from IndexedDB
  // const loadStreakData = async () => {
  //   try {
  //     const dbName = "SQLPlatformDB";
  //     const storeName = "streakData";
  //     const request = indexedDB.open(dbName, 2); // Increment version
  //     request.onerror = () => {
  //       console.error("Failed to open IndexedDB for streak");
  //     };
  //     request.onsuccess = (event) => {
  //       const db = event.target.result;
  //       if (!db.objectStoreNames.contains(storeName)) {
  //         return;
  //       }
  //       const transaction = db.transaction([storeName], "readonly");
  //       const objectStore = transaction.objectStore(storeName);
  //       const getRequest = objectStore.get("streak");
  //       getRequest.onsuccess = () => {
  //         const data = getRequest.result;
  //         if (data) {
  //           const today = getTodayDate();
  //           const lastSolved = data.lastSolvedDate;
  //           // If last solved was today or yesterday, keep the streak
  //           if (lastSolved === today || isConsecutiveDay(lastSolved, today)) {
  //             setCurrentStreak(data.currentStreak || 0);
  //           } else {
  //             // Streak is broken but don't reset in DB yet
  //             setCurrentStreak(0);
  //           }
  //           setLongestStreak(data.longestStreak || 0);
  //         }
  //       };
  //     };
  //     request.onupgradeneeded = (event) => {
  //       const db = event.target.result;
  //       if (!db.objectStoreNames.contains(storeName)) {
  //         db.createObjectStore(storeName, { keyPath: "id" });
  //       }
  //     };
  //   } catch (err) {
  //     console.error("Error loading streak data:", err);
  //   }
  // };
  const loadStreakData = async () => {
    try {
      const dbName = "SQLPlatformDB";
      const storeName = "streakData";
      const request = indexedDB.open(dbName, 3); // Use version 3
      request.onerror = (event) => {
        console.error("Failed to open IndexedDB for streak:", event.target.error);
      };
      request.onsuccess = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          return;
        }
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);
        const getRequest = objectStore.get("streak");
        getRequest.onsuccess = () => {
          const data = getRequest.result;
          if (data) {
            const today = getTodayDate();
            const lastSolved = data.lastSolvedDate;
            if (lastSolved === today || isConsecutiveDay(lastSolved, today)) {
              setCurrentStreak(data.currentStreak || 0);
            } else {
              setCurrentStreak(0);
            }
            setLongestStreak(data.longestStreak || 0);
          }
        };
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("completedQuestions")) {
          db.createObjectStore("completedQuestions", { keyPath: "id" });
        }
      };
    } catch (err) {
      console.error("Error loading streak data:", err);
    }
  };
  // Save streak data to IndexedDB
  // const saveStreakData = async (streakData) => {
  //   try {
  //     const dbName = "SQLPlatformDB";
  //     const storeName = "streakData";
  //     const request = indexedDB.open(dbName, 2); // Increment version
  //     request.onsuccess = (event) => {
  //       const db = event.target.result;
  //       const transaction = db.transaction([storeName], "readwrite");
  //       const objectStore = transaction.objectStore(storeName);
  //       objectStore.put({
  //         id: "streak",
  //         ...streakData,
  //       });
  //     };
  //     request.onupgradeneeded = (event) => {
  //       const db = event.target.result;
  //       if (!db.objectStoreNames.contains(storeName)) {
  //         db.createObjectStore(storeName, { keyPath: "id" });
  //       }
  //     };
  //   } catch (err) {
  //     console.error("Error saving streak data:", err);
  //   }
  // };
  const saveStreakData = async (streakData) => {
    try {
      const dbName = "SQLPlatformDB";
      const storeName = "streakData";
      const request = indexedDB.open(dbName, 3); // Use version 3
      request.onerror = (event) => {
        console.error("Failed to save streak:", event.target.error);
      };
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([storeName], "readwrite");
        const objectStore = transaction.objectStore(storeName);
        objectStore.put({
          id: "streak",
          ...streakData,
        });
        console.log("Saved streak data:", streakData);
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("completedQuestions")) {
          db.createObjectStore("completedQuestions", { keyPath: "id" });
        }
      };
    } catch (err) {
      console.error("Error saving streak data:", err);
    }
  };
  // Update streak when a question is completed
  const updateStreak = async () => {
    const today = getTodayDate();
    try {
      const dbName = "SQLPlatformDB";
      const storeName = "streakData";
      const request = indexedDB.open(dbName, 3);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);
        const getRequest = objectStore.get("streak");
        getRequest.onsuccess = () => {
          const data = getRequest.result;
          let newStreak = 1;
          let newLongest = longestStreak;
          if (data) {
            const lastSolved = data.lastSolvedDate;
            if (lastSolved === today) {
              // Already solved today, no change
              return;
            } else if (isConsecutiveDay(lastSolved, today)) {
              // Consecutive day - increment
              newStreak = (data.currentStreak || 0) + 1;
            } else {
              // Streak broken - reset to 1
              newStreak = 1;
            }
          }
          // Update longest streak if needed
          if (newStreak > newLongest) {
            newLongest = newStreak;
          }
          // Show celebration if streak increased
          if (newStreak > currentStreak) {
            setShowStreakCelebration(true);
            setTimeout(() => setShowStreakCelebration(false), 2000);
          }
          setCurrentStreak(newStreak);
          setLongestStreak(newLongest);
          saveStreakData({
            lastSolvedDate: today,
            currentStreak: newStreak,
            longestStreak: newLongest,
          });
        };
      };
    } catch (err) {
      console.error("Error updating streak:", err);
    }
  };
  // Load completed questions from IndexedDB on mount
  useEffect(() => {
    const loadCompletedQuestions = async () => {
      try {
        const dbName = "SQLPlatformDB";
        const storeName = "completedQuestions";
        const request = indexedDB.open(dbName, 3); // Use version 3
        request.onerror = (event) => {
          console.error("Failed to open IndexedDB:", event.target.error);
        };
        request.onsuccess = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            console.warn("Store does not exist yet");
            return;
          }
          const transaction = db.transaction([storeName], "readonly");
          const objectStore = transaction.objectStore(storeName);
          const getAllRequest = objectStore.getAll();
          getAllRequest.onsuccess = () => {
            const completedIds = getAllRequest.result.map((item) => item.id);
            if (completedIds.length > 0) {
              setCompletedQuestions(new Set(completedIds));
              console.log("Loaded completed questions:", completedIds);
            }
          };
          getAllRequest.onerror = (event) => {
            console.error("Error getting completed questions:", event.target.error);
          };
        };
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          // Create completedQuestions store if it doesn't exist
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id" });
            console.log("Created completedQuestions store");
          }
          // Create streakData store if it doesn't exist
          if (!db.objectStoreNames.contains("streakData")) {
            db.createObjectStore("streakData", { keyPath: "id" });
            console.log("Created streakData store");
          }
        };
      } catch (err) {
        console.error("Error loading completed questions:", err);
      }
    };
    loadCompletedQuestions();
  }, []);
  // Save completed questions to IndexedDB whenever they change
  // useEffect(() => {
  //   const saveCompletedQuestions = async () => {
  //     if (completedQuestions.size === 0) return;
  //     try {
  //       const dbName = "SQLPlatformDB";
  //       const storeName = "completedQuestions";
  //       const request = indexedDB.open(dbName, 1);
  //       request.onsuccess = (event) => {
  //         const db = event.target.result;
  //         const transaction = db.transaction([storeName], "readwrite");
  //         const objectStore = transaction.objectStore(storeName);
  //         objectStore.clear();
  //         Array.from(completedQuestions).forEach((id) => {
  //           objectStore.add({ id: id });
  //         });
  //       };
  //       request.onupgradeneeded = (event) => {
  //         const db = event.target.result;
  //         if (!db.objectStoreNames.contains(storeName)) {
  //           db.createObjectStore(storeName, { keyPath: "id" });
  //         }
  //       };
  //     } catch (err) {
  //       console.error("Error saving completed questions:", err);
  //     }
  //   };
  //   saveCompletedQuestions();
  // }, [completedQuestions]);
  // Save completed questions to IndexedDB whenever they change
  useEffect(() => {
    const saveCompletedQuestions = async () => {
      if (completedQuestions.size === 0) return;
      try {
        const dbName = "SQLPlatformDB";
        const storeName = "completedQuestions";
        const request = indexedDB.open(dbName, 3); // Use version 3
        request.onerror = (event) => {
          console.error("Failed to open IndexedDB for saving:", event.target.error);
        };
        request.onsuccess = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            console.warn("Store does not exist, cannot save");
            return;
          }
          const transaction = db.transaction([storeName], "readwrite");
          const objectStore = transaction.objectStore(storeName);
          // Clear and re-add all completed questions
          const clearRequest = objectStore.clear();
          clearRequest.onsuccess = () => {
            Array.from(completedQuestions).forEach((id) => {
              objectStore.add({ id: id });
            });
            console.log("Saved completed questions:", Array.from(completedQuestions));
          };
          clearRequest.onerror = (event) => {
            console.error("Error clearing store:", event.target.error);
          };
          transaction.onerror = (event) => {
            console.error("Transaction error:", event.target.error);
          };
        };
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains("streakData")) {
            db.createObjectStore("streakData", { keyPath: "id" });
          }
        };
      } catch (err) {
        console.error("Error saving completed questions:", err);
      }
    };
    saveCompletedQuestions();
  }, [completedQuestions]);
  // Load streak data on mount
  useEffect(() => {
    loadStreakData();
  }, []);
  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      body {
        overflow: hidden;
      }
      .resizer {
        cursor: col-resize;
        user-select: none;
      }
      .resizer:hover {
        background: rgba(59, 130, 246, 0.3);
      }
      .resizer.dragging {
        background: rgba(59, 130, 246, 0.5);
      }
      .skeleton {
        animation: skeleton-loading 1s linear infinite alternate;
      }
      @keyframes skeleton-loading {
        0% {
          background-color: hsl(200, 20%, 80%);
        }
        100% {
          background-color: hsl(200, 20%, 95%);
        }
      }
      @media (max-width: 768px) {
        .resizer {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  // Handle mouse move for resizing (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newWidth >= 30 && newWidth <= 70) {
        setLeftPanelWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, isMobile]);

  
  // useEffect(() => {
  //   if (questions.length > 0 && questionId) {
  //     const index = questions.findIndex(q => q.id === questionId);
  //     if (index !== -1) {
  //       setCurrentQuestion(index);
  //     } else {
  //       // Question not found, redirect to first question
  //       navigate(`/practice/${questions[0].id}`, { replace: true });
  //     }
  //   } else if (questions.length > 0 && !questionId) {
  //     // No question in URL, redirect to first question
  //     navigate(`/practice/${questions[0].id}`, { replace: true });
  //   }
  // }, [questionId, questions, navigate]);


  // // NEW: Update URL when question changes
  // useEffect(() => {
  //   if (questions.length > 0 && questions[currentQuestion]) {
  //     const currentQuestionId = questions[currentQuestion].id;
  //     if (questionId !== currentQuestionId) {
  //       navigate(`/practice/${currentQuestionId}`, { replace: true });
  //     }
  //   }
  // }, [currentQuestion, questions, navigate, questionId]);





  // Single source of truth: URL drives everything
useEffect(() => {
  if (questions.length === 0) return; // Wait for questions to load

  if (questionId) {
    // URL has a question ID - sync state to match
    const index = questions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      // Question found - update state only if different
      if (currentQuestion !== index) {
        setCurrentQuestion(index);
      }
    } else {
      // Question not found in list - redirect to first
      navigate(`/practice/${questions[0].id}`, { replace: true });
    }
  } else {
    // No question ID in URL - redirect to first question
    navigate(`/practice/${questions[0].id}`, { replace: true });
  }
}, [questionId, questions.length]); // Only depend on URL and questions length, NOT currentQuestion






  const GITHUB_REPO = "sqlunlimited/sql_questions";
  const GITHUB_BRANCH = "main";
  const QUESTIONS_FOLDER = "questions";




  // const loadQuestionsFromGitHub = async () => {
  //   setLoadingQuestions(true);
  //   setQuestions([]);
  //   setQuestionsLoaded(0);
  //   setTotalQuestions(0);
  //   try {
  //     const treeUrl = `https://api.github.com/repos/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`;
  //     const treeResponse = await fetch(treeUrl);
  //     if (!treeResponse.ok) {
  //       throw new Error("Failed to fetch repository tree");
  //     }
  //     const treeData = await treeResponse.json();
  //     const questionFiles = treeData.tree.filter(
  //       (item) =>
  //         item.path.startsWith(QUESTIONS_FOLDER) &&
  //         item.path.endsWith(".json") &&
  //         item.type === "blob"
  //     );
  //     setTotalQuestions(questionFiles.length);
  //     const loadPromises = questionFiles.map(async (file) => {
  //       try {
  //         const cdnUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@${GITHUB_BRANCH}/${file.path}`;
  //         const fileResponse = await fetch(cdnUrl);
  //         if (!fileResponse.ok) {
  //           throw new Error(`Failed to fetch ${file.path}`);
  //         }
  //         const questionData = await fileResponse.json();
  //         const fileName = file.path.split("/").pop();
  //         const persistentId = fileName.replace(".json", "");
  //         const newQuestion = {
  //           ...questionData,
  //           id: persistentId,
  //           filename: fileName,
  //         };
  //         setQuestionsLoaded((prev) => prev + 1);
  //         return newQuestion;
  //       } catch (err) {
  //         console.error(`Error loading ${file.path}:`, err);
  //         setQuestionsLoaded((prev) => prev + 1);
  //         return null;
  //       }
  //     });
  //     const loadedQuestions = await Promise.all(loadPromises);
  //     const validQuestions = loadedQuestions.filter((q) => q !== null);
  //     const sortedQuestions = validQuestions.sort((a, b) =>
  //       a.id.localeCompare(b.id)
  //     );
  //     setQuestions(sortedQuestions);
  //   } catch (err) {
  //     console.error("Error loading questions from GitHub:", err);
  //     setQuestions([]);
  //   } finally {
  //     setLoadingQuestions(false);
  //   }
  // };






  const loadQuestionsFromGitHub = async () => {
  setLoadingQuestions(true);
  // Don't clear existing questions until we successfully load new ones
  setQuestionsLoaded(0);
  setTotalQuestions(0);
  
  try {
    // Step 1: Get latest commit SHA for cache-busting (with fallback)
    let commitShaOrBranch = GITHUB_BRANCH; // Default fallback
    try {
      const refsUrl = `https://api.github.com/repos/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`;
      const refsResponse = await fetch(refsUrl);
      if (refsResponse.ok) {
        const refsData = await refsResponse.json();
        commitShaOrBranch = refsData.object.sha;
        console.log('✅ Using commit SHA for cache-busting:', commitShaOrBranch.substring(0, 8));
      } else {
        console.warn('⚠️ Could not fetch commit SHA, using branch name. Status:', refsResponse.status);
        // Add timestamp as fallback cache-buster
        commitShaOrBranch = `${GITHUB_BRANCH}?cb=${Date.now()}`;
      }
    } catch (refError) {
      console.warn('⚠️ Error fetching commit SHA, using branch with timestamp:', refError.message);
      commitShaOrBranch = `${GITHUB_BRANCH}?cb=${Date.now()}`;
    }

    // Step 2: Get file tree
    const treeUrl = `https://api.github.com/repos/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`;
    const treeResponse = await fetch(treeUrl);
    
    if (!treeResponse.ok) {
      throw new Error(`Failed to fetch repository tree. Status: ${treeResponse.status}`);
    }
    
    const treeData = await treeResponse.json();
    
    // Step 3: Filter question files
    const questionFiles = treeData.tree.filter(
      (item) =>
        item.path.startsWith(QUESTIONS_FOLDER) &&
        item.path.endsWith(".json") &&
        item.type === "blob"
    );

    if (questionFiles.length === 0) {
      console.error('❌ No question files found in repository');
      throw new Error('No question files found in the repository');
    }

    setTotalQuestions(questionFiles.length);
    console.log(`📚 Found ${questionFiles.length} question files`);
    
    // Step 4: Load all questions
    const loadPromises = questionFiles.map(async (file) => {
      try {
        const cdnUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@${commitShaOrBranch}/${file.path}`;
        
        const fileResponse = await fetch(cdnUrl, {
          cache: 'default', // Use browser cache when appropriate
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!fileResponse.ok) {
          console.error(`❌ Failed to fetch ${file.path}: ${fileResponse.status}`);
          throw new Error(`Failed to fetch ${file.path}`);
        }
        
        const questionData = await fileResponse.json();
        const fileName = file.path.split("/").pop();
        const persistentId = fileName.replace(".json", "");
        
        const newQuestion = {
          ...questionData,
          id: persistentId,
          filename: fileName,
        };
        
        setQuestionsLoaded((prev) => prev + 1);
        return newQuestion;
      } catch (err) {
        console.error(`❌ Error loading ${file.path}:`, err);
        setQuestionsLoaded((prev) => prev + 1);
        return null; // Return null for failed loads
      }
    });

    const loadedQuestions = await Promise.all(loadPromises);
    const validQuestions = loadedQuestions.filter((q) => q !== null);
    
    if (validQuestions.length === 0) {
      throw new Error('Failed to load any valid questions');
    }
    
    const sortedQuestions = validQuestions.sort((a, b) =>
      a.id.localeCompare(b.id)
    );

    console.log(`✅ Successfully loaded ${validQuestions.length}/${questionFiles.length} questions`);
    
    // Only update questions state if we successfully loaded some
    setQuestions(sortedQuestions);
    
  } catch (err) {
    console.error("❌ Critical error loading questions from GitHub:", err);
    setError(`Failed to load questions: ${err.message}. Please refresh the page.`);
    
    // Keep existing questions if available (don't wipe them)
    if (questions.length === 0) {
      setQuestions([]); // Only clear if already empty
    }
  } finally {
    setLoadingQuestions(false);
  }
};




  // Load SQL.js and PGlite
  useEffect(() => {
    const loadEngines = async () => {
      try {
        const sqlScript = document.createElement("script");
        sqlScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js";
        sqlScript.async = true;
        sqlScript.onload = async () => {
          const initSqlJs = window.initSqlJs;
          if (initSqlJs) {
            const SQLEngine = await initSqlJs({
              locateFile: (file) =>
                `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
            });
            setSQL(SQLEngine);
          }
        };
        sqlScript.onerror = () => {
          setError("Failed to load SQL.js library");
        };
        document.head.appendChild(sqlScript);
        try {
          const module = await import(
            "https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js"
          );
          setPGlite(() => module.PGlite);
        } catch (err) {
          console.warn("PGlite not available:", err);
        }
        setLoading(false);
      } catch (err) {
        setError("Error initializing database engines: " + err.message);
        setLoading(false);
      }
    };
    loadEngines();
  }, []);
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadQuestionsFromGitHub();
    }
  }, []);



  
  // Initialize database with current question's schema
  useEffect(() => {
    const initializeDatabases = async () => {
      if (questions.length > 0 && questions[currentQuestion]) {
        const schema = questions[currentQuestion].schema;
        if (SQL) {
          try { 
            const newDb = new SQL.Database();
            newDb.exec(schema);
            setDb(newDb);
          } catch (err) {
            console.error("Error loading SQLite schema:", err);
          }
        }
        if (PGlite) {
          try {
            if (pgDb) {
              try {
                await pgDb.close();
              } catch (e) {
                // Ignore close errors
              }
            }
            const newPgDb = await PGlite.create();
            await newPgDb.exec(schema);
            setPgDb(newPgDb);
          } catch (err) {
            console.error("Error loading PGlite schema:", err);
          }
        }
        setUserQuery("");
        setResult(null);
        setError("");
        setIsCorrect(null);
        setShowOutput(false);
        // NEW: Clear test states
        setTestResult(null);
        setTestError('');
        setShowTestOutput(false);
      }
    };
    initializeDatabases();
  }, [SQL, PGlite, currentQuestion, questions]);
  // Reset current question when filter changes if current question is not in filtered list
  useEffect(() => {
    if (
      filteredQuestions.length > 0 &&
      questions.length > 0 &&
      questions[currentQuestion]
    ) {
      const currentQ = questions[currentQuestion];
      const currentQuestionInFilter = filteredQuestions.find(
        (q) => q.id === currentQ.id
      );
      if (!currentQuestionInFilter) {
        const firstFilteredIndex = questions.findIndex(
          (q) => q.id === filteredQuestions[0].id
        );
        if (firstFilteredIndex >= 0) {
          setCurrentQuestion(firstFilteredIndex);
        }
      }
    }
  }, [difficultyFilter, searchQuery, questions.length]);
  const normalizeResult = (result) => {
    if (!result || result.length === 0) return null;
    return {
      columns: result[0].columns.map((c) => c.toLowerCase()),
      values: result[0].values.map((row) =>
        row.map((cell) =>
          typeof cell === "number" ? Math.round(cell * 100) / 100 : cell
        )
      ),
    };
  };
  const normalizePGResult = (result) => {
    if (!result || !result.rows || result.rows.length === 0) {
      return {
        columns: result.fields?.map((f) => f.name.toLowerCase()) || [],
        values: [],
      };
    }
    const columns = result.fields.map((f) => f.name.toLowerCase());
    const values = result.rows.map((row) =>
      columns.map((col) => {
        const value = row[col];
        return typeof value === "number"
          ? Math.round(value * 100) / 100
          : value;
      })
    );
    return { columns, values };
  };
  // NEW: Test Query Function
  const testQuery = async () => {
    if (!userQuery.trim()) {
      setTestError('Please enter a query');
      return;
    }

    // ADD THESE LINES TO CLEAR CHECK SOLUTION OUTPUT
    setShowOutput(false);
    setResult(null);
    setError('');
    setIsCorrect(null);
    setShowTestCases(false);
    setTestCaseResults([]);
    // END OF NEW LINES


    if (selectedEngine === 'SQLite' && !db) {
      setTestError('SQLite database not initialized');
      return;
    }

    if (selectedEngine === 'PostgreSQL' && !pgDb) {
      setTestError('PostgreSQL database not initialized');
      return;
    }

    try {
      setTestError('');
      setShowTestOutput(true);

      let resultData;

      if (selectedEngine === 'SQLite') {
        const queryResult = db.exec(userQuery);
        resultData = queryResult.length > 0 ? queryResult[0] : { columns: [], values: [] };
      } else {
        const queryResult = await pgDb.query(userQuery);
        resultData = {
          columns: queryResult.fields?.map(f => f.name) || [],
          values: queryResult.rows?.map(row =>
            queryResult.fields.map(f => row[f.name])
          ) || []
        };
      }

      setTestResult(resultData);
    } catch (err) {
      setTestError(err.message);
      setTestResult(null);
    }
  };

  // const executeQuery = async () => {
  //   if (!userQuery.trim()) {
  //     setError("Please enter a query");
  //     return;
  //   }
  //   if (selectedEngine === "SQLite" && !db) {
  //     setError("SQLite database not initialized");
  //     return;
  //   }
  //   if (selectedEngine === "PostgreSQL" && !pgDb) {
  //     setError("PostgreSQL database not initialized");
  //     return;
  //   }
  //   try {
  //     setError("");
  //     setShowOutput(true);
  //     let normalizedUser;
  //     let resultData;
  //     if (selectedEngine === "SQLite") {
  //       const userResult = db.exec(userQuery);
  //       normalizedUser = normalizeResult(userResult);
  //       resultData =
  //         userResult.length > 0 ? userResult[0] : { columns: [], values: [] };
  //     } else {
  //       const userResult = await pgDb.query(userQuery);
  //       normalizedUser = normalizePGResult(userResult);
  //       resultData = {
  //         columns: userResult.fields?.map((f) => f.name) || [],
  //         values:
  //           userResult.rows?.map((row) =>
  //             userResult.fields.map((f) => row[f.name])
  //           ) || [],
  //       };
  //     }
  //     const expected = questions[currentQuestion].expectedResult;
  //     const normalizedExpected = {
  //       columns: expected.columns.map((c) => c.toLowerCase()),
  //       values: expected.values.map((row) =>
  //         row.map((cell) =>
  //           typeof cell === "number" ? Math.round(cell * 100) / 100 : cell
  //         )
  //       ),
  //     };
  //     const matches =
  //       normalizedUser &&
  //       JSON.stringify(normalizedUser.columns.sort()) ===
  //         JSON.stringify(normalizedExpected.columns.sort()) &&
  //       JSON.stringify(normalizedUser.values.sort()) ===
  //         JSON.stringify(normalizedExpected.values.sort());
  //     setIsCorrect(matches);
  //     setResult(resultData);
  //     // if (matches) {
  //     //   const currentQuestionId = questions[currentQuestion]?.id;
  //     //   if (currentQuestionId !== undefined) {
  //     //      if (!completedQuestions.has(currentQuestionId)) {
  //     //        setCompletedQuestions(prevSet => {
  //     //          const newSet = new Set(prevSet);
  //     //          newSet.add(currentQuestionId);
  //     //          return newSet;
  //     //        });
  //     //      }
  //     //   }
  //     // }
  //     if (matches) {
  //       const currentQuestionId = questions[currentQuestion]?.id;
  //       if (currentQuestionId !== undefined) {
  //         if (!completedQuestions.has(currentQuestionId)) {
  //           setCompletedQuestions((prevSet) => {
  //             const newSet = new Set(prevSet);
  //             newSet.add(currentQuestionId);
  //             return newSet;
  //           });
  //           // Update streak when a new question is completed
  //           updateStreak();
  //         }
  //       }
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //     setResult(null);
  //     setIsCorrect(false);
  //     setShowOutput(true);
  //   }
  // };
  const executeQuery = async () => {
    if (!userQuery.trim()) {
      setError("Please enter a query");
      return;
    }
    if (selectedEngine === "SQLite" && !db) {
      setError("SQLite database not initialized");
      return;
    }
    if (selectedEngine === "PostgreSQL" && !pgDb) {
      setError("PostgreSQL database not initialized");
      return;
    }
    try {
      setShowTestOutput(false);
      setTestResult(null);
      setTestError('');

      setError("");
      setShowOutput(true);
      const currentQ = questions[currentQuestion];
      // Check if question uses new test case format or old format
      const hasTestCases = currentQ.testCases && currentQ.testCases.length > 0;
      if (hasTestCases) {
        // NEW FORMAT: Run all test cases
        const results = [];
        let allPassed = true;
        for (const testCase of currentQ.testCases) {
          try {
            // Create a fresh database for this test case
            let testDb, normalizedUser, resultData;
            if (selectedEngine === "SQLite") {
              testDb = new SQL.Database();
              testDb.exec(testCase.schema);
              const userResult = testDb.exec(userQuery);
              normalizedUser = normalizeResult(userResult);
              resultData = userResult.length > 0 ? userResult[0] : { columns: [], values: [] };
            } else {
              testDb = await PGlite.create();
              await testDb.exec(testCase.schema);
              const userResult = await testDb.query(userQuery);
              normalizedUser = normalizePGResult(userResult);
              resultData = {
                columns: userResult.fields?.map((f) => f.name) || [],
                values: userResult.rows?.map((row) =>
                  userResult.fields.map((f) => row[f.name])
                ) || [],
              };
              await testDb.close();
            }
            const expected = testCase.expectedResult;
            const normalizedExpected = {
              columns: expected.columns.map((c) => c.toLowerCase()),
              values: expected.values.map((row) =>
                row.map((cell) =>
                  typeof cell === "number" ? Math.round(cell * 100) / 100 : cell
                )
              ),
            };
            const matches =
              normalizedUser &&
              JSON.stringify(normalizedUser.columns.sort()) ===
              JSON.stringify(normalizedExpected.columns.sort()) &&
              JSON.stringify(normalizedUser.values.sort()) ===
              JSON.stringify(normalizedExpected.values.sort());
            results.push({
              name: testCase.name,
              visible: testCase.visible,
              passed: matches,
              output: resultData,
              expected: expected,
            });
            if (!matches) allPassed = false;
          } catch (err) {
            results.push({
              name: testCase.name,
              visible: testCase.visible,
              passed: false,
              error: err.message,
            });
            allPassed = false;
          }
        }
        setTestCaseResults(results);
        setIsCorrect(allPassed);
        setResult(results[0]?.output || null); // Show first test case output
        setShowTestCases(true);
        // Mark as completed if all test cases passed
        if (allPassed) {
          const currentQuestionId = questions[currentQuestion]?.id;
          if (currentQuestionId !== undefined) {
            if (!completedQuestions.has(currentQuestionId)) {
              setCompletedQuestions((prevSet) => {
                const newSet = new Set(prevSet);
                newSet.add(currentQuestionId);
                return newSet;
              });
              updateStreak();
            }
          }
        }
      } else {
        // OLD FORMAT: Use existing logic with expectedResult
        let normalizedUser, resultData;
        if (selectedEngine === "SQLite") {
          const userResult = db.exec(userQuery);
          normalizedUser = normalizeResult(userResult);
          resultData = userResult.length > 0 ? userResult[0] : { columns: [], values: [] };
        } else {
          const userResult = await pgDb.query(userQuery);
          normalizedUser = normalizePGResult(userResult);
          resultData = {
            columns: userResult.fields?.map((f) => f.name) || [],
            values: userResult.rows?.map((row) =>
              userResult.fields.map((f) => row[f.name])
            ) || [],
          };
        }
        const expected = currentQ.expectedResult;
        const normalizedExpected = {
          columns: expected.columns.map((c) => c.toLowerCase()),
          values: expected.values.map((row) =>
            row.map((cell) =>
              typeof cell === "number" ? Math.round(cell * 100) / 100 : cell
            )
          ),
        };
        const matches =
          normalizedUser &&
          JSON.stringify(normalizedUser.columns.sort()) ===
          JSON.stringify(normalizedExpected.columns.sort()) &&
          JSON.stringify(normalizedUser.values.sort()) ===
          JSON.stringify(normalizedExpected.values.sort());
        setIsCorrect(matches);
        setResult(resultData);
        setShowTestCases(false);
        if (matches) {
          const currentQuestionId = questions[currentQuestion]?.id;
          if (currentQuestionId !== undefined) {
            if (!completedQuestions.has(currentQuestionId)) {
              setCompletedQuestions((prevSet) => {
                const newSet = new Set(prevSet);
                newSet.add(currentQuestionId);
                return newSet;
              });
              updateStreak();
            }
          }
        }
      }
    } catch (err) {
      setError(err.message);
      setResult(null);
      setIsCorrect(false);
      setShowOutput(true);
      setShowTestCases(false);
    }
  };
  // NEW: Share to LinkedIn Function
  //   const shareToLinkedIn = () => {
  //     if (!activeQuestion || !isCorrect) return;

  //     const questionTitle = activeQuestion.title;
  //     const questionId = activeQuestion.id;
  //     const difficulty = activeQuestion.difficulty;
  //     const questionUrl = `${window.location.origin}/practice/${questionId}`;

  //     const shareText = `🎉 Just solved "${questionTitle}" on SQL Unlimited!

  // 📊 Difficulty: ${difficulty}
  // 💻 Platform: SQL Unlimited - Interactive SQL Practice
  // 🔗 Try it yourself: ${questionUrl}

  // #SQL #DataScience #Learning #SQLUnlimited #CodingChallenge`;

  //     const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(questionUrl)}&summary=${encodeURIComponent(shareText)}`;

  //     window.open(linkedInUrl, '_blank', 'width=600,height=600');
  //   };





  const shareToLinkedIn = () => {
    if (!activeQuestion || !isCorrect) return;

    const questionTitle = activeQuestion.title;
    const questionId = activeQuestion.id;
    const difficulty = activeQuestion.difficulty;
    const questionUrl = `${window.location.origin}/practice/${questionId}`;

    const shareText = `🎉 Just solved "${questionTitle}" on SQL Unlimited!

📊 Difficulty: ${difficulty}
💻 Platform: SQL Unlimited - Interactive SQL Practice
🔗 Try it yourself: ${questionUrl}

#SQL #DataScience #Learning #SQLUnlimited #CodingChallenge`;

    // Use the LinkedIn share URL with text parameter
    const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;

    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };






  const difficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  const getQuestionButtonColor = (q, isActive) => {
    if (completedQuestions.has(q.id)) {
      return isActive
        ? "bg-green-500 border-green-600 ring-4 ring-green-400 scale-110 shadow-lg"
        : "bg-green-500 border-green-600 hover:scale-105 shadow";
    }
    return isActive
      ? "bg-gray-400 border-gray-500 ring-4 ring-blue-400 scale-110 shadow-lg"
      : "bg-gray-400 border-gray-500 hover:scale-105 shadow";
  };
  const renderTable = (data) => {
    if (!data || !data.columns || data.columns.length === 0) return null;
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {data.columns.map((col, idx) => (
                <th
                  key={idx}
                  className="border px-2 md:px-3 py-1 md:py-2 text-left font-semibold border-gray-300 text-gray-800 text-xs md:text-sm"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.values.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="border px-2 md:px-3 py-1 md:py-2 border-gray-300 text-gray-800 text-xs md:text-sm"
                  >
                    {cell !== null ? cell.toString() : "NULL"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  const filteredQuestions = questions.filter((q) => {
    const matchesDifficulty =
      difficultyFilter === "All" || q.difficulty === difficultyFilter;
    const matchesSearch =
      searchQuery === "" ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toString().includes(searchQuery);
    return matchesDifficulty && matchesSearch;
  });
  const getCurrentQuestion = () => {
    if (questions.length === 0) return null;
    if (filteredQuestions.length === 0) return questions[0];
    const currentQ = questions[currentQuestion];
    const isInFiltered = filteredQuestions.find((q) => q.id === currentQ?.id);
    if (isInFiltered) {
      return currentQ;
    }
    return filteredQuestions[0];
  };
  const activeQuestion = getCurrentQuestion();
  // Mobile warning popup
  if (showMobileWarning && !mobileContinue) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 md:p-8 text-center">
          <div className="mb-6">
            <Smartphone className="w-12 h-12 md:w-16 md:h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Mobile Device Detected
            </h2>
            <p className="text-gray-700 text-base md:text-lg mb-2">
              This app works best on desktop or tablet.
            </p>
            <p className="text-gray-600 text-sm">
              You can continue on mobile, but some features may be harder to use
              on smaller screens.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              💻 For the best experience, use a desktop or laptop computer.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setMobileContinue(true);
                setShowMobileWarning(false);
              }}
              className="flex-1 px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition font-semibold"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-50 overflow-hidden">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading SQL Engines...</p>
        </div>
      </div>
    );
  }
  const isInitialLoad = loadingQuestions && questions.length === 0;
  const hasPartialQuestions = questions.length > 0 && loadingQuestions;
  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-50 overflow-hidden">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">
            Loading questions...
          </p>
          {totalQuestions > 0 && (
            <p className="text-gray-500 text-sm mt-2">
              {questionsLoaded} / {totalQuestions} questions loaded
            </p>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen w-screen bg-gray-50 text-gray-900 flex flex-col overflow-hidden">
      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <h2 className="text-xl font-bold text-gray-900">
                About This Platform
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                🎨{" "}
                <strong>
                  This is just a hobby project and entirely vibe-coded!
                </strong>
              </p>
              <p>
                If you encounter any bugs, please fix them if you can —
                otherwise, message me on LinkedIn, and I'll talk to Claude to
                resolve it. 😄
              </p>
              <p>
                <strong>✨ Open Source & Community Driven:</strong> This
                platform is open source! Anyone can contribute by adding SQL
                questions they've been asked in interviews to help the community
                and learners grow together.
              </p>
              <p>
                <strong>🚀 How to Contribute:</strong> You can easily add new
                questions using the <strong>"Contribute Question"</strong>{" "}
                button at the top of the page. Your contributions will directly
                benefit fellow learners!
              </p>
              <p>
                <strong>💾 Local Progress Storage:</strong> We don't have a
                backend server. Your progress (like solved questions) is saved
                only in your browser's local storage. This means if you switch
                devices or browsers, your progress won't be available. Please
                use the same browser and device to continue where you left off!
              </p>
              <p>
                <strong>🔥 Daily Streak:</strong> Solve at least one question
                each day to maintain your streak! Your current streak is{" "}
                <span className="font-bold text-orange-600">
                  {currentStreak} days
                </span>
                .{" "}
                {longestStreak > 0 &&
                  `Your longest streak ever: ${longestStreak} days!`}{" "}
                Keep it going!
              </p>
              <div className="flex gap-2 mt-4">
                <a
                  href="https://github.com/sqlunlimited/sqlunlimited.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition text-sm"
                >
                  <Github className="w-4 h-4" />
                  View Platform Code
                </a>
                <a
                  href="https://www.linkedin.com/in/sukhpreet41/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-sm"
                >
                  <User className="w-4 h-4" />
                  Connect on LinkedIn
                </a>
              </div>
              <p className="text-sm text-gray-500 italic">
                Built with love, caffeine, and a lot of trial and error! ☕✨
              </p>
            </div>
            <button
              onClick={() => setShowAboutModal(false)}
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      {/* Mobile Questions List Modal */}
      {showMobileQuestionsList && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-base flex items-center gap-2 text-gray-900">
                <Book className="w-5 h-5" />
                Questions ({questions.length})
              </h2>
              <button
                onClick={() => setShowMobileQuestionsList(false)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3 flex-shrink-0">
              <div>
                <label className="text-xs font-medium mb-2 block text-gray-600">
                  <Search className="w-3 h-3 inline mr-1" />
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-900 border-gray-300 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-2 block text-gray-600">
                  <Filter className="w-3 h-3 inline mr-1" />
                  Difficulty
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-900 border-gray-300 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q) => {
                  const actualIndex = questions.findIndex(
                    (question) => question.id === q.id
                  );
                  const isCompleted = completedQuestions.has(q.id);
                  const isActive = currentQuestion === actualIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        navigate(`/practice/${q.id}`);
                        setShowMobileQuestionsList(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition ${isActive
                          ? "bg-blue-50 border-2 border-blue-600"
                          : isCompleted
                            ? "bg-green-50 border-2 border-green-600"
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm text-gray-900 truncate flex-1">
                          {q.title}
                        </div>
                        {isCompleted && (
                          <span className="ml-2 text-green-600 flex-shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded mt-1 inline-block ${difficultyColor(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No questions found.</p>
                  <button
                    onClick={() => {
                      setDifficultyFilter("All");
                      setSearchQuery("");
                    }}
                    className="mt-3 text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white border-b shadow-sm border-gray-200 flex-shrink-0">
        <div className="px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Code className="w-5 h-5 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
              <h1 className="text-base md:text-2xl font-bold text-gray-900 truncate">
                SQL_Unlimited
              </h1>
              {currentStreak > 0 && (
                <div
                  className={`flex items-center gap-1 px-2 md:px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full shadow-lg ${showStreakCelebration ? "animate-bounce" : ""
                    }`}
                >
                  <Flame className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm font-bold">
                    {currentStreak}
                  </span>
                </div>
              )}
              {hasPartialQuestions && (
                <span className="hidden sm:inline text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full animate-pulse">
                  Loading {questionsLoaded}/{totalQuestions}
                </span>
              )}
            </div>
            <div className="flex gap-1 md:gap-2 flex-shrink-0">
              {isMobile && (
                <button
                  onClick={() => setShowMobileQuestionsList(true)}
                  className="flex items-center gap-1 px-2 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-xs"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}
              {/* <button
                onClick={() => setShowAboutModal(true)}
                className="flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition text-xs md:text-sm"
              >
                <Info className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">About</span>
              </button> */}
              {/* <button
  onClick={() => onNavigate('landing')}
  className="flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-xs md:text-sm"
>
  <Home className="w-3 h-3 md:w-4 md:h-4" />
  <span className="hidden sm:inline">Home</span>
</button> */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-xs md:text-sm"
              >
                <Home className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>

              <button
              onClick={() => navigate('/generator')}
              className="flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition text-xs md:text-sm"
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">Create Question</span>
              <span className="md:hidden">Create</span>
            </button>
            
              <button
                onClick={() =>
                  window.open(`https://github.com/${GITHUB_REPO}`, "_blank")
                }
                className="flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition text-xs md:text-sm"
              >
                <Github className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">Contribute</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex" ref={containerRef}>
          {/* Desktop Questions List */}
          {!isMobile && (
            <div
              className={`bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${isQuestionsPanelCollapsed ? "w-16" : "w-64"
                }`}
            >
              {isQuestionsPanelCollapsed ? (
                <div className="flex flex-col h-full">
                  <div className="p-2 border-b border-gray-200 flex-shrink-0">
                    <button
                      onClick={() => setIsQuestionsPanelCollapsed(false)}
                      className="w-full p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      title="Expand questions panel"
                    >
                      <ChevronRight className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto hide-scrollbar py-2">
                    {filteredQuestions.map((q) => {
                      const actualIndex = questions.findIndex(
                        (question) => question.id === q.id
                      );
                      const isActive = currentQuestion === actualIndex;
                      return (
                        <div key={q.id} className="px-2 mb-2">
                          <button
                          key={q.id}
                            onClick={() => navigate(`/practice/${q.id}`)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all relative ${getQuestionButtonColor(
                              q,
                              isActive
                            )} text-white border-2`}
                            title={`${q.id}. ${q.title}${completedQuestions.has(q.id) ? " - COMPLETED" : ""
                              }`}
                          >
                            {q.id.substring(0, 3).toUpperCase()}
                            {completedQuestions.has(q.id) && (
                              <span className="absolute text-[10px] text-white font-bold top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-green-700 rounded-full w-4 h-4 flex items-center justify-center">
                                ✓
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full p-4">
                  <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <h2 className="font-semibold text-base flex items-center gap-2 text-gray-900">
                      <Book className="w-5 h-5" />
                      Questions ({questions.length})
                    </h2>
                    <button
                      onClick={() => setIsQuestionsPanelCollapsed(true)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      title="Collapse questions panel"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mb-3 flex-shrink-0">
                    <label className="text-xs font-medium mb-2 block text-gray-600">
                      <Search className="w-3 h-3 inline mr-1" />
                      Search
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-900 border-gray-300 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-4 flex-shrink-0">
                    <label className="text-xs font-medium mb-2 block text-gray-600">
                      <Filter className="w-3 h-3 inline mr-1" />
                      Difficulty
                    </label>
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-900 border-gray-300 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div className="space-y-2 overflow-y-auto text-gray-900 flex-1 min-h-0 hide-scrollbar">
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((q) => {
                        const actualIndex = questions.findIndex(
                          (question) => question.id === q.id
                        );
                        const isCompleted = completedQuestions.has(q.id);
                        const isActive = currentQuestion === actualIndex;
                        return (
                          <button
                          key={q.id}
  onClick={() => navigate(`/practice/${q.id}`)}
  className={`w-full text-left p-3 rounded-lg transition ${isActive
                                ? "bg-blue-50 border-2 border-blue-600"
                                : isCompleted
                                  ? "bg-green-50 border-2 border-green-600"
                                  : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-sm text-gray-900 truncate flex-1">
                                {q.title}
                              </div>
                              {isCompleted && (
                                <span className="ml-2 text-green-600 flex-shrink-0">
                                  ✓
                                </span>
                              )}
                            </div>
                            <div
                              className={`text-xs px-2 py-1 rounded mt-1 inline-block ${difficultyColor(
                                q.difficulty
                              )}`}
                            >
                              {q.difficulty}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No questions found.</p>
                        <button
                          onClick={() => {
                            setDifficultyFilter("All");
                            setSearchQuery("");
                          }}
                          className="mt-3 text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Desktop Layout - Resizable Panels */}
            {!isMobile ? (
              <>
                {/* Left Panel - Question Details */}
                <div
                  className="overflow-y-auto hide-scrollbar bg-gray-50"
                  style={{ width: `${leftPanelWidth}%` }}
                >
                  <div className="p-4 space-y-4">
                    {activeQuestion ? (
                      <>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <div className="flex items-start justify-between mb-4 gap-2">
                            <h2 className="text-xl font-bold text-gray-900">
                              {activeQuestion.title}
                            </h2>
                            <div className="flex gap-1">
                              {/* <button
                                onClick={() => {
                                  navigator.clipboard.writeText(window.location.href).then(() => {
                                    alert('Question link copied!');
                                  });
                                }}
                                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                                title="Share this question"
                              >
                                <Upload className="w-4 h-4" />
                              </button> */}
                              {completedQuestions.has(activeQuestion.id) && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                                  ✓ Completed
                                </span>
                              )}
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColor(
                                  activeQuestion.difficulty
                                )} flex-shrink-0`}
                              >
                                {activeQuestion.difficulty}
                              </span>
                            </div>
                          </div>
                          <p className="text-base text-gray-700 mb-4">
                            {activeQuestion.description}
                          </p>
                          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                            <p className="text-sm text-blue-800">
                              <strong>Hint:</strong> {activeQuestion.hint}
                            </p>
                          </div>
                          {activeQuestion.contributor && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <a
                                href={activeQuestion.contributor.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition bg-gray-100 hover:bg-gray-200 text-gray-700"
                              >
                                <User className="w-4 h-4" />
                                Contributor: {activeQuestion.contributor.name}
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 text-base">
                            <Table className="w-4 h-4" />
                            Input Data
                          </h3>
                          {SQL &&
                            (() => {
                              try {
                                const tempDb = new SQL.Database();
                                tempDb.exec(activeQuestion.schema);
                                const tables = tempDb.exec(
                                  "SELECT name FROM sqlite_master WHERE type='table'"
                                );
                                return tables[0].values.map(([tableName]) => {
                                  const data = tempDb.exec(
                                    `SELECT * FROM ${tableName}`
                                  );
                                  return (
                                    <div key={tableName} className="mb-4">
                                      <h4 className="text-sm font-medium mb-2 text-gray-700">
                                        {tableName}
                                      </h4>
                                      {renderTable(data[0])}
                                    </div>
                                  );
                                });
                              } catch (err) {
                                return (
                                  <p className="text-sm text-gray-500">
                                    Unable to display input data
                                  </p>
                                );
                              }
                            })()}
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 text-base">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Expected Output
                          </h3>
                          {renderTable(activeQuestion.expectedResult)}
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 text-base">
                            <Code className="w-4 h-4" />
                            Database Schema
                          </h3>
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                            {activeQuestion.schema.trim()}
                          </pre>
                        </div>
                      </>
                    ) : (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <p className="text-center text-gray-500 text-base">
                          No questions available for the selected filter.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Resizer */}
                <div
                  className={`resizer w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize flex-shrink-0 ${isDragging ? "dragging bg-blue-500" : ""
                    }`}
                  onMouseDown={() => setIsDragging(true)}
                />
                {/* Right Panel - SQL Editor */}
                <div
                  className="overflow-y-auto hide-scrollbar bg-gray-50"
                  style={{ width: `${100 - leftPanelWidth}%` }}
                >
                  <div className="p-4 space-y-4">
                    {activeQuestion ? (
                      <>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 text-base">
                              Your SQL Query
                            </h3>
                            <div className="flex items-center gap-2">
                              <select
                                value={selectedEngine}
                                onChange={(e) =>
                                  setSelectedEngine(e.target.value)
                                }
                                className="px-3 py-2 text-sm bg-gray-50 text-gray-900 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="SQLite">SQLite</option>
                                <option value="PostgreSQL">PostgreSQL</option>
                              </select>
                              <button
                                onClick={testQuery}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-sm"
                                title="Test your query without validation"
                              >
                                <Play className="w-4 h-4" />
                                Run Query
                              </button>
                              <button
                                onClick={executeQuery}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition text-sm"
                                title="Check if your solution is correct"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Check Solution
                              </button>
                            </div>
                          </div>
                          <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
                            <Database className="w-3 h-3" />
                            Running on:{" "}
                            <span className="font-semibold">
                              {selectedEngine}
                            </span>
                          </div>
                          <textarea
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            placeholder="-- Write your SQL query here..."
                            className="w-full h-64 p-4 rounded-lg font-mono text-sm focus:outline-none resize-none bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {/* {showOutput &&
                          (result || error || isCorrect !== null) && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900 text-base">
                                  Query Results
                                </h3>
                              </div>
                              {isCorrect !== null && (
                                <div
                                  className={`flex items-center gap-2 mb-4 p-4 rounded-lg ${
                                    isCorrect
                                      ? "bg-green-50 text-green-800"
                                      : "bg-red-50 text-red-800"
                                  }`}
                                >
                                  {isCorrect ? (
                                    <>
                                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                      <span className="font-semibold text-sm">
                                        Correct! Well done! 🎉
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-5 h-5 flex-shrink-0" />
                                      <span className="font-semibold text-sm">
                                        Not quite right. Compare your output
                                        with the expected output.
                                      </span>
                                    </>
                                  )}
                                </div>
                              )}
                              {error && (
                                <div className="border p-4 rounded-lg mb-4 border-red-200 bg-red-50 text-red-800 text-sm">
                                  <strong>Error:</strong> {error}
                                </div>
                              )}
                              {result && (
                                <div>
                                  <h4 className="font-semibold mb-3 text-sm text-gray-900">
                                    Your Output:
                                  </h4>
                                  {result.values && result.values.length > 0 ? (
                                    renderTable(result)
                                  ) : (
                                    <p className="text-gray-500 text-sm">
                                      Query executed successfully. No rows
                                      returned.
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )} */}
                        {showOutput && (result || error || isCorrect !== null) && (
                          <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold text-gray-900 text-base">
                                Query Results
                              </h3>
                            </div>
                            {isCorrect !== null && (
                              <div className={`flex items-center justify-between gap-2 mb-4 p-4 rounded-lg ${isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                                }`}>
                                <div className="flex items-center gap-2">
                                  {isCorrect ? (
                                    <>
                                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                      <span className="font-semibold text-sm">
                                        Correct! Well done! 🎉
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-5 h-5 flex-shrink-0" />
                                      <span className="font-semibold text-sm">
                                        Not quite right. {showTestCases ? "Check test case results below." : "Compare your output with the expected output."}
                                      </span>
                                    </>
                                  )}
                                </div>
                                {isCorrect && (
                                  <button
                                    onClick={shareToLinkedIn}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-xs font-medium flex-shrink-0"
                                    title="Share your achievement on LinkedIn"
                                  >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                    Share
                                  </button>
                                )}
                              </div>
                            )}
                            {error && (
                              <div className="border p-4 rounded-lg mb-4 border-red-200 bg-red-50 text-red-800 text-sm">
                                <strong>Error:</strong> {error}
                              </div>
                            )}
                            {/* TEST CASE RESULTS */}
                            {/* {showTestCases && testCaseResults.length > 0 && (
      <div className="space-y-3 mb-4">
        <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
          <Table className="w-4 h-4" />
          Test Cases: {testCaseResults.filter(tc => tc.passed).length} / {testCaseResults.length} Passed
        </h4>
        {testCaseResults.map((tc, idx) => (
          tc.visible && (
            <div key={idx} className={`border rounded-lg p-3 ${
              tc.passed ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">
                  {tc.name}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  tc.passed ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                }`}>
                  {tc.passed ? "✓ Passed" : "✗ Failed"}
                </span>
              </div>
              {tc.error && (
                <div className="text-xs text-red-700 mb-2">
                  <strong>Error:</strong> {tc.error}
                </div>
              )}
              {!tc.passed && tc.output && (
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Your Output:</p>
                    {renderTable(tc.output)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Expected:</p>
                    {renderTable(tc.expected)}
                  </div>
                </div>
              )}
            </div>
          )
        ))}
        {testCaseResults.some(tc => !tc.visible) && (
          <div className="text-xs text-gray-600 italic">
            + {testCaseResults.filter(tc => !tc.visible).length} hidden test case(s)
          </div>
        )}
      </div>
    )} */}
                            {/* TEST CASE RESULTS */}
                            {showTestCases && testCaseResults.length > 0 && (
                              <div className="space-y-3 mb-4">
                                <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                                  <Table className="w-4 h-4" />
                                  Test Cases: {testCaseResults.filter(tc => tc.passed).length} / {testCaseResults.length} Passed
                                </h4>
                                {testCaseResults.map((tc, idx) => (
                                  tc.visible && (
                                    <div key={idx} className={`border rounded-lg p-4 ${tc.passed ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                                      }`}>
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="font-medium text-sm">
                                          {tc.name}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded font-semibold ${tc.passed ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                                          }`}>
                                          {tc.passed ? "✓ Passed" : "✗ Failed"}
                                        </span>
                                      </div>
                                      {tc.error ? (
                                        <div className="text-sm text-red-700 mb-2 p-2 bg-red-100 rounded">
                                          <strong>Error:</strong> {tc.error}
                                        </div>
                                      ) : (
                                        <div className="space-y-3">
                                          <div>
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Your Output:</p>
                                            <div className="border border-gray-300 rounded">
                                              {tc.output && tc.output.values && tc.output.values.length > 0 ? (
                                                renderTable(tc.output)
                                              ) : (
                                                <p className="text-xs text-gray-500 p-3">No rows returned</p>
                                              )}
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Expected Output:</p>
                                            <div className="border border-gray-300 rounded">
                                              {renderTable(tc.expected)}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                ))}
                                {testCaseResults.some(tc => !tc.visible) && (
                                  <div className="text-sm text-gray-600 italic p-3 bg-gray-100 rounded">
                                    ℹ️ + {testCaseResults.filter(tc => !tc.visible).length} hidden test case(s) {testCaseResults.filter(tc => !tc.visible && tc.passed).length > 0 ? `(${testCaseResults.filter(tc => !tc.visible && tc.passed).length} passed)` : ''}
                                  </div>
                                )}
                              </div>
                            )}
                            {/* SINGLE OUTPUT (for non-test-case questions) */}
                            {!showTestCases && result && (
                              <div>
                                <h4 className="font-semibold mb-3 text-sm text-gray-900">
                                  Your Output:
                                </h4>
                                {result.values && result.values.length > 0 ? (
                                  renderTable(result)
                                ) : (
                                  <p className="text-gray-500 text-sm">
                                    Query executed successfully. No rows returned.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {/* NEW: Test Query Output Section */}
                        {showTestOutput && (testResult || testError) && (
                          <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold text-gray-900 text-base">Test Query Results</h3>
                              <button
                                onClick={() => {
                                  setShowTestOutput(false);
                                  setTestResult(null);
                                  setTestError('');
                                }}
                                // className="text-gray-400 hover:text-gray-600"
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-100 transition"
                                title="Close test results"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            {testError && (
                              <div className="border p-4 rounded-lg mb-4 border-orange-200 bg-orange-50 text-orange-800 text-sm">
                                <strong>Error:</strong> {testError}
                              </div>
                            )}

                            {testResult && (
                              <div>
                                <h4 className="font-semibold mb-3 text-sm text-gray-900">Query Output:</h4>
                                {testResult.values && testResult.values.length > 0 ? (
                                  renderTable(testResult)
                                ) : (
                                  <p className="text-gray-500 text-sm">Query executed successfully. No rows returned.</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <p className="text-center text-gray-500 text-base">
                          Select a question to start practicing.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Mobile Layout - Tabbed Interface */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Tab Switcher */}
                <div className="bg-white border-b border-gray-200 flex-shrink-0">
                  <div className="flex gap-1 p-1">
                    {" "}
                    {/* Add gap-1 for spacing between buttons AND p-1 for padding from edges */}
                    <button
                      onClick={() => setMobileActiveTab("question")}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded transition ${mobileActiveTab === "question"
                          ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      Question
                    </button>
                    <button
                      onClick={() => setMobileActiveTab("editor")}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded transition ${mobileActiveTab === "editor"
                          ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      SQL Editor
                    </button>
                  </div>
                </div>
                {/* Mobile Tab Content */}
                <div className="flex-1 overflow-y-auto hide-scrollbar bg-gray-50">
                  {mobileActiveTab === "question" ? (
                    <div className="p-3 md:p-4 space-y-3 md:space-y-4">
                      {activeQuestion ? (
                        <>
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-start justify-between mb-3 gap-2">
                              <h2 className="text-base md:text-lg font-bold text-gray-900">
                                {activeQuestion.title}
                              </h2>
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(window.location.href).then(() => {
                                      alert('Question link copied!');
                                    });
                                  }}
                                  className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                                  title="Share this question"
                                >
                                  <Upload className="w-3 h-3" />
                                </button>
                                {completedQuestions.has(activeQuestion.id) && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center whitespace-nowrap">
                                    ✓ Done
                                  </span>
                                )}
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor(
                                    activeQuestion.difficulty
                                  )} flex-shrink-0 whitespace-nowrap`}
                                >
                                  {activeQuestion.difficulty}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                              {activeQuestion.description}
                            </p>
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
                              <p className="text-xs text-blue-800">
                                <strong>Hint:</strong> {activeQuestion.hint}
                              </p>
                            </div>
                            {activeQuestion.contributor && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <a
                                  href={activeQuestion.contributor.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg transition bg-gray-100 hover:bg-gray-200 text-gray-700"
                                >
                                  <User className="w-3 h-3" />
                                  By: {activeQuestion.contributor.name}
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-900 text-sm">
                              <Table className="w-4 h-4" />
                              Input Data
                            </h3>
                            {SQL &&
                              (() => {
                                try {
                                  const tempDb = new SQL.Database();
                                  tempDb.exec(activeQuestion.schema);
                                  const tables = tempDb.exec(
                                    "SELECT name FROM sqlite_master WHERE type='table'"
                                  );
                                  return tables[0].values.map(([tableName]) => {
                                    const data = tempDb.exec(
                                      `SELECT * FROM ${tableName}`
                                    );
                                    return (
                                      <div key={tableName} className="mb-3">
                                        <h4 className="text-xs font-medium mb-1 text-gray-700">
                                          {tableName}
                                        </h4>
                                        {renderTable(data[0])}
                                      </div>
                                    );
                                  });
                                } catch (err) {
                                  return (
                                    <p className="text-xs text-gray-500">
                                      Unable to display input data
                                    </p>
                                  );
                                }
                              })()}
                          </div>
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-900 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Expected Output
                            </h3>
                            {renderTable(activeQuestion.expectedResult)}
                          </div>
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-gray-900 text-sm">
                              <Code className="w-4 h-4" />
                              Database Schema
                            </h3>
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
                              {activeQuestion.schema.trim()}
                            </pre>
                          </div>
                        </>
                      ) : (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <p className="text-center text-gray-500 text-sm">
                            No questions available.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 md:p-4 space-y-3 md:space-y-4">
                      {activeQuestion ? (
                        <>
                          <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex flex-col gap-2 mb-3">
                              <h3 className="font-semibold text-gray-900 text-sm">Your SQL Query</h3>
                              <div className="flex flex-col gap-2">
                                <select
                                  value={selectedEngine}
                                  onChange={(e) =>
                                    setSelectedEngine(e.target.value)
                                  }
                                  className="w-full px-2 py-1.5 text-xs bg-gray-50 text-gray-900 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="SQLite">SQLite</option>
                                  <option value="PostgreSQL">PostgreSQL</option>
                                </select>
                                <div className="flex gap-2">
                                  <button
                                    onClick={testQuery}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-xs font-medium"
                                  >
                                    <Play className="w-3 h-3" />
                                    Test Query
                                  </button>
                                  <button
                                    onClick={executeQuery}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition text-xs font-medium"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    Check Solution
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
                              <Database className="w-3 h-3" />
                              Engine:{" "}
                              <span className="font-semibold">
                                {selectedEngine}
                              </span>
                            </div>
                            <textarea
                              value={userQuery}
                              onChange={(e) => setUserQuery(e.target.value)}
                              placeholder="-- Write your SQL query here..."
                              className="w-full h-48 md:h-64 p-3 rounded-lg font-mono text-xs focus:outline-none resize-none bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {/* {showOutput &&
                            (result || error || isCorrect !== null) && (
                              <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="font-semibold text-gray-900 text-sm">
                                    Query Results
                                  </h3>
                                </div>
                                {isCorrect !== null && (
                                  <div
                                    className={`flex items-center gap-2 mb-3 p-3 rounded-lg ${
                                      isCorrect
                                        ? "bg-green-50 text-green-800"
                                        : "bg-red-50 text-red-800"
                                    }`}
                                  >
                                    {isCorrect ? (
                                      <>
                                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                        <span className="font-semibold text-xs">
                                          Correct! Well done! 🎉
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-4 h-4 flex-shrink-0" />
                                        <span className="font-semibold text-xs">
                                          Not quite right. Try again!
                                        </span>
                                      </>
                                    )}
                                  </div>
                                )}
                                {error && (
                                  <div className="border p-3 rounded-lg mb-3 border-red-200 bg-red-50 text-red-800 text-xs">
                                    <strong>Error:</strong> {error}
                                  </div>
                                )}
                                {result && (
                                  <div>
                                    <h4 className="font-semibold mb-2 text-xs text-gray-900">
                                      Your Output:
                                    </h4>
                                    {result.values &&
                                    result.values.length > 0 ? (
                                      renderTable(result)
                                    ) : (
                                      <p className="text-gray-500 text-xs">
                                        Query executed successfully. No rows
                                        returned.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )} */}
                          {showOutput &&
                            (result || error || isCorrect !== null) && (
                              <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="font-semibold text-gray-900 text-sm">
                                    Query Results
                                  </h3>
                                </div>
                                {isCorrect !== null && (
                                  <div className={`mb-3 p-3 rounded-lg ${isCorrect
                                      ? 'bg-green-50 text-green-800'
                                      : 'bg-red-50 text-red-800'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                      {isCorrect ? (
                                        <>
                                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                          <span className="font-semibold text-xs">Correct! Well done! 🎉</span>
                                        </>
                                      ) : (
                                        <>
                                          <XCircle className="w-4 h-4 flex-shrink-0" />
                                          <span className="font-semibold text-xs">Not quite right. Try again!</span>
                                        </>
                                      )}
                                    </div>
                                    {isCorrect && (
                                      <button
                                        onClick={shareToLinkedIn}
                                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-xs font-medium mt-2"
                                      >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                        Share on LinkedIn
                                      </button>
                                    )}
                                  </div>
                                )}
                                {error && (
                                  <div className="border p-3 rounded-lg mb-3 border-red-200 bg-red-50 text-red-800 text-xs">
                                    <strong>Error:</strong> {error}
                                  </div>
                                )}
                                {/* TEST CASE RESULTS - MOBILE */}
                                {/* {showTestCases && testCaseResults.length > 0 && (
        <div className="space-y-2 mb-3">
          <h4 className="font-semibold text-xs text-gray-900 flex items-center gap-2">
            <Table className="w-3 h-3" />
            Test Cases: {testCaseResults.filter(tc => tc.passed).length} / {testCaseResults.length} Passed
          </h4>
          {testCaseResults.map((tc, idx) => (
            tc.visible && (
              <div key={idx} className={`border rounded-lg p-2 ${
                tc.passed ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-xs">
                    {tc.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    tc.passed ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                  }`}>
                    {tc.passed ? "✓ Pass" : "✗ Fail"}
                  </span>
                </div>
                {tc.error && (
                  <div className="text-xs text-red-700 mb-2">
                    <strong>Error:</strong> {tc.error}
                  </div>
                )}
                {!tc.passed && tc.output && (
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Your Output:</p>
                      {renderTable(tc.output)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Expected:</p>
                      {renderTable(tc.expected)}
                    </div>
                  </div>
                )}
              </div>
            )
          ))}
          {testCaseResults.some(tc => !tc.visible) && (
            <div className="text-xs text-gray-600 italic">
              + {testCaseResults.filter(tc => !tc.visible).length} hidden test case(s)
            </div>
          )}
        </div>
      )} */}
                                {/* TEST CASE RESULTS - MOBILE */}
                                {showTestCases && testCaseResults.length > 0 && (
                                  <div className="space-y-2 mb-3">
                                    <h4 className="font-semibold text-xs text-gray-900 flex items-center gap-2">
                                      <Table className="w-3 h-3" />
                                      Test Cases: {testCaseResults.filter(tc => tc.passed).length} / {testCaseResults.length} Passed
                                    </h4>
                                    {testCaseResults.map((tc, idx) => (
                                      tc.visible && (
                                        <div key={idx} className={`border rounded-lg p-3 ${tc.passed ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                                          }`}>
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-xs">
                                              {tc.name}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded font-semibold ${tc.passed ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                                              }`}>
                                              {tc.passed ? "✓ Pass" : "✗ Fail"}
                                            </span>
                                          </div>
                                          {tc.error ? (
                                            <div className="text-xs text-red-700 mb-2 p-2 bg-red-100 rounded">
                                              <strong>Error:</strong> {tc.error}
                                            </div>
                                          ) : (
                                            <div className="space-y-2">
                                              <div>
                                                <p className="text-xs font-semibold text-gray-700 mb-1">Your Output:</p>
                                                <div className="border border-gray-300 rounded">
                                                  {tc.output && tc.output.values && tc.output.values.length > 0 ? (
                                                    renderTable(tc.output)
                                                  ) : (
                                                    <p className="text-xs text-gray-500 p-2">No rows returned</p>
                                                  )}
                                                </div>
                                              </div>
                                              <div>
                                                <p className="text-xs font-semibold text-gray-700 mb-1">Expected:</p>
                                                <div className="border border-gray-300 rounded">
                                                  {renderTable(tc.expected)}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    ))}
                                    {testCaseResults.some(tc => !tc.visible) && (
                                      <div className="text-xs text-gray-600 italic p-2 bg-gray-100 rounded">
                                        ℹ️ + {testCaseResults.filter(tc => !tc.visible).length} hidden test case(s)
                                      </div>
                                    )}
                                  </div>
                                )}
                                {/* SINGLE OUTPUT (for non-test-case questions) - MOBILE */}
                                {!showTestCases && result && (
                                  <div>
                                    <h4 className="font-semibold mb-2 text-xs text-gray-900">
                                      Your Output:
                                    </h4>
                                    {result.values &&
                                      result.values.length > 0 ? (
                                      renderTable(result)
                                    ) : (
                                      <p className="text-gray-500 text-xs">
                                        Query executed successfully. No rows
                                        returned.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          {/* NEW: Mobile Test Query Output */}
                          {showTestOutput && (testResult || testError) && (
                            <div className="bg-white rounded-lg shadow-sm p-4 mt-3">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900 text-sm">Test Results</h3>
                                <button
                                  onClick={() => {
                                    setShowTestOutput(false);
                                    setTestResult(null);
                                    setTestError('');
                                  }}
                                  // className="text-gray-400 hover:text-gray-600"
                                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-100 transition"
                                  title="Close test results"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              {testError && (
                                <div className="border p-3 rounded-lg mb-3 border-orange-200 bg-orange-50 text-orange-800 text-xs">
                                  <strong>Error:</strong> {testError}
                                </div>
                              )}

                              {testResult && (
                                <div>
                                  <h4 className="font-semibold mb-2 text-xs text-gray-900">Query Output:</h4>
                                  {testResult.values && testResult.values.length > 0 ? (
                                    renderTable(testResult)
                                  ) : (
                                    <p className="text-gray-500 text-xs">Query executed successfully. No rows returned.</p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                          <p className="text-center text-gray-500 text-sm">
                            Select a question to start practicing.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SQLPracticePlatform;