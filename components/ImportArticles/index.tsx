import React, { useEffect, useState, useCallback } from 'react';
import { IScrape } from '@/models/Scrape';
import LoadingSpinner from '../LoadingSpinner';
import ArticleTable from './ArticleTable';

const GetScrapes: React.FC = () => {
    const [scrape, setScrape] = useState<IScrape[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortField, setSortField] = useState<'date' | 'source'>('date');
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

    // Helper functions moved to ArticleTable component

    // === Handle Sorting ===
    //=====================================
    const handleSort = useCallback((field: 'date' | 'source') => {
        if (field === sortField) {
            // If clicking the same field, toggle the order
            setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
        } else {
            // If clicking a different field, set it as the new sort field and default to ascending
            setSortField(field);
            setSortOrder('asc');
        }

        setScrape(prevScrapes => {
            const sortedScrapes = [...prevScrapes].sort((a, b) => {
                if (field === 'date') {
                    const dateA = new Date(a.publishedAt).getTime();
                    const dateB = new Date(b.publishedAt).getTime();
                    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                } else {
                    // Sort by source
                    const sourceA = a.source.toLowerCase();
                    const sourceB = b.source.toLowerCase();
                    return sortOrder === 'asc' 
                        ? sourceA.localeCompare(sourceB)
                        : sourceB.localeCompare(sourceA);
                }
            });
            return sortedScrapes;
        });
    }, [sortField, sortOrder]);

    useEffect(() => {
        if (scrape.length > 0) {
            setScrape(prevScrapes => {
                const sortedScrapes = [...prevScrapes].sort((a, b) => {
                    if (sortField === 'date') {
                        const dateA = new Date(a.publishedAt).getTime();
                        const dateB = new Date(b.publishedAt).getTime();
                        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                    } else {
                        const sourceA = a.source.toLowerCase();
                        const sourceB = b.source.toLowerCase();
                        return sortOrder === 'asc' 
                            ? sourceA.localeCompare(sourceB)
                            : sourceB.localeCompare(sourceA);
                    }
                });
                return sortedScrapes;
            });
        }
    }, [scrape.length > 0 ? scrape[0]?._id : null, sortOrder, sortField]); // Depend on first item's ID as a proxy for data change, and sortOrder


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
        <div className="container mx-auto p-6 max-w-[1400px]">
            <h1 className="text-2xl font-bold mb-6">Discover News scrapes</h1>
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