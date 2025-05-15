import { FC } from 'react';
import toolData from '../../test-data/tool-data.json';
import { Tool } from '../../types/Tool';
import styles from './ToolsManager.module.css';

const ToolCard: FC<{ tool: Tool }> = ({ tool }) => (
  <div className={styles.card}>
    <h3>{tool.name}</h3>
    <p className={styles.category}>{tool.category}</p>
    <p className={styles.description}>{tool.description}</p>
    <div className={styles.links}>
      <a href={tool.link} target="_blank" rel="noopener noreferrer">Visit Site</a>
    </div>
  </div>
);

export const ToolsManager: FC = () => {
  return (
    <div className={styles.container}>
      <h2>Tools Collection</h2>
      <div className={styles.grid}>
        {toolData.map((tool, index) => (
          <ToolCard key={index} tool={tool} />
        ))}
      </div>
    </div>
  );
};

export default ToolsManager;