<template>
    <div id="main" style="width: 100%; height: 100%">
        <!-- <a style="color: #ccc;">{{ example.cosmetic_name }}</a> -->
        <div class="flower-container">
            <div class="flower-petal" v-for="(item, index) in example" :key="index"
                :style="petalStyles(index, item.ingredient)">

                <transition :name="`petal-${index}`" appear @enter="enterAnimation(index)"
                    @after-enter="afterEnterAnimation(index)" style=" margin-top: -100px;">
                    <div>
                        <!-- ingredient_name 文字 -->
                        <!-- <div v-for="benefit in ingredient.benefits" :key="`${ingredient.ingredient_name}-${benefit}`" style="color: #ffffff; font-size: 1px; display: inline-block;"> {{ benefit }}</div> -->
                        <p :style="{ color: item.ingredient.isPreservative ? 'red' : '#ffffff', fontSize: `${1.7 / getScaleFactor(item.ingredient.rating)}px`, fontWeight: 'bold' }"
                            v-html="formatIngredientName(item.ingredient.ingredient_name)"></p>

                        <!-- svg -->
                        <svg viewBox="0 0 60 263" :width="getPetalWidth(item.ingredient)"
                            :height="getPetalHeight(item.ingredient)">
                            <defs>
                                <linearGradient :id="`gradient-${index}`">
                                    <stop v-for="(benefit, i) in getBenefitColors(item.ingredient.benefits)"
                                        :key="`stop-${i}`"
                                        :offset="`${i / (getBenefitColors(item.ingredient.benefits).length - 1) * 100}%`"
                                        :stop-color="benefit" />
                                </linearGradient>
                            </defs>
                            <path :d="petalPath" :fill="`url(#gradient-${index})`" />
                            <circle v-if="item.ingredient.isPreservative" cx="60%" cy="5%" r="10" fill="red" />
                        </svg>
                        <!-- count 文字 -->
                        <!-- <p
                            :style="{ position: absolute, color: item.ingredient.isPreservative ? 'red' : '#ffffff', fontSize: `${1.7 / getScaleFactor(item.ingredient.rating)}px`, fontWeight: 'bold' }">
                            {{ item.count }}</p> -->
                    </div>
                </transition>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, nextTick } from 'vue';
import { fetchDataFromNeo4j, convertNeo4jDataToDictData } from '../../data/neo4j_prepare'
import { benefitColorsFlower } from '../../utils/const'
import { IngredientCount, Ingredient } from '../../models/cosmeticModels';

