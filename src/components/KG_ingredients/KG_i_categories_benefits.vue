<template>
    <div id="main" style="width: 100%; height: 100%"></div>
</template>

<script lang="ts">
//按需引入
import { defineComponent, onMounted } from "vue";

const symbolIngredients = [
    'Retinol', 'Squalane', 'Hyaluronic Acid', 'Vitamin B5', 'Aloe Extract',
    'Titanium Dioxide',
    'Niacinamide', 'Arbutin', 'Vitamin C',
    'Centella Asiatica Extract', 'Salicylic Acid',
    'Ceramides', 'Beta-Glucan',
    'Peptides'
];

const categoryColors = {
    ingredient: {
        Ingredient: "#BFC4C4",
    },
    benefits: {
        Hydration: "#3B4EE2",
        Soothing: "#91cc75",
        AntiAging: "#fac858",
        EvensSkinTone: "#ee6666",
        DarkSpotFading: "#73c0de",
        AntiAcne: "#EF3405",
        OilControl: "#43EB8F",
        SmoothsBumpySkin: "#ea7ccc",
        BlackheadReducing: "#d87c7c",
        PoreMinimizer: "#b6a2de",
    },
    categories: {
        PlantExtracts: "#8FBC8F",
        Irritant: "#FF6666",
        Emulsifier: "#FFCC99",
        SuspendingDispersingAgent: "#99CCFF",
        Solvent: "#ADD8E6",
        TextureEnhancer: "#66FFCC",
        Humectant: "#00CCCC",
        Emollient: "#FFFF99",
        OcclusiveOpacifyingAgent: "#CC99CC",
        Preservative: "#CCCCFF",
        Antibacterial: "#66FF99",
        Antioxidant: "#CC99FF",
        ChelatingAgent: "#9999EE",
        FragranceSyntheticAndNatural: "#FF66FF",
        ColoringAgentPigment: "#99CC99",
        CleansingAgent: "#FF9966",
        Exfoliant: "#CC9999",
        UVFilters: "#66CCFF",
        pHAdjusterStabilizer: "#CC66CC",
        FilmFormingAgent: "#00CCCC",
        Absorbent: "#CC9966",
        Peptides: "#FF66CC",
        Polymer: "#9999EE",
        Silicone: "#66FFCC",
        Retinoids: "#FFAA66",
        PrebioticProbioticPostbiotic: "#CCCCFF"
    }
};


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
            console.log(categories.filter((_, index) => index > 26))
            console.log(categoryColors.benefits)
            const option = {
                backgroundColor: '#000000',
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        // 就两种格式(categories)，node和link
                        if (params.dataType === 'node') {
                            return `${params.data.name}<br>${params.data.description}`;
                        } else {
                            return `${params.data.target} --[${params.data.label}]--> ${params.data.source}`;
                        }
                    }
                },
                legend: [
                    {
                        name: 'Ingredient',
                        data: [categoryColors.ingredient],
                        // orient: 'vertical',
                        left: '5%',
                        top: '5%',
                        textStyle: { color: '#fff' },
                        icon: 'pin'
                    },
                    // {
                    //     name: 'Plant Extracts and Irritant',
                    //     data: ['PlantExtracts', 'Irritant'],
                    //     orient: 'vertical',
                    //     left: '5%',
                    //     top: '10%',
                    //     textStyle: { color: '#fff' },
                    //     icon: 'pin',
                    //     // selected: true
                    // },
                    {
                        name: 'Benefits',
                        data: Object.entries(categoryColors.benefits).map(([key, value]) => ({
                            name: key,
                            color: value,
                        })).map((name) => name),
                        orient: 'vertical',
                        right: '5%',
                        top: '17%',
                        textStyle: { color: '#fff' },
                        icon: 'pin',
                    },
                    {
                        name: 'Categories',
                        data: Object.entries(categoryColors.categories).map(([key, value]) => ({
                            name: key,
                            color: value,
                        })).map((name) => name),
                        orient: 'vertical',
                        left: '5%',
                        top: '17%',
                        textStyle: { color: '#fff' },
                        icon: 'pin',
                        selected: Object.fromEntries(Object.keys(categoryColors.categories).map(key => [key, false]))
                    }
                ],
                series: [
                    {
                        type: 'graph',
                        layout: 'force',
                        data: nodes,
                        links: links,
                        // center: ['0%', '100%'], // 设置初始位置为容器中心
                        // categories: categories.map(c => ({ name: c })),
                        categories: [
                            {
                                name: 'Ingredient',
                                itemStyle: {
                                    color: categoryColors.ingredient.Ingredient,
                                }
                            },
                            ...Object.entries(categoryColors.benefits).map(([name, color]) => ({
                                name,
                                itemStyle: {
                                    color,
                                }
                            })),
                            ...Object.entries(categoryColors.categories).map(([name, color]) => ({
                                name,
                                itemStyle: {
                                    color,
                                }
                            })),
                        ],
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
                            width: 5
                        },
                        nodeScaleRatio: 0.6,
                        force: {
                            repulsion: 128,
                            gravity: 0.1,
                            edgeLength: [0, 17],
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
                            position: 'right',
                            distance: 3,
                            align: 'left',
                            color: 'white',
                            fontWeight: 'bolder',
                            formatter: (params) => {
                                const { category, name } = params.data;
                                if (category === 'Ingredient') {
                                    return symbolIngredients.includes(name) ? name : '';
                                } else if (Object.keys(categoryColors.benefits).includes(category)) {
                                    // 处理 benefits 类别
                                    return name;
                                } else {
                                    // 处理其他类别
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
                symbolSize: (category === 'Ingredient') ? (symbolIngredients.includes(node.properties.id) ? 11 : 6) : 30,
                itemStyle: {
                    color: symbolIngredients.includes(node.properties.id) ? 'white' : categoryColors[category]
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
                    'MATCH path=(i:Ingredient)-[r]->(b)\nRETURN path'
                );
                const data = convertNeo4jDataToEchartsData(paths);
                displayEchartsGraph(data.nodes, data.links, data.categories);

            } catch (err) {
                console.log(`Connection error\n${err}\nCause: ${err.cause}`);
            }
        });

        return {};
    },
});
</script>

<style scoped></style>