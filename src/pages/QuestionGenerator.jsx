import React, { useState } from 'react';
import { Plus, Trash2, Copy, Download, Home, ArrowLeft, Github } from 'lucide-react';

export default function QuestionGenerator() {
  const navigate = (path) => {
    window.location.href = path;
  };

  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [description, setDescription] = useState('');
  const [hint, setHint] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [contributorLink, setContributorLink] = useState('');

  // Schema
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([{ name: '', type: 'TEXT' }]);
  const [schemaRows, setSchemaRows] = useState([{}]);

  // Expected Result
  const [expectedColumns, setExpectedColumns] = useState(['']);
  const [expectedRows, setExpectedRows] = useState([['']]);

  // Test Cases
  const [includeTestCases, setIncludeTestCases] = useState(false);
  const [testCases, setTestCases] = useState([]);

  const [generatedJson, setGeneratedJson] = useState('');

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'TEXT' }]);
    setSchemaRows(schemaRows.map(row => ({ ...row, [columns.length]: '' })));
  };

  const removeColumn = (index) => {
    const newCols = columns.filter((_, i) => i !== index);
    setColumns(newCols);
    setSchemaRows(schemaRows.map(row => {
      const newRow = { ...row };
      delete newRow[index];
      return newRow;
    }));
  };

  const updateColumn = (index, field, value) => {
    const newCols = [...columns];
    newCols[index][field] = value;
    setColumns(newCols);
  };

  const addSchemaRow = () => {
    setSchemaRows([...schemaRows, {}]);
  };

  const removeSchemaRow = (index) => {
    setSchemaRows(schemaRows.filter((_, i) => i !== index));
  };

  const updateSchemaRow = (rowIndex, colIndex, value) => {
    const newRows = [...schemaRows];
    newRows[rowIndex][colIndex] = value;
    setSchemaRows(newRows);
  };

  const addExpectedColumn = () => {
    setExpectedColumns([...expectedColumns, '']);
    setExpectedRows(expectedRows.map(row => [...row, '']));
  };

  const removeExpectedColumn = (index) => {
    setExpectedColumns(expectedColumns.filter((_, i) => i !== index));
    setExpectedRows(expectedRows.map(row => row.filter((_, i) => i !== index)));
  };

  const updateExpectedColumn = (index, value) => {
    const newCols = [...expectedColumns];
    newCols[index] = value;
    setExpectedColumns(newCols);
  };

  const addExpectedRow = () => {
    setExpectedRows([...expectedRows, new Array(expectedColumns.length).fill('')]);
  };

  const removeExpectedRow = (index) => {
    setExpectedRows(expectedRows.filter((_, i) => i !== index));
  };

  const updateExpectedRow = (rowIndex, colIndex, value) => {
    const newRows = [...expectedRows];
    newRows[rowIndex][colIndex] = value;
    setExpectedRows(newRows);
  };

  // Test Case Functions
  const addTestCase = () => {
    setTestCases([...testCases, {
      name: '',
      visible: true,
      tableName: '',
      columns: [{ name: '', type: 'TEXT' }],
      schemaRows: [{}],
      expectedColumns: [''],
      expectedRows: [['']]
    }]);
  };

  const removeTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const updateTestCase = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const addTestCaseColumn = (tcIdx) => {
    const newTestCases = [...testCases];
    newTestCases[tcIdx].columns.push({ name: '', type: 'TEXT' });
    newTestCases[tcIdx].schemaRows = newTestCases[tcIdx].schemaRows.map(row => ({
      ...row,
      [newTestCases[tcIdx].columns.length - 1]: ''
    }));
    setTestCases(newTestCases);
  };

  const removeTestCaseColumn = (tcIdx, colIdx) => {
    const newTestCases = [...testCases];
    newTestCases[tcIdx].columns = newTestCases[tcIdx].columns.filter((_, i) => i !== colIdx);
    setTestCases(newTestCases);
  };

  const updateTestCaseColumn = (tcIdx, colIdx, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[tcIdx].columns[colIdx][field] = value;
    setTestCases(newTestCases);
  };

  const addTestCaseSchemaRow = (tcIdx) => {
    const newTestCases = [...testCases];
    newTestCases[tcIdx].schemaRows.push({});
    setTestCases(newTestCases);
  };

  const removeTestCaseSchemaRow = (tcIdx, rowIdx) => {
    const newTestCases = [...testCases];
    newTestCases[tcIdx].schemaRows = newTestCases[tcIdx].schemaRows.filter((_, i) => i !== rowIdx);
    setTestCases(newTestCases);
  };

  const updateTestCaseSchemaRow = (tcIdx, rowIdx, colIdx, value) => {
    const newTestCases = [...testCases];
    newTestCases[tcIdx].schemaRows[rowIdx][colIdx] = value;
    setTestCases(newTestCases);
  };

  const addTestCaseExpectedColumn = (tcIdx) => {
    const newTestCases = [...testCases];
    newTestCases[tcIdx].expectedColumns.push('');
    newTestCases[tcIdx].expectedRows = newTestCases[tcIdx].expectedRows.map(row => [...row, '']);
    setTestCases(newTestCases);
  };

  const removeTestCaseExpectedColumn = (tcIdx, colIdx) => {
    const newTestCases = [...testCases];
    newTestCases[tcIdx].expectedColumns = newTestCases[tcIdx].expectedColumns.filter((_, i) => i !== colIdx);
    newTestCases[tcIdx].expectedRows = newTestCases[tcIdx].expectedRows.map(row => 
      row.filter((_, i) => i !== colIdx)
    );
    setTestCases(newTestCases);
  };

  const updateTestCaseExpectedColumn = (tcIdx, colIdx, value) => {
    const newTestCases = [...testCases];
    newTestCases[tcIdx].expectedColumns[colIdx] = value;
    setTestCases(newTestCases);
  };

  const addTestCaseExpectedRow = (tcIdx) => {
    const newTestCases = [...testCases];
    newTestCases[tcIdx].expectedRows.push(new Array(newTestCases[tcIdx].expectedColumns.length).fill(''));
    setTestCases(newTestCases);
  };

  const removeTestCaseExpectedRow = (tcIdx, rowIdx) => {
    const newTestCases = [...testCases];
    newTestCases[tcIdx].expectedRows = newTestCases[tcIdx].expectedRows.filter((_, i) => i !== rowIdx);
    setTestCases(newTestCases);
  };

  const updateTestCaseExpectedRow = (tcIdx, rowIdx, colIdx, value) => {
    const newTestCases = [...testCases];
    newTestCases[tcIdx].expectedRows[rowIdx][colIdx] = value;
    setTestCases(newTestCases);
  };

  const generateSchema = (tName, cols, rows) => {
    if (!tName || cols.length === 0 || cols[0].name === '') return '';
    
    const colDefs = cols.map(c => `${c.name} ${c.type}`).join(', ');
    let schema = `CREATE TABLE ${tName} (${colDefs});`;
    
    rows.forEach((row) => {
      const values = cols.map((col, colIdx) => {
        const val = row[colIdx] || '';
        const colType = col.type;
        if (colType === 'INTEGER') {
          return val || '0';
        } else {
          return `'${val}'`;
        }
      }).join(', ');
      schema += `\nINSERT INTO ${tName} VALUES (${values});`;
    });
    
    return schema;
  };

  const parseValue = (val, colType) => {
    if (val === '') return colType === 'INTEGER' ? 0 : '';
    if (colType === 'INTEGER') {
      const num = parseInt(val);
      return isNaN(num) ? 0 : num;
    }
    return val;
  };

  const generateJson = () => {
    const schema = generateSchema(tableName, columns, schemaRows);
    
    const expectedResult = {
      columns: expectedColumns.filter(c => c !== ''),
      values: expectedRows.map(row => 
        row.map((val, idx) => {
          const colName = expectedColumns[idx];
          const schemaCol = columns.find(c => c.name === colName);
          const colType = schemaCol ? schemaCol.type : 'TEXT';
          return parseValue(val, colType);
        })
      ).filter(row => row.some(v => v !== '' && v !== 0))
    };

    const jsonObj = {
      title,
      difficulty,
      description,
      schema,
      expectedResult,
      hint,
      contributor: {
        name: contributorName,
        link: contributorLink
      }
    };

    if (includeTestCases && testCases.length > 0) {
      jsonObj.testCases = testCases.map(tc => ({
        name: tc.name,
        visible: tc.visible,
        schema: generateSchema(tc.tableName, tc.columns, tc.schemaRows),
        expectedResult: {
          columns: tc.expectedColumns.filter(c => c !== ''),
          values: tc.expectedRows.map(row => 
            row.map((val, idx) => {
              const colName = tc.expectedColumns[idx];
              const schemaCol = tc.columns.find(c => c.name === colName);
              const colType = schemaCol ? schemaCol.type : 'TEXT';
              return parseValue(val, colType);
            })
          ).filter(row => row.some(v => v !== '' && v !== 0))
        }
      }));
    }

    setGeneratedJson(JSON.stringify(jsonObj, null, 2));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedJson);
    alert('JSON copied to clipboard!');
  };

  const downloadJson = () => {
    const blob = new Blob([generatedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_question.json`;
    a.click();
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="w-full px-3 sm:px-4 md:px-6 py-3">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-gray-800">SQL Question Generator</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Navigate to home')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-xs"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => window.open(`https://github.com`, "_blank")}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition text-xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Contribute</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => alert('Navigate to practice')}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm text-gray-700 w-full"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Practice
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/practice')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm text-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Practice
              </button>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">SQL Question Generator</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-sm"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={() => window.open(`https://github.com`, "_blank")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition text-sm"
              >
                <Github className="w-4 h-4" />
                Contribute
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          {/* Basic Details */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <input
                type="text"
                placeholder="Question Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full mt-3 md:mt-4 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            />
            <input
              type="text"
              placeholder="Hint"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full mt-3 md:mt-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
              <input
                type="text"
                placeholder="Contributor Name"
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
              <input
                type="text"
                placeholder="Contributor LinkedIn URL"
                value={contributorLink}
                onChange={(e) => setContributorLink(e.target.value)}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Schema Section */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Schema Definition</h2>
            <input
              type="text"
              placeholder="Table Name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            />
            
            <div className="mb-4">
              <h3 className="font-medium mb-2 text-gray-700">Columns</h3>
              {columns.map((col, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Column Name"
                    value={col.name}
                    onChange={(e) => updateColumn(idx, 'name', e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm md:text-base"
                  />
                  <select
                    value={col.type}
                    onChange={(e) => updateColumn(idx, 'type', e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm md:text-base"
                  >
                    <option>TEXT</option>
                    <option>INTEGER</option>
                  </select>
                  <button
                    onClick={() => removeColumn(idx)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={addColumn}
                className="bg-blue-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 text-sm md:text-base"
              >
                <Plus size={16} /> Add Column
              </button>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-gray-700">Data Rows</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      {columns.map((col, idx) => (
                        <th key={idx} className="border-b border-gray-200 p-2 md:p-3 text-left font-semibold text-gray-700 text-xs md:text-sm whitespace-nowrap">{col.name || `Col ${idx + 1}`}</th>
                      ))}
                      <th className="border-b border-gray-200 p-2 md:p-3 text-left font-semibold text-gray-700 text-xs md:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schemaRows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-gray-50">
                        {columns.map((col, colIdx) => (
                          <td key={colIdx} className="border-b border-gray-200 p-1 md:p-2">
                            <input
                              type="text"
                              value={row[colIdx] || ''}
                              onChange={(e) => updateSchemaRow(rowIdx, colIdx, e.target.value)}
                              className="w-full p-1.5 md:p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-xs md:text-sm"
                            />
                          </td>
                        ))}
                        <td className="border-b border-gray-200 p-1 md:p-2 text-center">
                          <button
                            onClick={() => removeSchemaRow(rowIdx)}
                            className="bg-red-500 text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg hover:bg-red-600"
                          >
                            <Trash2 size={14} className="md:w-4 md:h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={addSchemaRow}
                className="bg-green-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 mt-2 text-sm md:text-base"
              >
                <Plus size={16} /> Add Row
              </button>
            </div>
          </div>

          {/* Expected Result */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">Expected Result</h2>
            <div className="mb-4">
              <h3 className="font-medium mb-2 text-gray-700">Output Columns</h3>
              {expectedColumns.map((col, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Column Name"
                    value={col}
                    onChange={(e) => updateExpectedColumn(idx, e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm md:text-base"
                  />
                  <button
                    onClick={() => removeExpectedColumn(idx)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={addExpectedColumn}
                className="bg-blue-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 text-sm md:text-base"
              >
                <Plus size={16} /> Add Column
              </button>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-gray-700">Output Rows</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      {expectedColumns.map((col, idx) => (
                        <th key={idx} className="border-b border-gray-200 p-2 md:p-3 text-left font-semibold text-gray-700 text-xs md:text-sm whitespace-nowrap">{col || `Col ${idx + 1}`}</th>
                      ))}
                      <th className="border-b border-gray-200 p-2 md:p-3 text-left font-semibold text-gray-700 text-xs md:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expectedRows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-gray-50">
                        {expectedColumns.map((col, colIdx) => (
                          <td key={colIdx} className="border-b border-gray-200 p-1 md:p-2">
                            <input
                              type="text"
                              value={row[colIdx] || ''}
                              onChange={(e) => updateExpectedRow(rowIdx, colIdx, e.target.value)}
                              className="w-full p-1.5 md:p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-xs md:text-sm"
                            />
                          </td>
                        ))}
                        <td className="border-b border-gray-200 p-1 md:p-2 text-center">
                          <button
                            onClick={() => removeExpectedRow(rowIdx)}
                            className="bg-red-500 text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg hover:bg-red-600"
                          >
                            <Trash2 size={14} className="md:w-4 md:h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={addExpectedRow}
                className="bg-green-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 mt-2 text-sm md:text-base"
              >
                <Plus size={16} /> Add Row
              </button>
            </div>
          </div>

          {/* Test Cases Toggle */}
          <div className="mb-6 md:mb-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTestCases}
                onChange={(e) => setIncludeTestCases(e.target.checked)}
                className="w-4 h-4 md:w-5 md:h-5"
              />
              <span className="text-base md:text-lg font-semibold text-gray-800">Include Test Cases</span>
            </label>
          </div>

          {/* Test Cases */}
          {includeTestCases && (
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Test Cases</h2>
                <button
                  onClick={addTestCase}
                  className="bg-purple-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center gap-2 text-sm md:text-base w-full sm:w-auto justify-center"
                >
                  <Plus size={16} /> Add Test Case
                </button>
              </div>

              {testCases.map((tc, tcIdx) => (
                <div key={tcIdx} className="border-2 border-purple-300 rounded-lg p-4 sm:p-6 mb-4 md:mb-6 bg-purple-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Test Case Name"
                      value={tc.name}
                      onChange={(e) => updateTestCase(tcIdx, 'name', e.target.value)}
                      className="border border-gray-300 p-2 rounded-lg flex-1 w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 text-sm md:text-base"
                    />
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={tc.visible}
                          onChange={(e) => updateTestCase(tcIdx, 'visible', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700 text-sm">Visible</span>
                      </label>
                      <button
                        onClick={() => removeTestCase(tcIdx)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Test Case Schema */}
                  <div className="bg-white rounded-lg p-3 sm:p-4 mb-4">
                    <h3 className="font-semibold mb-3 text-gray-700 text-sm md:text-base">Schema Definition</h3>
                    <input
                      type="text"
                      placeholder="Table Name"
                      value={tc.tableName}
                      onChange={(e) => updateTestCase(tcIdx, 'tableName', e.target.value)}
                      className="border border-gray-300 p-2 rounded-lg w-full mb-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 text-sm md:text-base"
                    />

                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-xs md:text-sm text-gray-700">Columns</h4>
                      {tc.columns.map((col, colIdx) => (
                        <div key={colIdx} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Column Name"
                            value={col.name}
                            onChange={(e) => updateTestCaseColumn(tcIdx, colIdx, 'name', e.target.value)}
                            className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 text-xs md:text-sm"
                          />
                          <select
                            value={col.type}
                            onChange={(e) => updateTestCaseColumn(tcIdx, colIdx, 'type', e.target.value)}
                            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 text-xs md:text-sm"
                          >
                            <option>TEXT</option>
                            <option>INTEGER</option>
                          </select>
                          <button
                            onClick={() => removeTestCaseColumn(tcIdx, colIdx)}
                            className="bg-red-500 text-white px-2 md:px-3 py-2 rounded-lg hover:bg-red-600 flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addTestCaseColumn(tcIdx)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 text-xs md:text-sm"
                      >
                        <Plus size={14} /> Add Column
                      </button>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-xs md:text-sm text-gray-700">Data Rows</h4>
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full border-collapse min-w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              {tc.columns.map((col, idx) => (
                                <th key={idx} className="border-b border-gray-200 p-2 text-xs text-left font-semibold text-gray-700 whitespace-nowrap">{col.name || `Col ${idx + 1}`}</th>
                              ))}
                              <th className="border-b border-gray-200 p-2 text-xs text-left font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tc.schemaRows.map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-gray-50">
                                {tc.columns.map((col, colIdx) => (
                                  <td key={colIdx} className="border-b border-gray-200 p-1">
                                    <input
                                      type="text"
                                      value={row[colIdx] || ''}
                                      onChange={(e) => updateTestCaseSchemaRow(tcIdx, rowIdx, colIdx, e.target.value)}
                                      className="w-full p-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                                    />
                                  </td>
                                ))}
                                <td className="border-b border-gray-200 p-1 text-center">
                                  <button
                                    onClick={() => removeTestCaseSchemaRow(tcIdx, rowIdx)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button
                        onClick={() => addTestCaseSchemaRow(tcIdx)}
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 mt-2 text-xs md:text-sm"
                      >
                        <Plus size={14} /> Add Row
                      </button>
                    </div>
                  </div>

                  {/* Test Case Expected Result */}
                  <div className="bg-white rounded-lg p-3 sm:p-4">
                    <h3 className="font-semibold mb-3 text-gray-700 text-sm md:text-base">Expected Result</h3>
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-xs md:text-sm text-gray-700">Output Columns</h4>
                      {tc.expectedColumns.map((col, colIdx) => (
                        <div key={colIdx} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Column Name"
                            value={col}
                            onChange={(e) => updateTestCaseExpectedColumn(tcIdx, colIdx, e.target.value)}
                            className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 text-xs md:text-sm"
                          />
                          <button
                            onClick={() => removeTestCaseExpectedColumn(tcIdx, colIdx)}
                            className="bg-red-500 text-white px-2 md:px-3 py-2 rounded-lg hover:bg-red-600 flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addTestCaseExpectedColumn(tcIdx)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 text-xs md:text-sm"
                      >
                        <Plus size={14} /> Add Column
                      </button>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 text-xs md:text-sm text-gray-700">Output Rows</h4>
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full border-collapse min-w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              {tc.expectedColumns.map((col, idx) => (
                                <th key={idx} className="border-b border-gray-200 p-2 text-xs text-left font-semibold text-gray-700 whitespace-nowrap">{col || `Col ${idx + 1}`}</th>
                              ))}
                              <th className="border-b border-gray-200 p-2 text-xs text-left font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tc.expectedRows.map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-gray-50">
                                {tc.expectedColumns.map((col, colIdx) => (
                                  <td key={colIdx} className="border-b border-gray-200 p-1">
                                    <input
                                      type="text"
                                      value={row[colIdx] || ''}
                                      onChange={(e) => updateTestCaseExpectedRow(tcIdx, rowIdx, colIdx, e.target.value)}
                                      className="w-full p-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                                    />
                                  </td>
                                ))}
                                <td className="border-b border-gray-200 p-1 text-center">
                                  <button
                                    onClick={() => removeTestCaseExpectedRow(tcIdx, rowIdx)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button
                        onClick={() => addTestCaseExpectedRow(tcIdx)}
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 mt-2 text-xs md:text-sm"
                      >
                        <Plus size={14} /> Add Row
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generate Button */}
          <div className="flex gap-4">
            <button
              onClick={generateJson}
              className="bg-indigo-600 text-white px-6 md:px-8 py-3 rounded-lg hover:bg-indigo-700 text-base md:text-lg font-semibold shadow-lg w-full sm:w-auto"
            >
              Generate JSON
            </button>
          </div>

          {/* Generated JSON */}
          {generatedJson && (
            <div className="mt-6 md:mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Generated JSON</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={copyToClipboard}
                    className="bg-gray-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 text-sm md:text-base flex-1 sm:flex-initial"
                  >
                    <Copy size={16} /> Copy
                  </button>
                  <button
                    onClick={downloadJson}
                    className="bg-gray-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 text-sm md:text-base flex-1 sm:flex-initial"
                  >
                    <Download size={16} /> Download
                  </button>
                </div>
              </div>
              <pre className="bg-gray-900 text-green-400 p-3 md:p-4 rounded-lg overflow-x-auto text-xs md:text-sm max-h-96 overflow-y-auto">
                {generatedJson}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}