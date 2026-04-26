import { Package } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({ icon = <Package size={48} strokeWidth={1.5} />, title, message, children }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {children}
    </div>
  );
}
