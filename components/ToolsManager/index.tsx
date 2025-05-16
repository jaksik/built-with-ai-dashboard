import { FC, useEffect, useState } from 'react';
import { Tool } from '../../types/Tool';
import styles from './ToolsManager.module.css';

export const ToolsManager: FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools');
        const data = await response.json();
        setTools(data);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };

    fetchTools();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className="text-2xl font-bold mb-6">Manage Tools</h1>
        <div className={styles.grid}>
        {tools.map((tool) => (
          <div key={tool._id as string} className={styles.card}>
            <h3>{tool.name}</h3>
            <p className={styles.category}>{tool.category}</p>
            <p className={styles.description}>{tool.description}</p>
            <div className={styles.links}>
              <a href={tool.link} target="_blank" rel="noopener noreferrer">
                Visit Site
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsManager;