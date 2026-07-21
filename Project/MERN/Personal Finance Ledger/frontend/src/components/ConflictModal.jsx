// Shown when a PUT /transactions/:id returns 409 because someone else
// (another tab, another device) changed the record since we last read it.
export default function ConflictModal({ mine, theirs, onKeepMine, onUseTheirs, onCancel }) {
  if (!mine || !theirs) return null;

  const fmt = (tx) =>
    tx.entries
      .map((e) => `${e.direction} ${e.amount} (${e.account?.name || e.account})`)
      .join('\n');

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Update conflict</h3>
        <p className="text-dim">
          This transaction was changed elsewhere (version {theirs.version} vs your version {mine.version}).
          Choose which copy to keep.
        </p>
        <div className="grid cols-2 mt-1">
          <div>
            <strong>Your edit</strong>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>{fmt(mine)}</pre>
          </div>
          <div>
            <strong>Server copy</strong>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>{fmt(theirs)}</pre>
          </div>
        </div>
        <div className="flex-between mt-1">
          <button className="btn secondary" onClick={onCancel}>Cancel</button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn secondary" onClick={() => onUseTheirs(theirs)}>Use server copy</button>
            <button className="btn" onClick={() => onKeepMine(theirs.version)}>Keep mine (overwrite)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
