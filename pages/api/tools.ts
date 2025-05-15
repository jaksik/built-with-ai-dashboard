import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/db';
import Tool from '@/models/Tool';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const { category, tag, active } = req.query;
        const query: Record<string, unknown> = {};
        
        if (category) query.category = category;
        if (tag) query.tags = tag;
        if (active) query.active = active === 'true';

        const tools = await Tool.find(query).sort({ createdAt: -1 });
        res.status(200).json(tools);
      } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ 
          error: 'Failed to fetch tools',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'POST':
      try {
        const tool = await Tool.create(req.body);
        res.status(201).json(tool);
      } catch (error) {
        console.error('POST Error:', error);
        res.status(500).json({ 
          error: 'Failed to create tool',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'PATCH':
      try {
        const { toolId, ...updates } = req.body;
        
        if (!toolId) {
          return res.status(400).json({ error: 'Tool ID is required' });
        }

        const tool = await Tool.findByIdAndUpdate(
          toolId,
          updates,
          { new: true }
        );

        if (!tool) {
          return res.status(404).json({ error: 'Tool not found' });
        }

        res.status(200).json(tool);
      } catch (error) {
        console.error('PATCH Error:', error);
        res.status(500).json({ 
          error: 'Failed to update tool',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    case 'DELETE':
      try {
        const { toolId } = req.query;
        
        if (!toolId) {
          return res.status(400).json({ error: 'Tool ID is required' });
        }

        const tool = await Tool.findByIdAndDelete(toolId);

        if (!tool) {
          return res.status(404).json({ error: 'Tool not found' });
        }

        res.status(200).json({ success: true });
      } catch (error) {
        console.error('DELETE Error:', error);
        res.status(500).json({ 
          error: 'Failed to delete tool',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}