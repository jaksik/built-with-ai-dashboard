import React, { useEffect, useState, useCallback } from 'react';
import { IScrape } from '@/models/Scrape';
import LoadingSpinner from '../LoadingSpinner';
import ImportArticleModal from './ImportArticleModal';

const truncateText = (text: string, maxLength: number = 120) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const GetScrapes: React.FC = () => {
    const [scrape, setScrape] = useState<IScrape[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Default to descending (newest first)


    // === Fetch scrapes ===
    //=====================================
    useEffect(() => {
        const fetchScrape = async () => {
            try {
                const response = await fetch('/api/scrapes');
                if (!response.ok) {
                    throw new Error('Failed to fetch scrapes');
                }
                const { data } = await response.json();
                console.log('Fetched scrapes:', data);
                setScrape(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };
        fetchScrape();
    }, []);


    // === Handle scrape Delete ===
    //=====================================
    const handleDeleteScrape = async (id: string) => {
  
        try {
            const response = await fetch(`/api/scrapes?scrapeId=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete scrape');
            }
            setScrape(scrape.filter(scrape => scrape._id.toString() !== id));
        } catch (err) {
            alert(`Failed to delete scrape${err instanceof Error ? ': ' + err.message : ''}`);
        }
    };

    const formatDate = (date: Date | string) => {
        try {
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

    // === Handle Sorting ===
    //=====================================
    const handleSortByDate = useCallback(() => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
        setScrape(prevScrapes => {
            const sortedScrapes = [...prevScrapes].sort((a, b) => {
                const dateA = new Date(a.publishedAt).getTime();
                const dateB = new Date(b.publishedAt).getTime();
                if (sortOrder === 'asc') {
                    return dateA - dateB;
                } else {
                    return dateB - dateA;
                }
            });
            return sortedScrapes;
        });
    }, [sortOrder]);

    useEffect(() => {
        // Re-sort data if it's fetched again or sortOrder changes externally (though not typical here)
        // This ensures initial sort is applied after data fetch if sortOrder is not its default.
        if (scrape.length > 0) {
            setScrape(prevScrapes => {
                const sortedScrapes = [...prevScrapes].sort((a, b) => {
                    const dateA = new Date(a.publishedAt).getTime();
                    const dateB = new Date(b.publishedAt).getTime();
                    // Apply sort based on the current sortOrder, not the one being toggled to
                    // because handleSortByDate already toggles and then sorts.
                    // This useEffect is more for initial load or if data changes.
                    if (sortOrder === 'asc') { 
                        return dateA - dateB;
                    } else {
                        return dateB - dateA;
                    }
                });
                return sortedScrapes;
            });
        }
    }, [scrape.length > 0 ? scrape[0]?._id : null, sortOrder]); // Depend on first item's ID as a proxy for data change, and sortOrder


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

    // Handle successful import by removing the scrape from the list
    const handleImportSuccess = (importedScrape: IScrape) => {
        setScrape(prevScrapes =>
            prevScrapes.filter(scrape => scrape._id.toString() !== importedScrape._id.toString())
        );
    };

    return (
        <div className="container mx-auto p-6 max-w-[1200px]">
            <h1 className="text-2xl font-bold mb-6">Discover News scrapes</h1>
            <div className="inline-block min-w-full align-middle">
                <table className="w-full table-fixed divide-y divide-gray-200 border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={handleSortByDate}>
                                Published At {sortOrder === 'asc' ? '▲' : '▼'}
                            </th>
                            <th scope="col" className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Source
                            </th>
                            <th scope="col" className="w-6/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th scope="col" className="w-1/12 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Delete
                            </th>

                            <th scope="col" className="w-1/12 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Edit
                            </th>

                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {scrape.map((currentscrape) => (
                            <tr key={currentscrape._id.toString()} className="hover:bg-gray-50">

                                <td className="w-2/12 px-2 py-2">
                                    <span className="text-xs text-gray-900">
                                        {formatDate(currentscrape.publishedAt)}
                                    </span>
                                </td>

                                <td className="w-2/12 px-2 py-2">
                                    <span className="text-xs text-gray-900">{currentscrape.source}</span>
                                </td>
                                <td className="w-6/12 px-2 py-2">
                                    <div className="flex flex-col">
                                        <a
                                            href={currentscrape.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                                            title={currentscrape.title}
                                        >
                                            {truncateText(currentscrape.title)}
                                        </a>
                                    </div>
                                </td>

                                <td className="w-1/12 px-2 py-2">
                                    <button
                                        onClick={() => handleDeleteScrape(currentscrape._id.toString())}
                                        className="text-sm text-red-600 hover:text-red-900 font-medium"
                                        title="Delete scrape"
                                    >
                                        Delete
                                    </button>
                                </td>

                                <td className="w-1/12 px-2 py-2">
                                    <ImportArticleModal
                                        initialData={{
                                            _id: currentscrape._id.toString(),
                                            title: currentscrape.title,
                                            link: currentscrape.link,
                                            source: currentscrape.source,
                                            category: currentscrape.category || '',
                                            publishedAt: typeof currentscrape.publishedAt === 'string'
                                                ? currentscrape.publishedAt
                                                : currentscrape.publishedAt.toISOString(),
                                        }}
                                        onSuccess={handleImportSuccess}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default GetScrapes;