export default defineComponent({
    // name: 'FlowerLovingIngredientsComponent',
    props: {
        cosmeticName: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const preservativeNames: string[] = JSON.parse(localStorage.getItem('preservativeNames') || '[]');

        const example = ref<IngredientCount[]>([]);

        const rotations = ref<number[]>(Array(example.value.length));
        const initialRotation = ref(0);
        const duration = 2000;
        const petals = computed(() => {
            return Array.from({ length: example.value!.length }, (_, i) => i);
        });

        const totalDuration = computed(() => {
            return duration + (example.value.length) * 10;
        });

        onMounted(async () => {

            try {
                const paths = await fetchDataFromNeo4j(
                    'bolt://localhost:7687',
                    // `MATCH (i:Ingredient)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC  RETURN [i, useCount] as path LIMIT 50`
                    // `MATCH (i: Ingredient)-[:HAS_BENEFIT]->(:Hydration) MATCH (i)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC  RETURN [i, useCount] as path LIMIT 50`
                    // `MATCH (i: Ingredient)-[:HAS_BENEFIT]->(:AntiAging) MATCH (i)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC  RETURN [i, useCount] as path LIMIT 50`
                    // `MATCH (i: Ingredient)-[:BELONGS_TO]->(:UVFilters) MATCH (i)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC RETURN [i, useCount] as path`
                    // `MATCH (i: Ingredient)-[:HAS_BENEFIT]->(:AntiAcne) MATCH (i)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC  RETURN [i, useCount] as path`
                    // `MATCH (i: Ingredient)-[:HAS_BENEFIT]->(:EvensSkinTone) MATCH (i)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC  RETURN [i, useCount] as path LIMIT 50`
                    // `MATCH (i: Ingredient)-[:HAS_BENEFIT]->(:DarkSpotFading) MATCH (i)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC  RETURN [i, useCount] as path LIMIT 50`
                    // `MATCH (i: Ingredient)-[:HAS_BENEFIT]->(:BlackheadReducing) MATCH (i)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC  RETURN [i, useCount] as path` 
                    // `MATCH (i: Ingredient)-[:HAS_BENEFIT]->(:PoreMinimizer) MATCH (i)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC  RETURN [i, useCount] as path` 
                    // `MATCH (i: Ingredient)-[:HAS_BENEFIT]->(:OilControl) MATCH (i)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC  RETURN [i, useCount] as path` 
                    `MATCH (i: Ingredient)-[:HAS_BENEFIT]->(:Soothing) MATCH (i)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC  RETURN [i, useCount] as path LIMIT 50` 
                    // `MATCH (i: Ingredient)-[:BELONGS_TO]->(:CleansingAgent) MATCH (i)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC RETURN [i, useCount] as path LIMIT 50`
                    // `MATCH (i: Ingredient)-[:BELONGS_TO]->(:Preservative) MATCH (i)<-[r:USE]-() WITH i, count(r) as useCount ORDER BY useCount DESC RETURN [i, useCount] as path LIMIT 50`
                    );
                console.log("@dbq", paths)
                const data = convertNeo4jDataToDictData(paths);
                example.value = paths.map(([_node, _count]) => ({
                    ingredient: {
                        ingredient_name: _node.properties.id,
                        rating: _node.properties.rating,
                        benefits: _node.properties.benefits,
                        isPreservative: preservativeNames.includes(_node.properties.id)

                    } as Ingredient,
                    count: _count.low
                }));
                console.log("@@@333@@", example.value)
            } catch (err) {
                console.log(`Connection error\n${err}\nCause: ${err.cause}`);
            }
        });

        function enterAnimation(index: number) {
            setTimeout(() => {
                rotations.value[index] = (180 / example.value.length) * index + initialRotation.value;
            }, (example.value.length - index) * 100);
        }

        onMounted(() => {
            nextTick(() => {
                enterAnimation(example.value.length);
            });
        });

        return {
            example,
            rotations,
            initialRotation,
            duration,
            petals,
            totalDuration,
            enterAnimation,
            preservativeSphereStyles(index: number): Record<string, string> {
                const rotation = this.rotations[index];
                const scale = 1; // Adjust the scale factor as needed
                return {
                    position: 'absolute',
                    // top: '50%',
                    left: '50%',
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
                    width: '4px',
                    height: '4px',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                    // transform: `translateY(-50%)`,
                    // zIndex: 2,
                    zIndex: '2'
                };
            },
        };
    },
    methods: {
        petalStyles(index: number, ingredient: Ingredient): Record<string, string> {
            const rotation = this.rotations[index] + 1.7 * index;
            const scale = this.getScaleFactor(ingredient.rating);
            return {
                transform: `translate(-50%, 0) rotate(${rotation}deg) scale(${scale})`,
                transitionDuration: `${this.totalDuration}ms`,
                transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
            };
        },
        svgStyles(index: number): Record<string, string> {
            return {
                transform: `translateY(-50%)`,
            };
        },
        afterEnterAnimation(index: number) {
            this.rotations[index] = this.initialRotation;
        },
        getScaleFactor(rating: Ingredient['rating']): number {
            switch (rating) {
                case 'BEST':
                    return 2;
                case 'GOOD':
                    return 1.5;
                case 'AVERAGE':
                    return 1;
                case 'WORST':
                    return 0.60;
                case 'NOT RATED':
                    return 1;
                default:
                    return 1;
            }
        },
        getPetalWidth(ingredient: Ingredient): string {
            return '100%';
        },
        getBenefitColors(benefits: string): string[] {
            if (!benefits) {
                return ['#3A3931'];
            }
            return ((benefits.split(', ').map((benefit) => benefitColorsFlower[benefit])).reverse());
        },
        getPetalHeight(ingredient: Ingredient): string {
            // Calculate the height based on the width and the aspect ratio of the petal path
            const aspectRatio = 263 / 28;
            const width = this.getPetalWidth(ingredient).replace('%', '');
            return `${(parseInt(width) * aspectRatio) / 38}px`;
        },
        formatIngredientName(name) {
            return name.replace(/\s/g, '<br>');
        },
        adjustPetalHeight(ingredient) {
            const petalHeight = this.getPetalHeight(ingredient);
            return `${petalHeight}px`;
        }
    },
    data() {
        return {
            petalPath:
                'M1.5 37.5C2.69778 48.9913 6.9795 65.1972 15.5001 73C27.34 83.8424 45.7967 83.6576 61 78.5C81.4743 71.5542 86.2647 45.0347 77 25.5C68.0877 6.70836 47.5877 -4.75914 28.5 3.5C13.3171 10.0695 -0.215069 21.0459 1.5 37.5Z',
        };
    },
});
</script>

<style scoped>
.flower-container {
    position: relative;
    width: 100%;
    height: 50%;
    /* padding-bottom: 100%; */
    display: flex;
    justify-content: center;
    align-items: center;
}


.flower-petal {
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 50%;
    transform: translate(-50%, 0);
}
</style>