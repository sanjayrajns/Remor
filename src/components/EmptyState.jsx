import React from 'react';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={40} className="empty-state-icon" strokeWidth={1.5} />}
      <h3 className="font-heading text-lg font-600 text-primary">{title}</h3>
      {description && <p className="text-secondary text-sm" style={{ maxWidth: '320px' }}>{description}</p>}
      {actionLabel && onAction && (
        <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
