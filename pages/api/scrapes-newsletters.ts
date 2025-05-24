import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/db';
import Scrape from '@/models/Scrape';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  await dbConnect();

  try {
    const scrapeData = req.body;

    // Validate required fields for Google Scripts data
    if (!scrapeData || !scrapeData.title || !scrapeData.link) {
      return res.status(400).json({ 
        error: 'Invalid scrape data', 
        message: 'Title and link are required',
        received: scrapeData 
      });
    }

    // Normalize the data
    const normalizedData = {
      ...scrapeData,
      category: scrapeData.category || '',
      source: scrapeData.source || 'Google Scripts',
      publishedAt: scrapeData.publishedAt || new Date().toISOString(),
      active: scrapeData.active ?? true,
      imported: false,
      createdAt: new Date()
    };

    const newScrape = await Scrape.create(normalizedData);
    console.log('Created new scrape from Google Scripts:', newScrape);

    res.status(201).json({
      success: true,
      data: newScrape
    });
  } catch (error) {
    console.error('Google Scripts POST Error:', error);
    res.status(500).json({
      error: 'Failed to create Scrape',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
// curl -X POST \
//   -H "Content-Type: application/json" \
//   -d '{"title":"Test","link":"https://example.com","source":"Test","category":"Product"}' \
//   http://localhost:3000/api/scrapes-newsletters