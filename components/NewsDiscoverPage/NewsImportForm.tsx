import React, { useState, useEffect } from 'react';
import { IArticle } from '../../models/Article';

interface NewsImportFormProps {
    selectedArticle: IArticle | null;
    onClose: () => void;
}

interface FormData {
    title: string;
    link: string;
    source: string;
    category: string;
    publishedAt: string;
}

const NewsImportForm: React.FC<NewsImportFormProps> = ({ selectedArticle, onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        link: '',
        source: '',
        category: '',
        publishedAt: new Date().toISOString().split('T')[0]  // Remove this transformation
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Pre-fill form when selectedArticle changes
    useEffect(() => {
        if (selectedArticle) {
            setFormData({
                title: selectedArticle.title,
                link: selectedArticle.link,
                source: selectedArticle.source,
                category: '',
                publishedAt: typeof selectedArticle.publishedAt === 'string'
                    ? selectedArticle.publishedAt
                    : selectedArticle.publishedAt.toISOString().split('T')[0] // Convert Date to 'YYYY-MM-DD'
            });
        }
    }, [selectedArticle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        console.log("formattedDate:", formData.publishedAt)

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

  
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Import Article to News DB</h1>
            {error && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
                    News article created successfully!
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                        Link
                    </label>
                    <input
                        type="url"
                        name="link"
                        id="link"
                        required
                        value={formData.link}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                        Source
                    </label>
                    <input
                        type="text"
                        name="source"
                        id="source"
                        required
                        value={formData.source}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        name="category"
                        id="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="" disabled>Select category</option>
                        <option value="Macro Shifts">Macro Shifts</option>
                        <option value="AI Agents">AI Agents</option>
                        <option value="Startups">Startups</option>
                        <option value="Research">Research</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700">
                        Published Date
                    </label>
                    <input
                        type="date"
                        name="publishedAt"
                        id="publishedAt"
                        required
                        value={formData.publishedAt}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Importing...' : 'Import Article'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewsImportForm;