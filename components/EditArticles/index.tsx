import React, { useEffect, useState } from 'react';
import { IArticle } from '@/models/Article';
import LoadingSpinner from '../LoadingSpinner';
import { EditArticleModal } from './EditArticleModal';

const truncateText = (text: string, maxLength: number = 74) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const EditArticles: React.FC = () => {
    const [article, setarticle] = useState<IArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');


    // === Fetch Articles ===
    //=====================================
    useEffect(() => {
        const fetcharticle = async () => {
            try {
                const response = await fetch('/api/articles');
                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }
                const { data } = await response.json();
                console.log('Fetched articles:', data);
                setarticle(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };
        fetcharticle();
    }, []);


    // === Handle Article Delete ===
    //=====================================
    const handleDeleteArticle = async (id: string) => {
        // if (!window.confirm('Are you sure you want to delete this article?')) {
        //     return;
        // }
        try {
            const response = await fetch(`/api/articles?articleId=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete article');
            }
            setarticle(article.filter(article => article._id.toString() !== id));
        } catch (err) {
            alert(`Failed to delete article${err instanceof Error ? ': ' + err.message : ''}`);
        }
    };

    const formatDate = (date: Date | string) => {
        try {
            console.log('Original date value:', date, typeof date);
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                console.error('Invalid date:', date);
                return 'Invalid date';
            }
            return dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC'  // This ensures we use the UTC date without timezone conversion
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
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
            <h1 className="text-2xl font-bold mb-6 text-center">Edit Articles</h1>
            <table className="w-full table-fixed divide-y divide-gray-200 border-collapse max-w-[1200px] mx-auto">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="w-2/12 px-2 py-2 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Published At
                        </th>
                        <th scope="col" className="w-6/12 px-2 py-2 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th scope="col" className="w-2/12 px-2 py-2 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Category
                        </th>

                        <th scope="col" className="w-1/12 px-2 py-2 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Edit
                        </th>
                        <th scope="col" className="w-1/12 px-2 py-2 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Delete
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {article.map((currentArticle) => (
                        <tr key={currentArticle._id.toString()} className="hover:bg-gray-50">

                            <td className="w-2/12 px-2 py-1">
                                <span className="text-sm text-gray-900">
                                    {formatDate(currentArticle.publishedAt)}

                                </span>
                            </td>

                            <td className="w-6/12 px-2 py-1">
                                <div className="flex flex-col">
                                    <a
                                        href={currentArticle.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                                        title={currentArticle.title}
                                    >
                                        {truncateText(currentArticle.title)}
                                    </a>
                                                                    <span className="text-xs text-gray-900">{currentArticle.source}</span>
                                </div>
                            </td>

                            {/* <td className="w-2/12 px-2 py-1">
                                <span className="text-sm text-gray-900">{currentArticle.source}</span>
                            </td> */}
                            <td className="w-2/12 px-2 py-1">
                                <span className="text-sm text-gray-900">{currentArticle.category}</span>
                            </td>

                            <td className="w-1/12 px-2 py-1">
                                <EditArticleModal
                                    initialData={{
                                        _id: currentArticle._id.toString(),
                                        title: currentArticle.title,
                                        link: currentArticle.link,
                                        source: currentArticle.source,
                                        category: currentArticle.category,
                                        publishedAt: typeof currentArticle.publishedAt === 'string' ? currentArticle.publishedAt : currentArticle.publishedAt.toISOString(),
                                    }}
                                    onSuccess={(updatedArticle) => {
                                        setarticle(article.map((item) =>
                                            item._id.toString() === currentArticle._id.toString()
                                                ? { ...item, ...updatedArticle }
                                                : item
                                        ));
                                    }}
                                />
                            </td>

                            <td className="w-1/12 px-6 py-4 text-right">
                                <button
                                    onClick={() => handleDeleteArticle(currentArticle._id.toString())}
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

    );
};

export default EditArticles;