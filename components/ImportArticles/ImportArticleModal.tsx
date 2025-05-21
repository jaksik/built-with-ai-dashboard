import { useState, useEffect } from 'react';
import ImportArticleForm from './ImportArticleForm';
import { IScrape } from '@/models/Scrape';

interface ImportArticleModalProps {
  initialData: {
    _id: string;
    title: string;
    link: string;
    source: string;
    category: string;
    publishedAt: string;
  };
  onSuccess: (importedArticle: IScrape) => void;
}

const ImportArticleModal: React.FC<ImportArticleModalProps> = ({ initialData, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle background click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Import
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-lg p-6 max-w-[900px] w-full relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2"
              aria-label="Close modal"
            >
              ×
            </button>
            <h2 id="modal-title" className="sr-only">Import Article</h2>
            <ImportArticleForm
              initialData={initialData}
              onSuccess={(importedScrape: IScrape) => {
                setIsOpen(false);
                onSuccess(importedScrape);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportArticleModal;