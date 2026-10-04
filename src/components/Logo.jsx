import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="DegreeAtlas home">
      <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 21, letterSpacing: '-.02em', color: '#14142B' }}>
        DegreeAtlas
      </span>
    </Link>
  );
}
