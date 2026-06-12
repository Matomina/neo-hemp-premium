import { useNavigate } from 'react-router-dom';

export function useScrollNavigate() {
  const rrNav = useNavigate();
  return (path: string) => {
    rrNav(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}
