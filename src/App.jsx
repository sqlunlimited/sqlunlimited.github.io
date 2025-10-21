
import React, { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle, XCircle, Upload, Book, Code, Table, Github, RefreshCw, Filter, X, User, Search, Database, BookOpen, Info, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';

const SQLPracticePlatform = () => {
  const [SQL, setSQL] = useState(null);
  const [PGlite, setPGlite] = useState(null);
  const [db, setDb] = useState(null);
  const [pgDb, setPgDb] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userQuery, setUserQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('SQLite');
  const [showLearningResources, setShowLearningResources] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isQuestionsPanelCollapsed, setIsQuestionsPanelCollapsed] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // State for completed questions
  const [completedQuestions, setCompletedQuestions] = useState(new Set());

  // Progressive loading states
  const [questions, setQuestions] = useState([]);
  const [questionsLoaded, setQuestionsLoaded] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const containerRef = useRef(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth <= 1024;
      setIsMobile(isMobileDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load completed questions from IndexedDB on mount
  useEffect(() => {
    const loadCompletedQuestions = async () => {
      try {
        const dbName = 'SQLPlatformDB';
        const storeName = 'completedQuestions';
        
        const request = indexedDB.open(dbName, 1);
        
        request.onerror = () => {
          console.error('Failed to open IndexedDB');
        };
        
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction([storeName], 'readonly');
          const objectStore = transaction.objectStore(storeName);
          const getAllRequest = objectStore.getAll();
          
          getAllRequest.onsuccess = () => {
            const completedIds = getAllRequest.result.map(item => item.id);
            if (completedIds.length > 0) {
              setCompletedQuestions(new Set(completedIds));
            }
          };
        };
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        };
      } catch (err) {
        console.error('Error loading completed questions:', err);
      }
    };
    
    loadCompletedQuestions();
  }, []);

  // Save completed questions to IndexedDB whenever they change
  useEffect(() => {
    const saveCompletedQuestions = async () => {
      if (completedQuestions.size === 0) return;
      
      try {
        const dbName = 'SQLPlatformDB';
        const storeName = 'completedQuestions';
        
        const request = indexedDB.open(dbName, 1);
        
        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction([storeName], 'readwrite');
          const objectStore = transaction.objectStore(storeName);
          
          // Clear existing data and add new
          objectStore.clear();
          Array.from(completedQuestions).forEach(id => {
            objectStore.add({ id: id });
          });
        };
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        };
      } catch (err) {
        console.error('Error saving completed questions:', err);
      }
    };
    
    saveCompletedQuestions();
  }, [completedQuestions]);

  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
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
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (newWidth >= 30 && newWidth <= 70) {
        setLeftPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  // GitHub repository configuration
  const GITHUB_REPO = 'sqlunlimited/sql_questions';
  const GITHUB_BRANCH = 'main';
  const QUESTIONS_FOLDER = 'questions';

  /**
   * OPTIMIZED: Uses GitHub Tree API to get all files in ONE API call
   * Then fetches raw files via cdn.jsdelivr.net (no rate limit!)
   */
  const loadQuestionsFromGitHub = async () => {
    setLoadingQuestions(true);
    setQuestions([]); // Clear existing questions first
    setQuestionsLoaded(0);
    setTotalQuestions(0);
    
    try {
      // Method 1: Use GitHub Tree API (1 API call to get all file info)
      const treeUrl = `https://api.github.com/repos/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`;
      const treeResponse = await fetch(treeUrl);
      
      if (!treeResponse.ok) {
        throw new Error('Failed to fetch repository tree');
      }

      const treeData = await treeResponse.json();
      
      // Filter JSON files in questions folder
      const questionFiles = treeData.tree.filter(
        item => item.path.startsWith(QUESTIONS_FOLDER) && 
                item.path.endsWith('.json') && 
                item.type === 'blob'
      );

      setTotalQuestions(questionFiles.length);

      // Method 2: Use jsDelivr CDN for raw file access (NO RATE LIMIT!)
      // jsDelivr format: https://cdn.jsdelivr.net/gh/user/repo@branch/path/to/file
      const loadPromises = questionFiles.map(async (file) => {
        try {
          // Use jsDelivr CDN instead of GitHub raw content
          const cdnUrl = `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@${GITHUB_BRANCH}/${file.path}`;
          const fileResponse = await fetch(cdnUrl);
          
          if (!fileResponse.ok) {
            throw new Error(`Failed to fetch ${file.path}`);
          }
          
          const questionData = await fileResponse.json();
          const fileName = file.path.split('/').pop();
          const persistentId = fileName.replace('.json', '');
          
          const newQuestion = {
            ...questionData,
            id: persistentId,
            filename: fileName
          };
          
          setQuestionsLoaded(prev => prev + 1);
          
          return newQuestion;
        } catch (err) {
          console.error(`Error loading ${file.path}:`, err);
          setQuestionsLoaded(prev => prev + 1);
          return null;
        }
      });

      // Load all questions in parallel and set once
      const loadedQuestions = await Promise.all(loadPromises);
      const validQuestions = loadedQuestions.filter(q => q !== null);
      
      // Sort and set all questions at once
      const sortedQuestions = validQuestions.sort((a, b) => a.id.localeCompare(b.id));
      setQuestions(sortedQuestions);
      
    } catch (err) {
      console.error('Error loading questions from GitHub:', err);
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Load SQL.js and PGlite
  useEffect(() => {
    const loadEngines = async () => {
      try {
        // Load SQL.js
        const sqlScript = document.createElement('script');
        sqlScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
        sqlScript.async = true;
        
        sqlScript.onload = async () => {
          const initSqlJs = window.initSqlJs;
          if (initSqlJs) {
            const SQLEngine = await initSqlJs({
              locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });
            setSQL(SQLEngine);
          }
        };
        
        sqlScript.onerror = () => {
          setError('Failed to load SQL.js library');
        };
        
        document.head.appendChild(sqlScript);

        // Load PGlite using dynamic import
        try {
          const module = await import('https://cdn.jsdelivr.net/npm/@electric-sql/pglite/dist/index.js');
          setPGlite(() => module.PGlite);
        } catch (err) {
          console.warn('PGlite not available:', err);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Error initializing database engines: ' + err.message);
        setLoading(false);
      }
    };
    loadEngines();
  }, []);

  // Load questions from GitHub on mount
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
        
        // Initialize SQLite
        if (SQL) {
          try {
            const newDb = new SQL.Database();
            newDb.exec(schema);
            setDb(newDb);
          } catch (err) {
            console.error('Error loading SQLite schema:', err);
          }
        }
        
        // Initialize PGlite
        if (PGlite) {
          try {
            // Close existing database if any
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
            console.error('Error loading PGlite schema:', err);
          }
        }
        
        setUserQuery('');
        setResult(null);
        setError('');
        setIsCorrect(null);
        setShowOutput(false);
      }
    };
    
    initializeDatabases();
  }, [SQL, PGlite, currentQuestion, questions]);

  // Reset current question when filter changes if current question is not in filtered list
  useEffect(() => {
    if (filteredQuestions.length > 0 && questions.length > 0 && questions[currentQuestion]) {
      const currentQ = questions[currentQuestion];
      const currentQuestionInFilter = filteredQuestions.find(q => q.id === currentQ.id);
      if (!currentQuestionInFilter) {
        const firstFilteredIndex = questions.findIndex(q => q.id === filteredQuestions[0].id);
        if (firstFilteredIndex >= 0) {
          setCurrentQuestion(firstFilteredIndex);
        }
      }
    }
  }, [difficultyFilter, searchQuery, questions.length]);

  const normalizeResult = (result) => {
    if (!result || result.length === 0) return null;
    return {
      columns: result[0].columns.map(c => c.toLowerCase()),
      values: result[0].values.map(row => 
        row.map(cell => typeof cell === 'number' ? Math.round(cell * 100) / 100 : cell)
      )
    };
  };

  const normalizePGResult = (result) => {
    if (!result || !result.rows || result.rows.length === 0) {
      return { columns: result.fields?.map(f => f.name.toLowerCase()) || [], values: [] };
    }
    
    const columns = result.fields.map(f => f.name.toLowerCase());
    const values = result.rows.map(row => 
      columns.map(col => {
        const value = row[col];
        return typeof value === 'number' ? Math.round(value * 100) / 100 : value;
      })
    );
    
    return { columns, values };
  };

  const executeQuery = async () => {
    if (!userQuery.trim()) {
      setError('Please enter a query');
      return;
    }

    if (selectedEngine === 'SQLite' && !db) {
      setError('SQLite database not initialized');
      return;
    }

    if (selectedEngine === 'PostgreSQL' && !pgDb) {
      setError('PostgreSQL database not initialized');
      return;
    }

    try {
      setError('');
      setShowOutput(true);
      
      let normalizedUser;
      let resultData;

      if (selectedEngine === 'SQLite') {
        const userResult = db.exec(userQuery);
        normalizedUser = normalizeResult(userResult);
        resultData = userResult.length > 0 ? userResult[0] : { columns: [], values: [] };
      } else {
        const userResult = await pgDb.query(userQuery);
        normalizedUser = normalizePGResult(userResult);
        resultData = {
          columns: userResult.fields?.map(f => f.name) || [],
          values: userResult.rows?.map(row => 
            userResult.fields.map(f => row[f.name])
          ) || []
        };
      }
      
      const expected = questions[currentQuestion].expectedResult;
      
      const normalizedExpected = {
        columns: expected.columns.map(c => c.toLowerCase()),
        values: expected.values.map(row => 
          row.map(cell => typeof cell === 'number' ? Math.round(cell * 100) / 100 : cell)
        )
      };
      
      const matches = normalizedUser && 
        JSON.stringify(normalizedUser.columns.sort()) === JSON.stringify(normalizedExpected.columns.sort()) &&
        JSON.stringify(normalizedUser.values.sort()) === JSON.stringify(normalizedExpected.values.sort());
      
      setIsCorrect(matches);
      setResult(resultData);

      // Track completion when user gets correct answer
      if (matches) {
        const currentQuestionId = questions[currentQuestion]?.id;
        if (currentQuestionId !== undefined) {
           if (!completedQuestions.has(currentQuestionId)) {
             setCompletedQuestions(prevSet => {
               const newSet = new Set(prevSet);
               newSet.add(currentQuestionId);
               return newSet;
             });
           }
        }
      }
    } catch (err) {
      setError(err.message);
      setResult(null);
      setIsCorrect(false);
      setShowOutput(true);
    }
  };

  const difficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': 
        return 'text-green-600 bg-green-100';
      case 'Medium': 
        return 'text-yellow-600 bg-yellow-100';
      case 'Hard': 
        return 'text-red-600 bg-red-100';
      default: 
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getQuestionButtonColor = (q, isActive) => {
    // If this question is completed, always show green
    if (completedQuestions.has(q.id)) {
      return isActive 
        ? 'bg-green-500 border-green-600 ring-4 ring-green-400 scale-110 shadow-lg' 
        : 'bg-green-500 border-green-600 hover:scale-105 shadow';
    }
    
    // Otherwise, show grey (inactive state)
    return isActive
      ? 'bg-gray-400 border-gray-500 ring-4 ring-blue-400 scale-110 shadow-lg'
      : 'bg-gray-400 border-gray-500 hover:scale-105 shadow';
  };

  const renderTable = (data) => {
    if (!data || !data.columns || data.columns.length === 0) return null;
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {data.columns.map((col, idx) => (
                <th key={idx} className="border px-3 py-2 text-left font-semibold border-gray-300 text-gray-800">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.values.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="border px-3 py-2 border-gray-300 text-gray-800">
                    {cell !== null ? cell.toString() : 'NULL'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Filter questions by difficulty and search query
  const filteredQuestions = questions.filter(q => {
    const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
    const matchesSearch = searchQuery === '' || 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toString().includes(searchQuery);
    return matchesDifficulty && matchesSearch;
  });

  // Get current question safely
  const getCurrentQuestion = () => {
    if (questions.length === 0) return null;
    if (filteredQuestions.length === 0) return questions[0];
    
    const currentQ = questions[currentQuestion];
    const isInFiltered = filteredQuestions.find(q => q.id === currentQ?.id);
    
    if (isInFiltered) {
      return currentQ;
    }
    return filteredQuestions[0];
  };

  const activeQuestion = getCurrentQuestion();

  // Mobile blocking popup
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <Smartphone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Desktop Experience Required</h2>
            <p className="text-gray-700 text-lg mb-2">
              Please use this site on a PC for a better experience.
            </p>
            <p className="text-gray-600 text-sm">
              This SQL practice platform is optimized for desktop browsers with larger screens for the best learning experience.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-blue-800 text-sm">
              💻 Switch to a desktop or laptop computer to access all features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-50 overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading SQL Engines...</p>
        </div>
      </div>
    );
  }

  // Show loading progress while questions load
  const isInitialLoad = loadingQuestions && questions.length === 0;
  const hasPartialQuestions = questions.length > 0 && loadingQuestions;

  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-50 overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading questions...</p>
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative max-h-screen overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <h2 className="text-xl font-bold text-gray-900">About This Platform</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                🎨 <strong>This is just a hobby project and entirely vibe-coded!</strong>
              </p>
              <p>
                If you encounter any bugs, please fix them if you can — otherwise, message me on LinkedIn, and I'll talk to Claude to resolve it. 😄
              </p>
              <p className="text-sm break-words">
                Platform code: https://github.com/sqlunlimited/sqlunlimited.github.io  
              </p>
              <p className="text-sm break-words">
                Connect with me: https://www.linkedin.com/in/sukhpreet41/  
              </p>
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

      {/* Header with loading indicator */}
      <div className="bg-white border-b shadow-sm border-gray-200 flex-shrink-0">
        <div className="px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <Code className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">SQL_Unlimited</h1>
              {hasPartialQuestions && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full animate-pulse">
                  Loading {questionsLoaded}/{totalQuestions}
                </span>
              )}
            </div>
            <div className="flex gap-2 md:gap-3 flex-shrink-0">
              <button
                onClick={() => setShowAboutModal(true)}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition text-xs md:text-sm"
              >
                <Info className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">About</span>
              </button>
              <button
                onClick={() => window.open(`https://github.com/${GITHUB_REPO}`, '_blank')}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition text-xs md:text-sm"
              >
                <Github className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Contribute Question</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex" ref={containerRef}>
          {/* Questions List - Collapsible */}
          <div 
            className={`bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
              isQuestionsPanelCollapsed ? 'w-16' : 'w-64'
            }`}
          >

            {isQuestionsPanelCollapsed ? (
            // Collapsed View - Vertical Icons
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
                  const actualIndex = questions.findIndex(question => question.id === q.id);
                  const isActive = currentQuestion === actualIndex;
                  return (
                    <div key={q.id} className="px-2 mb-2">
                      <button
                        onClick={() => setCurrentQuestion(actualIndex)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all relative ${
                          getQuestionButtonColor(q, isActive)
                        } text-white border-2`}
                        title={`${q.id}. ${q.title}${completedQuestions.has(q.id) ? ' - COMPLETED' : ''}`}
                      >
                        {q.id.substring(0, 3).toUpperCase()}
                        {completedQuestions.has(q.id) && (
                          <span className="absolute text-[10px] text-white font-bold top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-green-700 rounded-full w-4 h-4 flex items-center justify-center">✓</span>
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
                {/* Search Bar */}
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
                
                {/* Filter Dropdown */}
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
                      const actualIndex = questions.findIndex(question => question.id === q.id);
                      const isCompleted = completedQuestions.has(q.id);
                      const isActive = currentQuestion === actualIndex;
                      
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestion(actualIndex)}
                          className={`w-full text-left p-3 rounded-lg transition ${
                            isActive
                              ? 'bg-blue-50 border-2 border-blue-600'
                              : isCompleted
                                ? 'bg-green-50 border-2 border-green-600'
                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm text-gray-900 truncate flex-1">{q.title}</div>
                            {isCompleted && (
                              <span className="ml-2 text-green-600 flex-shrink-0">✓</span>
                            )}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded mt-1 inline-block ${difficultyColor(q.difficulty)}`}>
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
                          setDifficultyFilter('All');
                          setSearchQuery('');
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

          {/* Main Content Area with Resizable Panels */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Question Details */}
            <div 
              className="overflow-y-auto hide-scrollbar bg-gray-50"
              style={{ width: `${leftPanelWidth}%` }}
            >
              <div className="p-4 space-y-4">
                {activeQuestion ? (
                  <>
                    {/* Question Description */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-start justify-between mb-4 gap-2">
                        <h2 className="text-xl font-bold text-gray-900">{activeQuestion.title}</h2>
                        <div className="flex gap-1">
                          {completedQuestions.has(activeQuestion.id) && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                              ✓ Completed
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColor(activeQuestion.difficulty)} flex-shrink-0`}>
                            {activeQuestion.difficulty}
                          </span>
                        </div>
                      </div>
                      <p className="text-base text-gray-700 mb-4">{activeQuestion.description}</p>
                      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                        <p className="text-sm text-blue-800"><strong>Hint:</strong> {activeQuestion.hint}</p>
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

                    {/* Input Data Table */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 text-base">
                        <Table className="w-4 h-4" />
                        Input Data
                      </h3>
                      {SQL && (() => {
                        try {
                          const tempDb = new SQL.Database();
                          tempDb.exec(activeQuestion.schema);
                          const tables = tempDb.exec("SELECT name FROM sqlite_master WHERE type='table'");
                          
                          return tables[0].values.map(([tableName]) => {
                            const data = tempDb.exec(`SELECT * FROM ${tableName}`);
                            return (
                              <div key={tableName} className="mb-4">
                                <h4 className="text-sm font-medium mb-2 text-gray-700">{tableName}</h4>
                                {renderTable(data[0])}
                              </div>
                            );
                          });
                        } catch (err) {
                          return <p className="text-sm text-gray-500">Unable to display input data</p>;
                        }
                      })()}
                    </div>

                    {/* Expected Output */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 text-base">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Expected Output
                      </h3>
                      {renderTable(activeQuestion.expectedResult)}
                    </div>

                    {/* Schema Display */}
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
              className={`resizer w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize flex-shrink-0 ${
                isDragging ? 'dragging bg-blue-500' : ''
              }`}
              onMouseDown={() => setIsDragging(true)}
            />

            {/* Right Panel - SQL Editor and Results */}
            <div 
              className="overflow-y-auto hide-scrollbar bg-gray-50"
              style={{ width: `${100 - leftPanelWidth}%` }}
            >
              <div className="p-4 space-y-4">
                {activeQuestion ? (
                  <>
                    {/* SQL Editor */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-base">Your SQL Query</h3>
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedEngine}
                            onChange={(e) => setSelectedEngine(e.target.value)}
                            className="px-3 py-2 text-sm bg-gray-50 text-gray-900 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="SQLite">SQLite</option>
                            <option value="PostgreSQL">PostgreSQL</option>
                          </select>
                          <button
                            onClick={executeQuery}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition text-sm"
                          >
                            <Play className="w-4 h-4" />
                            Run
                          </button>
                        </div>
                      </div>
                      <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
                        <Database className="w-3 h-3" />
                        Running on: <span className="font-semibold">{selectedEngine}</span>
                      </div>
                      <textarea
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        placeholder="-- Write your SQL query here..."
                        className="w-full h-64 p-4 rounded-lg font-mono text-sm focus:outline-none resize-none bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Results */}
                    {showOutput && (result || error || isCorrect !== null) && (
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900 text-base">Query Results</h3>
                        </div>

                        {isCorrect !== null && (
                          <div className={`flex items-center gap-2 mb-4 p-4 rounded-lg ${
                            isCorrect 
                              ? 'bg-green-50 text-green-800'
                              : 'bg-red-50 text-red-800'
                          }`}>
                            {isCorrect ? (
                              <>
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="font-semibold text-sm">Correct! Well done! 🎉</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="font-semibold text-sm">Not quite right. Compare your output with the expected output.</span>
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
                            <h4 className="font-semibold mb-3 text-sm text-gray-900">Your Output:</h4>
                            {result.values && result.values.length > 0 ? (
                              renderTable(result)
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SQLPracticePlatform;