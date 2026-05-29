import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon = '📭', title, subtitle, actionLabel, actionTo }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {subtitle && <p style={{ marginBottom: 20 }}>{subtitle}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary" style={{ width: 'auto', display: 'inline-flex' }}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
