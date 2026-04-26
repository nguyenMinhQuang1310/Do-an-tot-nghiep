import './Spinner.css';

export default function Spinner({ size = '' }) {
  return <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} />;
}
