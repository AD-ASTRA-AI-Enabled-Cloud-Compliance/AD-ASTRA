type RuleItem = Record<string, any>;

interface GraphNode {
  id: string;
  type: string;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

/**
 * Extracts graph nodes and links from given data using two keys
 */
export function extractNodesAndLinks(
  data: RuleItem[],
  keyA: string,
  keyB: string
): GraphData {
  const nodeMap = new Map<string, GraphNode>();
  const links: GraphLink[] = [];

  data.forEach(item => {
    const source = item[keyA];
    const target = item[keyB];

    if (source && target) {
      if (!nodeMap.has(source)) nodeMap.set(source, { id: source, type: keyA });
      if (!nodeMap.has(target)) nodeMap.set(target, { id: target, type: keyB });

      links.push({ source, target, value: 1 });
    }
  });

  return {
    nodes: Array.from(nodeMap.values()),
    links
  };
}
