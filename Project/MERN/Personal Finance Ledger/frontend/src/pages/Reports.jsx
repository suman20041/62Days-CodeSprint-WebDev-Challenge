import { useRef, useState } from 'react';
import client from '../api/client.js';

export default function Reports() {
  const fileInput = useRef(null);
  const [importResult, setImportResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const exportCsv = async () => {
    const res = await client.get('/transactions/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importCsv = async () => {
    const file = fileInput.current.files?.[0];
    if (!file) return;
    setBusy(true);
    setImportResult(null);
    try {
      const csv = await file.text();
      const res = await client.post('/transactions/import/csv', { csv });
      setImportResult(res.data);
    } catch (err) {
      setImportResult({ createdCount: 0, errors: [err.response?.data?.message || 'Import failed'] });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Export</h2>
        <p className="text-dim">
          Download every transaction (one row per ledger entry) as CSV. Each row includes the shared
          transactionId so a re-import can reconstruct balanced groups.
        </p>
        <button className="btn" onClick={exportCsv}>Export transactions.csv</button>
      </div>

      <div className="card">
        <h2>Import</h2>
        <p className="text-dim">
          Upload a CSV with columns: date, memo, tags, account, category, direction, amount, transactionId.
          Rows sharing a transactionId (or date+memo, if blank) are grouped into one transaction and must balance.
          Accounts are matched by name and must already exist.
        </p>
        <input type="file" accept=".csv" ref={fileInput} />
        <button className="btn mt-1" onClick={importCsv} disabled={busy}>
          {busy ? 'Importing...' : 'Import CSV'}
        </button>
        {importResult && (
          <div className="mt-1">
            <p>Created {importResult.createdCount} transaction(s).</p>
            {importResult.errors.length > 0 && (
              <ul className="error-text">
                {importResult.errors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
