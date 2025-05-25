import React from 'react';
import { IScrape } from '@/models/Scrape';
import ImportArticleModal from './ImportArticleModal';

interface ArticleTableProps {
    scrapes: IScrape[];
    sortField: 'date' | 'source' | 'category' | 'createdAt';
    sortOrder: 'asc' | 'desc';
    onSort: (field: 'date' | 'source' | 'category' | 'createdAt') => void;
    onDelete: (id: string) => void;
    onImportSuccess: (importedScrape: IScrape) => void;
}

const truncateTitle = (text: string, maxLength: number = 120) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const truncatePublisher = (text: string, maxLength: number = 40) => {
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
        <div className="w-full">
            <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 bg-white">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th scope="col"
                                className="w-[7.5%] px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => onSort('date')}>
                                Publish Date {sortField === 'date' && (
                                    <span className="ml-1 text-blue-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th scope="col" className="w-[7.5%] px-3 py-3 text-center text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
                                Delete
                            </th>
                             <th scope="col" className="w-[7.5%] px-3 py-3 text-center text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
                                Import
                            </th>
                           
                            <th scope="col" className="w-[57.5%] px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
                                Title
                            </th>
                           
                             <th scope="col"
                                className="w-[7.5%] px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => onSort('source')}>
                                Source {sortField === 'source' && (
                                    <span className="ml-1 text-blue-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th scope="col"
                                className="w-[7.5%] px-3 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => onSort('createdAt')}>
                                Scrape Date {sortField === 'createdAt' && (
                                    <span className="ml-1 text-blue-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {scrapes.map((currentscrape, index) => (
                            <tr 
                                key={currentscrape._id.toString()} 
                                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-150`}
                            >
                                <td className="px-2 py-1 text-center">
                                    <span className="text-xs text-gray-900 font-medium">
                                        {formatDate(currentscrape.publishedAt)}
                                    </span>
                                </td>                                
                                <td className="px-2 py-1 text-center">   
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
                                <td className="px-2 py-1 text-center"> 
                                    <button
                                        onClick={() => onDelete(currentscrape._id.toString())}
                                        className="inline-flex items-center px-2 py-.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-400 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                                        title="Delete scrape"
                                    >
                                        Delete
                                    </button>
                                </td>
                                <td className="px-2 py-1">
                                    <div className="flex flex-col">
                                        <a
                                            href={currentscrape.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-150 line-clamp-2 pb-1"
                                            title={currentscrape.title}
                                        >
                                            {truncateTitle(currentscrape.title)}
                                        </a>
                                        <span className="text-[14px] text-gray-500">
                                            {truncatePublisher(currentscrape.publisher)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-2 py-1 text-center">
                                     <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[12px] text-center font-medium bg-blue-100 text-blue-800">
                                        {currentscrape.source}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <span className="text-[12px] text-gray-900 font-medium">
                                        {formatDate(currentscrape.createdAt)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ArticleTable;