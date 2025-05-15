import React, { useState } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '../LoadingSpinner';

interface FormData {
  name: string;
  link: string;
  affiliate: string;
  dashboard: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
}

const initialFormData: FormData = {
  name: '',
  link: '',
  affiliate: '',
  dashboard: '',
  tagline: '',
  description: '',
  category: '',
  tags: []
};

const categories = [
  'AI',
  'Automation',
  'Coding',
  'Design',
  'Marketing',
  'Productivity',
  // Add more categories as needed
];

const ToolCreateForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      // Split tags by comma and trim whitespace
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(tag => tag.trim())
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create tool');
      }

      setSuccess(true);
      // Clear form
      setFormData(initialFormData);
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/tools/manage');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded">
          Tool created successfully! Redirecting...
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tool Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
            Website URL *
          </label>
          <input
            type="url"
            id="link"
            name="link"
            required
            value={formData.link}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="affiliate" className="block text-sm font-medium text-gray-700">
            Affiliate Link
          </label>
          <input
            type="url"
            id="affiliate"
            name="affiliate"
            value={formData.affiliate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dashboard" className="block text-sm font-medium text-gray-700">
            Dashboard URL
          </label>
          <input
            type="url"
            id="dashboard"
            name="dashboard"
            value={formData.dashboard}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">
            Tagline
          </label>
          <input
            type="text"
            id="tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags.join(', ')}
            onChange={handleChange}
            placeholder="ai, automation, productivity"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="h-4 w-4" />
              <span>Creating...</span>
            </>
          ) : (
            'Create Tool'
          )}
        </button>
      </div>
    </form>
  );
};

export default ToolCreateForm;