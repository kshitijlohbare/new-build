import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePractices } from '@/context/PracticeContext';
import { diagnoseAndFixDatabaseIssues } from '@/scripts/databaseDiagnostic';

interface DiagnosticResult {
  success: boolean;
  message?: string;
  results?: any;
}

/**
 * A utility button component that can be added to any page to help diagnose and fix daily practice issues
 */
export const PracticeDiagnosticButton: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const { user } = useAuth();
  const { practices } = usePractices();

  const runDiagnostic = async () => {
    if (!user?.id || isRunning) {
      return;
    }

    setIsRunning(true);
    setResult(null);

    try {
      const diagResults = await diagnoseAndFixDatabaseIssues(user.id, practices);
      setResult(diagResults);
      console.log('Diagnostic complete:', diagResults);
    } catch (error) {
      console.error('Error running diagnostic:', error);
      setResult({
        success: false,
        message: `Error: ${error}`
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (!user?.id) {
    return null; // Don't show button if not logged in
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={runDiagnostic}
        disabled={isRunning}
        className="px-4 py-2 bg-[#04C4D5] text-white rounded-md hover:bg-[#03a2b1] 
                  font-happy-monkey disabled:opacity-50 text-sm"
      >
        {isRunning ? 'Running Diagnostic...' : 'Fix Daily Practices Issue'}
      </button>

      {result && (
        <div className="mt-4 p-4 max-w-md bg-white rounded-lg shadow border-t-2 
                      border-[#04C4D5] text-sm">
          <h3 className="font-happy-monkey mb-2 text-[#04C4D5]">
            Diagnostic Results
          </h3>
          {result.success ? (
            <>
              <div className="text-green-600 mb-2">✅ Diagnostic completed successfully</div>
              {result.results?.fixesApplied?.length > 0 ? (
                <div>
                  <p className="font-medium">Fixes applied:</p>
                  <ul className="list-disc pl-5">
                    {result.results.fixesApplied.map((fix: string, i: number) => (
                      <li key={i}>{fix}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No issues detected that needed fixing.</p>
              )}
              <p className="mt-2 text-xs text-gray-600">
                Daily practices count: {result.results?.dailyPracticesCount || 0}
              </p>
            </>
          ) : (
            <div className="text-red-500">❌ {result.message || 'Unknown error'}</div>
          )}
          <button
            onClick={() => setResult(null)}
            className="mt-3 px-3 py-1 bg-gray-200 rounded text-gray-800 hover:bg-gray-300 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
