<template>
    <div class="wrapper">
        <div class="grid-container">
            <div v-for="cosmeticName in cosmeticNames" :key="cosmeticName" class="grid-item">
                <FlowerComponent :cosmeticName="cosmeticName" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { fetchDataFromNeo4j, convertNeo4jDataToListData, convertNeo4jDataToEchartsData } from '../data/neo4j_prepare';
import FlowerComponent  from '../components/Flower/FlowerCosmetic.vue'

export default defineComponent({
    name: 'CosmeticsList',
    components: {
        FlowerComponent
    },
    setup() {
        const cosmeticNames = ref<string[]>([]);

        onMounted(async () => {
            try {
                const paths = await fetchDataFromNeo4j(
                    'bolt://localhost:7687',
                    `MATCH path=(i:Ingredient)-[:BELONGS_TO]->(p:Preservative) RETURN path`
                );
                const data = convertNeo4jDataToEchartsData(paths);
                const preservativeNames = data.nodes.filter(item => item.id !== 'Preservative').map(item => item.name);
                console.log("DDDDDDDData", preservativeNames)
                localStorage.setItem('preservativeNames', JSON.stringify(preservativeNames));
            } catch (err) {
                console.log(`Connection error\n${err}\nCause: ${err.cause}`);
            }
            try {
                const paths = await fetchDataFromNeo4j(
                    'bolt://localhost:7687',
                    'MATCH (n:Cosmetic) RETURN n AS path ORDER BY n.reviews ASC LIMIT 100' // DESC 降序， ASC 升序
                );
                const data = convertNeo4jDataToListData(paths);
                // console.log('cosmetic_name', data);

                // 逐个渲染
                for (const name of data) {
                    cosmeticNames.value.push(name);
                    await new Promise((resolve) => setTimeout(resolve, 200)); // 模拟延迟
                }


            } catch (err) {
                console.log(`Connection error\n${err}\nCause: ${err.cause}`);
            }


        });

        return { cosmeticNames };
    },
});
</script>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    overflow-y: auto;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 20px;
    width: 100%;
    padding: 20px;
}

.grid-item {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    position: relative;
}

.grid-item>* {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>