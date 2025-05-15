import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/db';
import Article from '@/models/Article';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { category, active } = req.query;
        const query: Record<string, unknown> = {};
        
        if (category) query.category = category;
        if (active) query.active = active === 'true';

        console.log('Fetching Article with query:', query);
        const discoverArticle = await Article.find(query).sort({ createdAt: -1 });
        console.log('Found Article Article:', discoverArticle.length);
        console.log('Response from Article API');
        res.status(200).json({ 
          source: 'Article-api',
          data: discoverArticle 
        });
      } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ 
          error: 'Failed to fetch Article',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'POST':
      try {
        const createdArticle = await Article.create(req.body);
        res.status(201).json(createdArticle);
      } catch (error) {
        console.error('POST Error:', error);
        res.status(500).json({ 
          error: 'Failed to create Article',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'PATCH':
      try {
        const { ArticleId, ...updates } = req.body;
        
        if (!ArticleId) {
          return res.status(400).json({ error: 'Article ID is required' });
        }

        const updatedArticle = await Article.findByIdAndUpdate(
          ArticleId,
          updates,
          { new: true }
        );

        if (!updatedArticle) {
          return res.status(404).json({ error: 'Article not found' });
        }

        res.status(200).json(updatedArticle);
      } catch (error) {
        console.error('PATCH Error:', error);
        res.status(500).json({ 
          error: 'Failed to update Article',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'DELETE':
      try {
        const { articleId } = req.query;
        
        if (!articleId) {
          return res.status(400).json({ error: 'Article ID is required' });
        }

        const deletedArticle = await Article.findByIdAndDelete(articleId);

        if (!deletedArticle) {
          return res.status(404).json({ error: 'Article not found' });
        }

        res.status(200).json({ success: true });
      } catch (error) {
        console.error('DELETE Error:', error);
        res.status(500).json({ 
          error: 'Failed to delete Article',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}