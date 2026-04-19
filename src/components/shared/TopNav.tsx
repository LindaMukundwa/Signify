import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import SignifyLogo from '../../assets/SignifyLogo.png';

const PAGE_TITLES: Record<string, string> = {
  '/medical-id': 'Medical ID',
  '/phrases': 'Phrase Pad',
  '/fingerspell': 'Fingerspelling',
  '/responder': 'Responder View',
};

export const TopNav: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';
  const title = PAGE_TITLES[pathname];

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-app mx-auto px-4 h-14 flex items-center gap-3">
        {isHome ? (
          <>
            <img
              src={SignifyLogo}
              alt="Signify"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              style={{ width: '100px', borderRadius: '50%', alignContent: 'center'}} 
            />
          </>
        ) : (
          <>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-secondary transition-colors flex-shrink-0"
              aria-label="Go back"
            >
              <ChevronLeft size={22} className="text-text-primary" />
            </button>
            {title && (
              <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
            )}
          </>
        )}
      </div>
    </header>
  );
};
