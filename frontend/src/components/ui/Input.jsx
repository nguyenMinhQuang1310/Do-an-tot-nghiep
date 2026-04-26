import './Input.css';

export default function Input({ label, error, type = 'text', ...props }) {
  const Tag = type === 'textarea' ? 'textarea' : 'input';
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <Tag type={type !== 'textarea' ? type : undefined} className={error ? 'input-error' : ''} {...props} />
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}
