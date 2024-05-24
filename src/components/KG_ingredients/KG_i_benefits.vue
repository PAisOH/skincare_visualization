<template>
  <div id="main" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts">
//按需引入
import { defineComponent, onMounted } from "vue";
import { benefitColors } from '../../utils/const'

const symbolIngredients = [
  // 'Retinol', 'Squalane', 'Hyaluronic Acid', 'Vitamin B5', 'Aloe Extract',
  // 'Titanium Dioxide',
  // 'Niacinamide', 'Arbutin', 'Vitamin C',
  // 'Centella Asiatica Extract', 'Salicylic Acid',
  // 'Ceramides', 'Beta-Glucan',
  // 'Peptides',
  // 'Sodium Lauryl Sulfate',
  // 'Glycerin', 'Hydroxypropyl Tetrahydropyrantriol'
];


//引入创建的echarts.ts文件
import * as echarts from "echarts";
import { fetchDataFromNeo4j } from '../../data/neo4j_prepare'

export default defineComponent({
  // name: 'KG_ingredient',
  setup() {
    const displayEchartsGraph = (nodes: any, links: any, categories: any) => {
      const myChart = echarts.init(document.getElementById('main'));

      console.log("Nodes:", nodes);
      console.log("Links:", links);
      console.log("Categories:", categories);

      const option = {
        // backgroundColor: '#000000',
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            // 就两种格式(categories)，node和link
            if (params.dataType === 'node') {
              return `${params.data.name}<br>${params.data.description}`;
            } else {
              return `${params.data.source} --[${params.data.label}]--> ${params.data.target}`;
            }
          }
        },
        legend: [
          {
            data: categories.filter((_, index) => index > 0).map((name) => name), // 图例不显示ingredients
            // data: Object.keys(benefitColors),
            orient: 'vertical',
            left: 'left',
            top: 'center',
            textStyle: { color: '#fff' }
          }
        ],
        // stateAnimation: {
        //   duration: 300,
        //   easing: 'cubicOut',
        // }, 
        // animation: false,
        // animationDuration: 1000,
        // animationDurationUpdate: 500,
        // animationEasing: 'cubicInOut',
        // animationEasingUpdate: 'cubicInOut',
        // animationThreshold: 2000,
        // progressiveThreshold: 3000,
        // progressive: 400,
        // hoverLayerThreshold: 3000,
        // useUTC: false,
        series: [
          {
            type: 'graph',
            layout: 'force',
            data: nodes,
            links: links,
            // center: ['0%', '100%'], // 设置初始位置为容器中心
            // categories: categories.map(c => ({ name: c })),
            categories: Object.keys(benefitColors).map((name) => ({
              name: name,
              itemStyle: {
                color: benefitColors[name],
              }
            })),
            // coordinateSystem : null,//坐标系可选
            // xAxisIndex : 1000, //x轴坐标 有多种坐标系轴坐标选项
            // yAxisIndex : 1000, //y轴坐标
            roam: true,
            // label: {
            //   show: true,
            //   position: 'inside'
            // },
            lineStyle: {
              color: 'source',
              curveness: 0.3,
              width: 5.2
            },
            nodeScaleRatio: 0.6,
            force: {
              repulsion: 128,
              gravity: 0.1,
              edgeLength: [0, 7],
              layoutAnimation: true,
              // initLayout: 'circular'
            },
            visualMap: {
              min: 0.2,
              max: 2,
              precision: 2,
              calculable: true,
              realtime: true,
              orient: 'horizontal',
              left: 'center',
              top: 'top',
              color: ['#800026', '#ffffcc']
            },
            scaleLimit: {
              min: 0.1,
              max: 0.26
            },

            // animation: {
            //   duration: 50000, // 设置动画持续时间为5秒
            //   loop: true // 循环播放动画
            // },
            // animationDurationUpdate: 1,
            label: {
              show: true,
              // position: 'inside',
              position: 'right',
              distance: 300,
              align: 'left',
              color: 'white',
              fontWeight: 'bolder',
              formatter: (params) => {
                if (symbolIngredients.includes(params.data.name)) {
                  return params.data.name;
                } else {
                  return '';
                }
              },
            },
            // labelLine: {
            //   show: true,
            //   length2: 50,
            //   lineStyle: {
            //     color: '#bbb'
            //   },
            //   formatter: (params) => {
            //     if (symbolIngredients.includes(params.data.name)) {
            //       return true;
            //     } else {
            //       return false;
            //     }
            //   },
            // },
            draggable: true,
            // edgeSymbol: ['arrow', 'arrow']
            // symbol: 'diamond'
            emphasis: {
              focus: 'adjacency',
              scale: true,
              blurScope: 'coordinateSystem',
              itemStyle: {
                color: 'red',
              }
            },
          }
        ]
      };

      myChart.setOption(option);
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

    const addNode = (nodes: Map<number, any>, categories: Set<string>, node: any) => {
      const category = node.labels[0];
      categories.add(category);

      const nodeName = `${node.properties.id}`;
      nodes.set(node.identity.low, {
        id: node.identity.low,
        name: nodeName,
        category: category,
        symbol: category === 'Ingredient' ? 'circle' : 'pin',
        symbolSize: (category === 'Ingredient') ? (symbolIngredients.includes(nodeName) ? 11 : 6) : 30,
        itemStyle: {
          color: symbolIngredients.includes(nodeName) ? 'white' : benefitColors[category]
        },
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

    /** 在使用init方法初始化图表之前，确保DOM元素已经被正确加载。
     * 在Vue组件中，可以使用onMounted钩子函数来确保在DOM准备就绪后再执行初始化操作。
     */
    onMounted(async () => {

      try {
        const paths = await fetchDataFromNeo4j(
          'bolt://localhost:7687',
          'MATCH path=(i:Ingredient)-[r:HAS_BENEFIT]->(b)\nRETURN path ORDER BY b.orderIndex'
        );
        const data = convertNeo4jDataToEchartsData(paths);
        displayEchartsGraph(data.nodes, data.links, data.categories);
        console.log("@@@", data.nodes)

      } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`);
      }
    });

    return {};
  },
});
</script>

<style scoped></style>