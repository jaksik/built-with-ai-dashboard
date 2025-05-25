import React, { useEffect, useState, useCallback } from 'react';
import { IScrape } from '@/models/Scrape';
import LoadingSpinner from '../LoadingSpinner';
import ArticleTable from './ArticleTable';

const GetScrapes: React.FC = () => {
    const [scrape, setScrape] = useState<IScrape[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortField, setSortField] = useState<'date' | 'source' | 'category' | 'createdAt'>('date');
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

    // === Handle Sorting ===
    //=====================================
    const sortData = useCallback((data: IScrape[], field: typeof sortField, order: typeof sortOrder) => {
        return [...data].sort((a, b) => {
            if (field === 'date') {
                const dateA = new Date(a.publishedAt).getTime();
                const dateB = new Date(b.publishedAt).getTime();
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            } else if (field === 'createdAt') {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            } else if (field === 'category') {
                const categoryA = (a.category || '').toLowerCase();
                const categoryB = (b.category || '').toLowerCase();
                return order === 'asc'
                    ? categoryA.localeCompare(categoryB)
                    : categoryB.localeCompare(categoryA);
            } else {
                // Sort by source
                const sourceA = a.source.toLowerCase();
                const sourceB = b.source.toLowerCase();
                return order === 'asc' 
                    ? sourceA.localeCompare(sourceB)
                    : sourceB.localeCompare(sourceA);
            }
        });
    }, []);

    const handleSort = useCallback((field: typeof sortField) => {
        setSortField(field);
        setSortOrder(prevOrder => {
            const newOrder = field === sortField ? (prevOrder === 'asc' ? 'desc' : 'asc') : 'asc';
            setScrape(prevScrapes => sortData(prevScrapes, field, newOrder));
            return newOrder;
        });
    }, [sortField, sortData]);

    useEffect(() => {
        // Only sort if we have scrapes
        if (scrape.length > 0) {
            setScrape(prevScrapes => sortData(prevScrapes, sortField, sortOrder));
        }
    }, [scrape, sortField, sortOrder, sortData]); // Include all dependencies directly


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
        <div className="container mx-auto max-w-[1400px]">
            <h1 className="text-2xl font-bold mb-6">Scraped Articles</h1>
            <ArticleTable 
                scrapes={scrape}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                onDelete={handleDeleteScrape}
                onImportSuccess={handleImportSuccess}
            />
        </div>
    );
};

export default GetScrapes;