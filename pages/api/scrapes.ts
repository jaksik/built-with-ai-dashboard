import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/db';
import Scrape from '@/models/Scrape';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { category, active } = req.query;
        const query: Record<string, unknown> = {
          imported: { $ne: true } // By default, only show non-imported scrapes
        };
        
        if (category) query.category = category;
        if (active) query.active = active === 'true';

        console.log('Fetching Scrape with query:', query);
        const discoverScrape = await Scrape.find(query).sort({ createdAt: -1 });
        console.log('Found Scrapes:', discoverScrape.length);
        res.status(200).json({ 
          source: 'Scrape-api',
          data: discoverScrape 
        });
      } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ 
          error: 'Failed to fetch Scrape',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'PATCH':
      try {
        const { scrapeId } = req.query;
        const updates = req.body;
        
        if (!scrapeId) {
          return res.status(400).json({ error: 'Scrape ID is required' });
        }

        console.log('PATCH request details:', {
          scrapeId,
          rawBody: req.body,
          parsedUpdates: updates
        });

        // Find the scrape first to verify its current state
        const existingScrape = await Scrape.findById(scrapeId);
        console.log('Current scrape state:', existingScrape);

        // Create a specific update operation
        // Simple update
        await Scrape.updateOne(
          { _id: scrapeId },
          { imported: true }
        );

        // Get the updated document
        const updatedScrape = await Scrape.findById(scrapeId);

        if (!updatedScrape) {
          return res.status(404).json({ error: 'Scrape not found' });
        }

        console.log('Update operation result:', {
          before: existingScrape?.imported,
          after: updatedScrape.imported,
          fullUpdate: updatedScrape
        });

        console.log('Successfully updated scrape:', updatedScrape);
        res.status(200).json(updatedScrape);
      } catch (error) {
        console.error('PATCH Error:', error);
        res.status(500).json({ 
          error: 'Failed to update Scrape',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'DELETE':
      try {
        const { scrapeId } = req.query;
        
        if (!scrapeId) {
          return res.status(400).json({ error: 'Scrape ID is required' });
        }

        const deletedScrape = await Scrape.findByIdAndDelete(scrapeId);

        if (!deletedScrape) {
          return res.status(404).json({ error: 'Scrape not found' });
        }

        res.status(200).json({ success: true });
      } catch (error) {
        console.error('DELETE Error:', error);
        res.status(500).json({ 
          error: 'Failed to delete Scrape',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}