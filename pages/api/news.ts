import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/db';
import News from '@/models/News';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { category, active } = req.query;
        const query: Record<string, unknown> = {};
        
        if (category) query.category = category;
        if (active) query.active = active === 'true';

        console.log('Fetching news with query:', query);
        const newsArticles = await News.find(query).sort({ createdAt: -1 });
        console.log('Found news articles:', newsArticles.length);
        console.log('Response from NEWS API');
        res.status(200).json({ 
          source: 'news-api',
          data: newsArticles 
        });
      } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ 
          error: 'Failed to fetch news',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'POST':
      try {
        const createdNews = await News.create(req.body);
        res.status(201).json(createdNews);
      } catch (error) {
        console.error('POST Error:', error);
        res.status(500).json({ 
          error: 'Failed to create news',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'PATCH':
      try {
        const { newsId, ...updates } = req.body;
        
        if (!newsId) {
          return res.status(400).json({ error: 'news ID is required' });
        }

        const updatedNews = await News.findByIdAndUpdate(
          newsId,
          updates,
          { new: true }
        );

        if (!updatedNews) {
          return res.status(404).json({ error: 'news not found' });
        }

        res.status(200).json(updatedNews);
      } catch (error) {
        console.error('PATCH Error:', error);
        res.status(500).json({ 
          error: 'Failed to update news',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'DELETE':
      try {
        const { newsId } = req.query;
        
        if (!newsId) {
          return res.status(400).json({ error: 'News ID is required' });
        }

        const deletedNews = await News.findByIdAndDelete(newsId);

        if (!deletedNews) {
          return res.status(404).json({ error: 'News not found' });
        }

        res.status(200).json({ success: true });
      } catch (error) {
        console.error('DELETE Error:', error);
        res.status(500).json({ 
          error: 'Failed to delete news',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}