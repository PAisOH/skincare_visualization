<template>
  <div>
    <a style="color: #ccc;">{{ example.cosmetic_name }}</a>
    <!-- <p style="color: #ccc;" v-if="showPreservativeIndicator(index)"">{{example.ingredients}}</p> -->
    <div class="flower-container">
      <div class="flower-petal" v-for="(ingredient, index) in example.ingredients" :key="index"
        :style="petalStyles(index, ingredient)">

        <transition :name="`petal-${index}`" appear @enter="enterAnimation(index)"
          @after-enter="afterEnterAnimation(index)">
          <svg viewBox="0 0 28 263" :width="getPetalWidth(ingredient)" :height="getPetalHeight(ingredient)"
            :style="svgStyles(index)">
            <defs>
              <linearGradient :id="`gradient-${index}`" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop v-for="(benefit, i) in getBenefitColors(ingredient.benefits)" :key="`stop-${i}`"
                  :offset="`${i / (getBenefitColors(ingredient.benefits).length - 1) * 100}%`" :stop-color="benefit" />
              </linearGradient>
            </defs>
            <path :d="petalPath" :fill="`url(#gradient-${index})`" />
          </svg>
        </transition>

        <div v-if="ingredient.isPreservative" class="preservative-sphere" :style="preservativeSphereStyles(index)">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, nextTick } from 'vue';
import { fetchDataFromNeo4j, convertNeo4jDataToEchartsData } from '../../data/neo4j_prepare'
import { benefitColorsFlower } from '../../utils/const'

interface Ingredient {
  ingredient_name: string;
  rating: 'BEST' | 'GOOD' | 'AVERAGE' | 'WORST' | 'NOT RATED';
  benefits: string;
  isPreservative: boolean
}

interface Cosmetic {
  cosmetic_name: string;
  ingredients: Ingredient[];
}

// const benefitColors: Record<string, string> = {
//   'Hydration': '#3B4EE2', // 沉静的蓝色，代表水润保湿。
//   'Soothing': '#16F3CE', // 柔和的粉色，代表舒缓镇静。
//   'Anti-Aging': '#F9D78C', // 温暖的黄色，代表抗衰老。
//   'Evens Skin Tone': '#E2C8BC', // 明亮的橙色，代表均匀肤色。
//   'Dark Spot Fading': '#73C0DE', // 清新的蓝色，代表淡化斑点。
//   'Anti-Acne': '#D05D41', // 活力的红色，代表抗痘。
//   'Oil Control': '#43EB8F', // 舒缓的绿色，代表控油。
//   'Smooths Bumpy Skin': '#EA7CCC', // 温柔的紫色，代表抚平粗糙。
//   'Black head Reducing': '#D87C7C', // 醒目的红色，代表黑头清除。
//   'Pore Minimizer': '#B6A2DE', // 冷静的蓝色，代表毛孔收缩。
// };






const categoryColors: Record<string, string> = {

}



// const cosmeticName = "The Dewy Skin Cream Plumping & Hydrating Moisturizer"

export default defineComponent({
  name: 'FlowerComponent',
  props: {
    cosmeticName: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const preservativeNames: string[] = JSON.parse(localStorage.getItem('preservativeNames') || '[]');

    const example = ref<Cosmetic>({
      cosmetic_name: '',
      ingredients: []
    });

    const rotations = ref<number[]>(Array(example.value.ingredients.length));
    const initialRotation = ref(0);
    const duration = 2000;
    const petals = computed(() => {
      return Array.from({ length: example.value.ingredients.length }, (_, i) => i);
    });

    const totalDuration = computed(() => {
      return duration + (example.value.ingredients.length) * 10;
    });

    onMounted(async () => {

      try {
        const paths = await fetchDataFromNeo4j(
          'bolt://localhost:7687',
          `MATCH path=(c:Cosmetic {id: \'${props.cosmeticName}\'})-[r:USE]->(i:Ingredient) RETURN path ORDER BY r.orderIndex`
        );
        const data = convertNeo4jDataToEchartsData(paths);
        example.value = {
          cosmetic_name: data.nodes[0].id,
          ingredients: data.nodes.filter((node) => node.category === 'Ingredient').map((node) => ({
            ingredient_name: node.name,
            rating: node.rating as Ingredient['rating'],
            benefits: node.benefits,
            isPreservative: preservativeNames.includes(node.name)
          })),
        };
        if (data.nodes[0].id == 'D-Bronzi™ Bronzing Drops with Peptides') {
          console.log("@D-Bronzi", data.nodes)
        }
        // console.log("benefits", example.value.ingredients)
      } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`);
      }
    });

    function enterAnimation(index: number) {
      setTimeout(() => {
        rotations.value[index] = (360 / example.value.ingredients.length) * index + initialRotation.value;
      }, (example.value.ingredients.length - index) * 100);
    }

    onMounted(() => {
      nextTick(() => {
        enterAnimation(example.value.ingredients.length);
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
          top: '-20%',
          left: '50%',
          transform: `translate(-50%, 0) rotate(${rotation}deg) scale(${scale})`,
          width: '4px',
          height: '4px',
          backgroundColor: 'red',
          borderRadius: '50%',
          // zIndex: 1,
        };
      },
    };
  },
  methods: {
    petalStyles(index: number, ingredient: Ingredient): Record<string, string> {
      const rotation = this.rotations[index];
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
        return ['black', '#3A3931'];
      }
      return ['black'].concat((benefits.split(', ').map((benefit) => benefitColorsFlower[benefit])).reverse());
    },
    getPetalHeight(ingredient: Ingredient): string {
      // Calculate the height based on the width and the aspect ratio of the petal path
      const aspectRatio = 263 / 28;
      const width = this.getPetalWidth(ingredient).replace('%', '');
      return `${(parseInt(width) * aspectRatio) / 17}px`;
    },
  },
  data() {
    return {
      petalPath:
        'M10.1362 174.163C10.1362 217.071 13.2592 270.121 14.5405 262.209C15.8219 254.297 17.1246 232.593 18.7144 204.258C19.9958 181.42 26.6518 156.097 27.7524 132.084C29.9544 84.0421 17.1098 31.3329 3.53084 6.35132C-10.0481 -18.6303 20.3658 34.0783 14.006 94.749C11.5386 118.286 10.1362 155.687 10.1362 174.163Z',
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


/* .petal-enter-active,
.petal-leave-active {
  transition-property: opacity, transform;
} */

/* .petal-enter-from,
.petal-leave-to {
  opacity: 0;
  transform: translate(-50%, 0) rotate(0deg) scale(0);
} */
</style>