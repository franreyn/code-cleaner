import "./styles/styles.css";
import { useState, useMemo, useEffect, useCallback } from "react";
import CodeEditor from "./CodeEditor"; // Assuming you have this component
import UploadModal from "./components/UploadModal";
import LoadingBar from "./components/LoadingBar";
import FileTree from "./components/FileTree";
import ToastContainer from "./components/ToastContainer";
import FileErrorGroup from "./components/FileErrorGroup";
import { useToasts } from "./hooks/useToasts.js";
import { useFileManager } from "./hooks/useFileManager.js";
import { useScanner } from "./hooks/useScanner.js";

const imageRegex = /\.(jpe?g|png|gif|svg)$/i;

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("editor"); // 'editor' or 'errors'
  const [jumpToLine, setJumpToLine] = useState(null); // For jumping to a line from the error report
  const [pendingJump, setPendingJump] = useState(null); // Holds a jump request until content is loaded  
  const [isSaving, setIsSaving] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const { toasts, addToast, removeToast } = useToasts();
	const [globalErrorIndex, setGlobalErrorIndex] = useState(0);
  const [isIndexPendingUpdate, setIsIndexPendingUpdate] = useState(false); // Flag to show placeholder in counter
  const [lastSelectedErrorKey, setLastSelectedErrorKey] = useState(null); // Storing the error key to remember which error was selected before the save

  const {
    files,
    setFiles,
    selectedPath,
    setSelectedPath,
    currentCode,
    selectedFile,
    hasUnsavedChanges,
    handleEditorChange,
    refreshList,
    handleFiles,
    handleSaveAll,
  } = useFileManager(addToast);

  const { scanReport, setScanReport, isScanning, scan, rescanFile } = useScanner(addToast);

  // This derived state is now reliable. It safely checks for the existence of
  // scanReport and its properties before trying to access them.
  const issuesDetected = useMemo(() => scanReport?.summary?.issues > 0, [scanReport]);

  const allErrors = useMemo(() => {
    if (!scanReport?.byFile) return [];
    
    const errors = Object.entries(scanReport.byFile).flatMap(([filePath, errors]) =>
      errors.map(error => ({ ...error, filePath }))
    );
    
    // Sort the flat list of all errors
    return errors.sort((a, b) => a.filePath.localeCompare(b.filePath) || (a.line || 0) - (b.line || 0));
    
  }, [scanReport]);

  const globalErrorMap = useMemo(() => {
    const map = new Map();
    // Use the already sorted allErrors array
    allErrors.forEach((error, index) => {
      // Create a unique key: filePath::line::message
      // Using '::' as a delimiter ensures the components are distinct
      const key = `${error.filePath}::${error.line || 0}::${error.message}`;
      map.set(key, index);
    });
    return map;
  }, [allErrors]);

  // Separate code errors from image errors for distinct rendering in the report view.
  const [codeErrorEntries, imageErrorEntries] = useMemo(() => {
    if (!scanReport?.byFile) return [[], []];

    const allFileEntries = Object.entries(scanReport.byFile);
    const codeErrors = [];
    const imageErrors = [];

    for (const [filePath, errors] of allFileEntries) {
      // An error is considered an image error if its file path matches the image extension regex.
      imageRegex.test(filePath)
        ? imageErrors.push([filePath, errors])
        : codeErrors.push([filePath, errors]);
    }
    return [codeErrors, imageErrors];
  }, [scanReport]);

  // When the list of errors changes (i.e., after a rescan), make sure the index is still valid.
  useEffect(() => {
    // Only proceed if a fix happened and an index update is pending
    if (!isIndexPendingUpdate) {
        // Standard index validation when not in a pending state
        if (globalErrorIndex >= allErrors.length) {
            setGlobalErrorIndex(Math.max(0, allErrors.length - 1));
        }
        return;
    }
    
    // Logic when isIndexPendingUpdate is TRUE (i.e., after a save/rescan)
    let finalIndexToSet = -1;

    if (lastSelectedErrorKey) {
        const newIndex = globalErrorMap.get(lastSelectedErrorKey);
        
        // Extract the file path from the stored key
        const fixedFilePath = lastSelectedErrorKey.split('::')[0];
        const fileNowHasErrors = !!scanReport?.byFile?.[fixedFilePath];

        if (newIndex !== undefined) {
            // CASE A: The exact error we were on still exists.
            // Set the new, correct index, and clear the pending flag.
            finalIndexToSet = newIndex;
            setIsIndexPendingUpdate(false); 
        } else {
            // CASE B: The exact error we were on was FIXED.

            if (!fileNowHasErrors) {
                // Scenario 1: ALL errors in the file were fixed. 
                // The new 'next' error is the first one in the remaining list (index 0).
                finalIndexToSet = 0;
            } else {
                // Scenario 2: Only the selected error was fixed, but others remain in the same file.
                // Use the original logic to jump to the error that slid into the vacated slot.
                // This correctly handles jumping to the next error in the *same* file.
                finalIndexToSet = Math.max(0, Math.min(globalErrorIndex, allErrors.length - 1));
            }
            
            // The flag remains TRUE to show the placeholder (--/N).
        }
    }
    
    // Set the index only if we found a valid target
    if (finalIndexToSet !== -1 && globalErrorIndex !== finalIndexToSet) {
        setGlobalErrorIndex(finalIndexToSet);
    }
      
  }, [allErrors, globalErrorIndex, isIndexPendingUpdate, lastSelectedErrorKey, globalErrorMap, scanReport]); 
  // NOTE: Added scanReport to dependencies to access scanReport.byFile inside the hook.

  const errorsForSelectedFile = useMemo(() => {
    if (!scanReport?.byFile || !selectedPath || !scanReport.byFile[selectedPath]) {
      return [];
    }
    const errors = scanReport.byFile[selectedPath];
    // Sort errors by line number
    return errors.slice().sort((errorA, errorB) => {
      return (errorA.line || 0) - (errorB.line || 0); // Ensure that files without line numbers are still handled
    });
  }, [scanReport, selectedPath]);

  // Initial load: refresh the list to show any existing files.
  // This will run once when the component mount
  useEffect(() => {
    refreshList();
  }, []);

  // This effect triggers a jump-to-line *after* ensuring the file's content is loaded.
  // This prevents a race condition where the jump happens before the new file is displayed.
  useEffect(() => {
    if (pendingJump && selectedFile?.path === pendingJump.path) { 
      // Check the master `files` array to see if the content is populated.
      const fileInState = files.find(file => file.path === pendingJump.path);
      if (fileInState?.content != null) {
        // Content is loaded, so we can now trigger the actual jump.
        setJumpToLine({ ...pendingJump, key: Date.now() });
        setPendingJump(null); // Clear the pending request.
      }
    }
  }, [files, pendingJump, selectedFile]);

  const handleScan = () => {
    setViewMode("errors"); // Switch to errors view to show progress/results
    scan();
  };

  // Handler that combines the index adjustment and navigation when the placeholder is active
  const handleNavButtonClick = (direction) => {
    if (isIndexPendingUpdate) {
      // If index is pending, the current globalErrorIndex is already pointing 
      // to the error that slid into the fixed one's spot.
      // We resolve the placeholder state by navigating to that index.
      // The direction only matters if the user clicks 'Prev' when index is 0.
      
      let targetIndex = globalErrorIndex;
      
      if (targetIndex === 0 && direction === -1) {
          // If already at the first error, prevent navigation
          return;
      }
      
      // Resolve the index by calling navigateToError(current index)
      // This will set isIndexPendingUpdate to false.
      navigateToError(targetIndex); 
      
    } else {
      // Standard navigation when the index is NOT pending
      navigateToError(globalErrorIndex + direction);
    }
  };

  async function selectByPath(path, line = null) {
    setSelectedPath(path);
		setViewMode("editor");
    if (line) {
      // Don't jump immediately. Set a pending request that the useEffect will handle once content is loaded.
      setPendingJump({ path, line });
    }
  }

  const navigateToError = (index) => {
    if (!allErrors || index < 0 || index >= allErrors.length) return;
    const error = allErrors[index];
      setGlobalErrorIndex(index);
      
      // Update the error key we are currently on
      const key = `${error.filePath}::${error.line || 0}::${error.message}`;
      setLastSelectedErrorKey(key); 
      
      // If the user navigates, the index is no longer pending/stale
      setIsIndexPendingUpdate(false); 
      
      // selectByPath will switch to the correct file and trigger the jump-to-line
      selectByPath(error.filePath, error.line);
  }

  async function handleSaveAndRescan() {
    if (!selectedPath || isSaving || isScanning) return;
    setIsSaving(true); // Use the same saving flag to disable both buttons 

    try {
      // 1. Save the file first
      const saveResponse = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedPath, content: currentCode }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to save: ${saveResponse.statusText}`);
      }

      // Update local state, reset unsaved changes flag, and show toast
      setFiles(prevFiles => prevFiles.map(file => (file.path === selectedPath ? { ...file, content: currentCode, hasUnsavedChanges: false } : file)));

      // 2. Now, rescan just that file using the hook
      const scanData = await rescanFile(selectedPath);
      if (!scanData) { // Error was already handled in the hook
        return;
      }
      
      if (scanData.ok) {
        // 3. Merge the new partial report into the existing full report
        // We read the previous report from the state variable in the render scope
        // to avoid putting side effects (addToast) inside the setScanReport updater,
        // which can cause double-invocations in React's Strict Mode.
        const prevReport = scanReport;

        if (!prevReport || prevReport.error) {
          addToast('Run a full scan first to establish a baseline.', 'warn');
          setScanReport(scanData); // Show partial report if no baseline exists
        } else {
          const newByFile = { ...prevReport.byFile };
          const fileHasNewErrors = scanData.byFile && scanData.byFile[selectedPath] && scanData.byFile[selectedPath].length > 0;

          if (fileHasNewErrors) {
            newByFile[selectedPath] = scanData.byFile[selectedPath];
          } else {
            delete newByFile[selectedPath]; // File is now clean, remove from error list
          }

          // Recalculate summary and provide feedback
          const oldErrorCount = prevReport.byFile[selectedPath]?.length || 0;
          const newErrorCount = newByFile[selectedPath]?.length || 0;
          const issuesFixed = oldErrorCount - newErrorCount;
          
          if (newErrorCount === 0 && oldErrorCount > 0) { 
            addToast(`All ${oldErrorCount} issue(s) fixed in this file! File saved.`, 'success');
          } else if (issuesFixed > 0) {
            addToast(`${issuesFixed} issue(s) fixed. ${newErrorCount} remaining. File saved.`, 'warn');
          } else if (issuesFixed < 0) {
            addToast(`File saved, but ${-issuesFixed} new issue(s) were introduced. ${newErrorCount} total remaining.`, 'error');
          } else if (newErrorCount > 0) {
            addToast(`File saved, ${newErrorCount} error(s) still remaining.`, 'warn');
          } else {
            addToast('File saved. No issues found.', 'info');
          }
          
          const totalIssues = Object.values(newByFile).reduce((sum, errors) => sum + (errors?.length || 0), 0);
          const newSummary = { ...prevReport.summary, filesWithIssues: Object.keys(newByFile).length, issues: totalIssues };
          
          setScanReport({ ...prevReport, summary: newSummary, byFile: newByFile });

          // Signal that the global index is now stale/pending
          // It's stale because one or more errors might have been removed.
          if (issuesFixed > 0) { 
            setIsIndexPendingUpdate(true);
          } else {
             // If errors were introduced or none were fixed, the index might still be okay, 
             // but we still want to clear the pending flag if it was previously set.
             setIsIndexPendingUpdate(false);
          }
        }
      } else {
        throw new Error(scanData.error || 'An unknown error occurred during the rescan.');
      }
    } catch (err) {
      console.error('Error during save and rescan:', err);
      addToast(`Error: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  }

  const handleSaveAllClick = async () => {
    setIsSaving(true);
    await handleSaveAll();
    setIsSaving(false);
  };

  const handleClean = async () => {
    setIsCleaning(true);
    addToast('Cleaning files...', 'info');
    try {
      const response = await fetch('/api/clean', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred during cleaning.');
      }

      addToast(data.message, 'success');
    } catch (err) {
      console.error('Cleaning failed:', err);
      addToast(`Cleaning failed: ${err.message}`, 'error');
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="app-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* Top Bar 🔝 */}
      <header className="top-bar">
        <h1>Code Cleaner</h1>
        <div className="actions">
          <button onClick={() => setShowModal(true)}>Upload Folder</button>
          <button onClick={() => setViewMode(prev => prev === 'editor' ? 'errors' : 'editor')}>
            {viewMode === 'editor' ? 'View Errors' : 'View Editor'}
          </button>
          <button onClick={handleScan} disabled={!files.length || isScanning || isCleaning}>
            {isScanning ? "Scanning..." : "Scan Files"}
          </button>
          <button onClick={handleSaveAllClick} disabled={!hasUnsavedChanges || isSaving || isScanning || isCleaning}>
            Save All
          </button>
          <button onClick={handleClean} disabled={!files.length || isCleaning || isScanning}>
            {isCleaning ? 'Cleaning...' : 'Clean Code'}
          </button>
        </div>
      </header>

      <LoadingBar isLoading={isScanning || isCleaning || isSaving} />

      <div className="main-content">
        {/* Sidebar Panel 📁 */}
        <aside className="sidebar-panel">
          {scanReport && typeof scanReport.summary?.issues === 'number' && (
            <div
              className="sidebar-scan-summary"
              onClick={() => issuesDetected && setViewMode('errors')}
              title={issuesDetected ? "Click to view error report" : "No issues found"}
              style={{ cursor: issuesDetected ? 'pointer' : 'default' }}
            >
              <strong>Total Issues: {scanReport.summary.issues}</strong>
            </div>
          )}
          <FileTree files={files} onFileSelect={selectByPath} selectedPath={selectedPath} />
        </aside>

        {/* Main Panel 📝 */}
        {viewMode === 'editor' ? (
          <main className="editor-panel">
            <div className="editor-title-bar">
              <h2>{selectedFile ? selectedFile.path : "No file selected"}</h2>
              {errorsForSelectedFile.length > 0 && (
                <span className="error-count-badge">
                  {errorsForSelectedFile.length} {errorsForSelectedFile.length === 1 ? 'Error' : 'Errors'}
                </span>
              )}
            </div>
            {errorsForSelectedFile.length > 0 && (
              <div className="editor-error-list">
                <ul>
                  {errorsForSelectedFile.map((error, index) => {
                    
                    // Create the unique key for the current local error
                    const key = `${selectedPath}::${error.line || 0}::${error.message}`;
                    
                    // Use the map for O(1) lookup
                    const globalIndex = globalErrorMap.get(key);

                    // Ensure the error was found in the global list
                    if (globalIndex === undefined) return null; 

                    return (
                      <li
                        key={index}
                        className={error.line ? "clickable" : ""}
                        onClick={
                          error.line
                            ? () => navigateToError(globalIndex)
                            : undefined
                        }
                        title={
                          error.line ? `Click to jump to line ${error.line}` : ""
                        }
                      >
                        {error.line ? `Line ${error.line}: ` : ""}{" "}
                        {error.message}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {/* Only render CodeEditor if selectedFile exists AND is a readable type */}
            {selectedFile && /\.(html?|css|js|txt)$/i.test(selectedFile.path) ? (
              <>
                <CodeEditor code={currentCode} onChange={handleEditorChange} filePath={selectedFile?.path} jumpToLine={jumpToLine} errors={errorsForSelectedFile} />
                <div className="editor-actions">
                  <button onClick={handleSaveAndRescan} disabled={isSaving || isScanning || isCleaning}>
                    {isSaving ? 'Processing...' : 'Save & Check for Fixes'}
                  </button>
                  {allErrors.length > 0 && (
                    <div className="error-navigation">
                      <button 
                        onClick={() => handleNavButtonClick(-1)} 
                        disabled={globalErrorIndex <= 0 || isSaving || isScanning || isCleaning}
                      >
                        Previous Error
                      </button>
                      <span>
                        {isIndexPendingUpdate ? '--' : globalErrorIndex + 1} / {allErrors.length}
                      </span>
                      <button 
                        onClick={() => handleNavButtonClick(1)} 
                        disabled={globalErrorIndex >= allErrors.length || isSaving || isScanning || isCleaning}
                      >
                        Next Error
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Message for non-readable files or no selection.
              <p className="scan-text">
                {selectedFile ? "This file type isn't previewable. Choose an HTML/CSS/JS/TXT file." : "No file selected"}
              </p>
            )}
          </main>
        ) : (
          <main className="editor-panel">
            <h2>Scan Report</h2>
            <div className="codemirror-wrapper">
              <div className="error-report">
                {isScanning ? (
                  <p className="scan-text">
                    Scanning files, please wait...
                  </p>
                ) : scanReport === null ? (
                  <p className="scan-text">
                    No scan has been performed yet. Click 'Scan Files' to begin.
                  </p>
                ) : scanReport.error ? (
                  <div className="structured-report">
                    <h3>Scan Error</h3>
                    <p className="scan-text scan-error">{scanReport.error}</p>
                    <p className="scan-text">
                      Check the browser's developer console for more details.
                    </p>
                  </div>
                ) : scanReport.summary.issues === 0 ? (
                  <p className="scan-text">
                    No errors found! ✨
                  </p>
                ) : (
                  <div className="structured-report">
                    <h3>Scan Summary</h3>
                    <ul>
                      <li>Files Scanned: {scanReport.summary.filesScanned}</li>
                      <li>Files with Issues: {scanReport.summary.filesWithIssues}</li>
                      <li>Total Issues: {scanReport.summary.issues}</li>
                    </ul>
                    <hr />
                    {codeErrorEntries.length > 0 && (
											<FileErrorGroup 
												title="Code Issues"
												entries={codeErrorEntries}
												isClickable={true}
												onPathClick={selectByPath}
											/>
										)}

										{imageErrorEntries.length > 0 && (
											<FileErrorGroup 
												title="Image Size Issues"
												entries={imageErrorEntries}
												isClickable={false}
											/>
										)}
                  </div>
                )}
              </div>
            </div>
          </main>
        )}
      </div>

      {showModal && (
        <UploadModal
          onClose={async (uploadedFiles) => {
            setShowModal(false);
            if (uploadedFiles && uploadedFiles.length > 0) {
              // The handleFiles function is now part of the useFileManager hook
              await handleFiles(uploadedFiles);

              // Clean uploaded files right away on the server
              await handleClean();
            } else {
              // Otherwise (modal closed, or no files selected), refresh from server.
              await refreshList();
            }
          }}
        />
      )}
    </div>
  );
}