import React from 'react';

export default function ConfirmModal({ title, message, onConfirm, onCancel, loading, confirmText = 'Confirm', danger = false }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? '⏳ Please wait...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
