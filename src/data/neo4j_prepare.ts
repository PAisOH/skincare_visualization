import neo4j, { Driver, Session, Result, RecordShape, QueryResult } from 'neo4j-driver';

const USER = 'neo4j';
const PASSWORD = '12345678';

export const fetchDataFromNeo4j = async (uri: string, query: string) => {
  let driver: Driver;
  let session: Session;

  try {
    driver = neo4j.driver(uri, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await driver.getServerInfo();
    console.log('Connection established');
    console.log(serverInfo);

    session = await driver.session();
    const result: QueryResult<RecordShape> = await session.run(query);

    await session.close();
    await driver.close();

    return result.records.map((record) => record.get('path'));
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
    throw err;
  }
};

export const convertNeo4jDataToListData = (paths: any) => {
  const list: string[] = [];

  paths.forEach((path: any) => {
      list.push(path.properties.id);
  });
  console.log("listtt", list)
  return list;
};

import { IngredientCount, Ingredient } from '../models/cosmeticModels';

export const convertNeo4jDataToDictData = (paths: any) => {
  const list: IngredientCount[] = [];

  // paths.forEach((path: any) => {
  //     list.push({ingredient: {
  //       ingredient_name: path
  //     }, count: path.properties.low});
  // });
  console.log("listtt", list)
  return list;
};

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

export const convertNeo4jDataToEchartsData = (paths: any) => {
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