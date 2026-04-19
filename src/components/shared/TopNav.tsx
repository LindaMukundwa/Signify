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
    <header id='header' className="bg-surface border-b border-border sticky top-0 z-50 flex-shrink-0">
      <div className="max-w-app mx-auto px-4 h-14 flex items-center">
        {isHome ? (
          <div className="w-full justify-center">
            <img
              src={SignifyLogo}
              alt="Signify"
              className="h-10 w-10 rounded-full object-cover"
              style={{ width: '120px', borderRadius: '50%' }} 
            />
          </div>
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
              <h1 className="text-2xl font-semibold text-text-primary ml-2">{title}</h1>
            )}
          </>
        )}
      </div>
    </header>
  );
};
