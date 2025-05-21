import React, { useEffect, useState } from 'react';
import { IArticle } from '../../models/Article';
import LoadingSpinner from '../LoadingSpinner';
import NewsImportModal from './NewsImportModal';

const truncateText = (text: string, maxLength: number = 74) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const ArticleDiscover: React.FC = () => {
  const [article, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);

  useEffect(() => {
    const fetcharticle = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const { data } = await response.json();
        console.log("data:", data)
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetcharticle();
  }, []);

  const handleDeleteArticle = async (id: string) => {

    try {
      const response = await fetch(`/api/articles?articleId=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete article');
      }

      setArticles(article.filter(article => article._id.toString() !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 rounded bg-red-50 border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Discover News Articles</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto sm:mx-0 -mx-6">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full table-fixed divide-y divide-gray-200 border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published At
                  </th>
                  <th scope="col" className="w-6/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>

                  <th scope="col" className="w-1/12 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Import
                  </th>
                  <th scope="col" className="w-1/12 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {article.map((article) => (
                  <tr key={article._id.toString()} className="hover:bg-gray-50">

                    <td className="w-2/12 px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>

                    <td className="w-6/12 px-6 py-4">
                      <div className="flex flex-col">
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                          title={article.title}
                        >
                          {truncateText(article.title)}
                        </a>
                      </div>
                    </td>

                    <td className="w-2/12 px-6 py-4">
                      <span className="text-sm text-gray-900">{article.source}</span>
                    </td>

                    <td className="w-1/12 px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedArticle(article);
                          setIsModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        Imp
                      </button>
                    </td>

                    <td className="w-1/12 px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteArticle(article._id.toString())}
                        className="text-sm text-red-600 hover:text-red-900 font-medium"
                        title="Delete article"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <NewsImportModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedArticle(null); // Clear selection when closing
        }}
        article={selectedArticle}

      >
      </NewsImportModal>
    </div>
  );
};

export default ArticleDiscover;