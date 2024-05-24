import {fetchDataFromNeo4j} from '../../data/neo4j_prepare'

interface Ingredient {
    ingredient_name: string;
    rating: 'BEST' | 'GOOD' | 'AVERAGE' | 'WORST' | 'NOT RATED';
    benefits: string;
  }
  
  interface Cosmetic {
    id: string;
    cosmetic_name: string;
    ingredients: Ingredient[];
  }
  
  const addNode = (nodes: Map<number, any>, categories: Set<string>, node: any) => {
    const category = node.labels[0];
    categories.add(category);
  
    const nodeName = `${node.properties.id}`;
    nodes.set(node.identity.low, {
      id: node.identity.low,
      name: nodeName,
      category: category,
      symbol: category === 'Ingredient' ? 'circle' : 'pin',
      ...node.properties,
    });
  };
  
  const addRelationship = (links: any[], nodes: Map<number, any>, relationship: any) => {
    links.push({
      source: nodes.get(relationship.end.low).id,
      target: nodes.get(relationship.start.low).id,
      label: relationship.type,
      properties: relationship.properties,
    });
  };
  
  const convertNeo4jDataToEchartsData = (paths: any) => {
    const nodes = new Map();
    const links = [];
    const categories = new Set<string>();
  
    paths.forEach((path: any) => {
      path.segments.forEach(({ start, end, relationship }: any) => {
        addNode(nodes, categories, start);
        addNode(nodes, categories, end);
        addRelationship(links, nodes, relationship);
      });
    });
  
    return {
      nodes: Array.from(nodes.values()),
      links,
      categories: Array.from(categories),
    };
  };
  
  const loadData = async () => {
    try {
      const paths = await fetchDataFromNeo4j(
        'bolt://localhost:7687',
        'MATCH path=(c:Cosmetic {id: \'Lip Butter Balm for Hydration & Shine\'})-[:USE]->(i:Ingredient) RETURN path'
      );
      const data = convertNeo4jDataToEchartsData(paths);
      const exampleCosmetic: Cosmetic = {
        id: 'Lip Butter Balm for Hydration & Shine',
        cosmetic_name: 'Lip Butter Balm for Hydration & Shine',
        ingredients: [
          // 这里需要根据您从 Neo4j 获取的数据填充 ingredients 数组
        ],
      };
  
    } catch (err) {
      console.log(`Connection error\n${err}\nCause: ${err.cause}`);
    }
  };
  
  const benefitColors: Record<string, string> = {
    'Hydration': '#3B4EE2',
    'Soothing': '#F4C2C2',
    'AntiAging': '#F9D78C',
    'EvensSkinTone': '#E57373',
    'DarkSpotFading': '#73C0DE',
    'AntiAcne': '#EF3405',
    'OilControl': '#43EB8F',
    'SmoothsBumpySkin': '#EA7CCC',
    'BlackheadReducing': '#D87C7C',
    'PoreMinimizer': '#B6A2DE',
  };
  
  export { benefitColors, loadData, convertNeo4jDataToEchartsData, Ingredient };
  
//   export { loadData, convertNeo4jDataToEchartsData, Ingredient };