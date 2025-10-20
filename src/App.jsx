import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle, Upload, Book, Code, Table, Github, RefreshCw, Filter, X, User, Search } from 'lucide-react';

const SQLPracticePlatform = () => {
  const [SQL, setSQL] = useState(null);
  const [db, setDb] = useState(null);
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
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // GitHub repository configuration
  const GITHUB_REPO = 'sqlunlimited/sql_questions';
  const QUESTIONS_FOLDER = 'questions';
  const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}/contents/${QUESTIONS_FOLDER}`;

  const [questions, setQuestions] = useState([]);

  // Load questions from GitHub repository
  const loadQuestionsFromGitHub = async () => {
    setLoadingQuestions(true);
    try {
      const response = await fetch(GITHUB_API);
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions from GitHub');
      }

      const files = await response.json();
      const jsonFiles = files.filter(file => file.name.endsWith('.json'));

      const loadedQuestions = [];
      
      for (const file of jsonFiles) {
        try {
          const fileResponse = await fetch(file.download_url);
          const questionData = await fileResponse.json();
          loadedQuestions.push({
            ...questionData,
            id: loadedQuestions.length + 1,
            filename: file.name
          });
        } catch (err) {
          console.error(`Error loading ${file.name}:`, err);
        }
      }

      if (loadedQuestions.length > 0) {
        setQuestions(loadedQuestions);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      console.error('Error loading questions from GitHub:', err);
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Load SQL.js
  useEffect(() => {
    const loadSQL = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
        script.async = true;
        
        script.onload = async () => {
          const initSqlJs = window.initSqlJs;
          if (initSqlJs) {
            const SQLEngine = await initSqlJs({
              locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });
            setSQL(SQLEngine);
            setLoading(false);
          }
        };
        
        script.onerror = () => {
          setError('Failed to load SQL.js library');
          setLoading(false);
        };
        
        document.head.appendChild(script);
      } catch (err) {
        setError('Error initializing SQL engine: ' + err.message);
        setLoading(false);
      }
    };
    loadSQL();
  }, []);

  // Load questions from GitHub on mount
  useEffect(() => {
    loadQuestionsFromGitHub();
  }, []);

  // Initialize database with current question's schema
  useEffect(() => {
    if (SQL && questions.length > 0 && questions[currentQuestion]) {
      const newDb = new SQL.Database();
      const schema = questions[currentQuestion].schema;
      try {
        newDb.exec(schema);
        setDb(newDb);
        setUserQuery('');
        setResult(null);
        setError('');
        setIsCorrect(null);
        setShowOutput(false);
      } catch (err) {
        setError('Error loading question schema');
      }
    }
  }, [SQL, currentQuestion, questions]);

  // Reset current question when filter changes if current question is not in filtered list
  useEffect(() => {
    if (filteredQuestions.length > 0 && questions.length > 0) {
      const currentQ = questions[currentQuestion];
      const currentQuestionInFilter = filteredQuestions.find(q => q.id === currentQ?.id);
      if (!currentQuestionInFilter) {
        const firstFilteredIndex = questions.findIndex(q => q.id === filteredQuestions[0].id);
        if (firstFilteredIndex >= 0) {
          setCurrentQuestion(firstFilteredIndex);
        }
      }
    }
  }, [difficultyFilter, questions.length]);

  const normalizeResult = (result) => {
    if (!result || result.length === 0) return null;
    return {
      columns: result[0].columns.map(c => c.toLowerCase()),
      values: result[0].values.map(row => 
        row.map(cell => typeof cell === 'number' ? Math.round(cell * 100) / 100 : cell)
      )
    };
  };

  const executeQuery = () => {
    if (!db || !userQuery.trim()) {
      setError('Please enter a query');
      return;
    }

    try {
      setError('');
      setShowOutput(true);
      
      const userResult = db.exec(userQuery);
      const normalizedUser = normalizeResult(userResult);
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
      
      if (userResult.length > 0) {
        setResult(userResult[0]);
      } else {
        setResult({ columns: [], values: [] });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading SQL Engine...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b shadow-sm border-gray-200 flex-shrink-0">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <h1 className="text-2xl font-bold text-gray-900">SQL Practice Platform</h1>
              <span className="text-sm text-gray-500">({questions.length} questions)</span>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => window.open(`https://github.com/${GITHUB_REPO}`, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition"
              >
                <Github className="w-4 h-4" />
                Contribute Question
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 text-gray-900 flex-1 w-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[calc(100vh-120px)] w-full">
          {/* Questions List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 lg:h-[calc(100vh-120px)] flex flex-col overflow-hidden min-h-[400px]">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-900">
                <Book className="w-5 h-5" />
                Questions
              </h2>
            </div>
            
            {/* Search Bar */}
            <div className="mb-4 flex-shrink-0">
              <label className="text-xs font-medium mb-2 block text-gray-600">
                <Search className="w-3 h-3 inline mr-1" />
                Search Questions
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, keyword, or #..."
                className="w-full px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-900 border-gray-300 border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="mb-4 flex-shrink-0">
              <label className="text-xs font-medium mb-2 block text-gray-600">
                <Filter className="w-3 h-3 inline mr-1" />
                Filter by Difficulty
              </label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-900 border-gray-300 border focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="space-y-2 overflow-y-auto text-gray-900 flex-1 min-h-0 hide-scrollbar">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q, idx) => {
                  const actualIndex = questions.findIndex(question => question.id === q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestion(actualIndex)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        currentQuestion === actualIndex
                          ? 'bg-blue-50 border-2 border-blue-600'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900">{q.id}. {q.title}</div>
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

          {/* Question Details - Left Side */}
          <div className="lg:col-span-5 lg:h-[calc(100vh-120px)] overflow-y-auto space-y-4 min-w-0 hide-scrollbar">
            {activeQuestion ? (
              <>
            {/* Question Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{activeQuestion.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColor(activeQuestion.difficulty)}`}>
                  {activeQuestion.difficulty}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{activeQuestion.description}</p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <p className="text-sm text-blue-800"><strong>Hint:</strong> {activeQuestion.hint}</p>
              </div>
              
              {/* Contributor Link */}
              {activeQuestion.contributor && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={activeQuestion.contributor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    <User className="w-4 h-4" />
                    View Contributor: {activeQuestion.contributor.name}
                  </a>
                </div>
              )}
            </div>

            {/* Input Data Table */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
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
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Expected Output
              </h3>
              {renderTable(activeQuestion.expectedResult)}
            </div>

            {/* Schema Display */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
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
                <p className="text-center text-gray-500">
                  No questions available for the selected filter.
                </p>
              </div>
            )}
          </div>

          {/* SQL Editor and Results - Right Side */}
          <div className="lg:col-span-5 lg:h-[calc(100vh-120px)] flex flex-col space-y-4 min-w-0 overflow-hidden">
            {activeQuestion ? (
              <>
            {/* SQL Editor */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Your SQL Query</h3>
                <button
                  onClick={executeQuery}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition"
                >
                  <Play className="w-4 h-4" />
                  Run Query
                </button>
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
              <div className="bg-white rounded-lg shadow-sm p-6 flex-1 overflow-y-auto min-h-0 hide-scrollbar">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Query Results</h3>
                </div>

                {isCorrect !== null && (
                  <div className={`flex items-center gap-2 mb-4 p-4 rounded-lg ${
                    isCorrect 
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Correct! Well done! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        <span className="font-semibold">Not quite right. Compare your output with the expected output.</span>
                      </>
                    )}
                  </div>
                )}

                {error && (
                  <div className="border p-4 rounded-lg mb-4 border-red-200 bg-red-50 text-red-800">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {result && (
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-gray-900">Your Output:</h4>
                    {result.values && result.values.length > 0 ? (
                      renderTable(result)
                    ) : (
                      <p className="text-gray-500">Query executed successfully. No rows returned.</p>
                    )}
                  </div>
                )}
              </div>
            )}
            </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <p className="text-center text-gray-500">
                  Select a question to start practicing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SQLPracticePlatform;