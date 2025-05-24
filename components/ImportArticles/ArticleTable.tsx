import React from 'react';
import { IScrape } from '@/models/Scrape';
import ImportArticleModal from './ImportArticleModal';

interface ArticleTableProps {
    scrapes: IScrape[];
    sortField: 'date' | 'source';
    sortOrder: 'asc' | 'desc';
    onSort: (field: 'date' | 'source') => void;
    onDelete: (id: string) => void;
    onImportSuccess: (importedScrape: IScrape) => void;
}

const truncateText = (text: string, maxLength: number = 120) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
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

const ArticleTable: React.FC<ArticleTableProps> = ({
    scrapes,
    sortField,
    sortOrder,
    onSort,
    onDelete,
    onImportSuccess
}) => {
    return (
        <div className="inline-block min-w-full align-middle">
            <table className="w-full table-fixed divide-y divide-gray-200 border-collapse">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => onSort('date')}>
                            Published At {sortField === 'date' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                        <th scope="col" className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => onSort('source')}>
                            Source {sortField === 'source' && (sortOrder === 'asc' ? '▲' : '▼')}
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
                    {scrapes.map((currentscrape) => (
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
                                    onClick={() => onDelete(currentscrape._id.toString())}
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
                                    onSuccess={onImportSuccess}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ArticleTable;