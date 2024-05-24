<template>
  <div>
  <div id="max-chart" style="width: 50%; height: 600px; display: inline-block;"></div>
  <div id="min-chart" style="width: 50%; height: 600px; display: inline-block;"></div>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import * as echarts from "echarts";

export default defineComponent({
  setup() {
    const maxData = [
      [30, 50, 40],
      [15, 30, 22.5],
      [26, 30, 28],
      [12, 20, 16],
      [3, 6, 4.5],
      [1.5, 2.5, 2],
    ];
    const minData = [
      [30, 50, 40],
      [15, 30, 22.5],
      [26, 30, 28],
      [12, 20, 16],
      [3, 6, 4.5],
      [1.5, 2.5, 2],
    ];
    const lipidTypes = [
      "Glycerides",
      "Fatty acids",
      "Wax esters",
      "Squalene",
      "Cholesterol esters",
      "Cholesterol",
    ];

    const maxOption = {
      title: {
        text: "皮脂成分最大值",
      },
      grid: {
        top: 100,
      },
      xAxis: {
        type: "category",
        data: lipidTypes,
        axisLabel: {
          rotate: 30,
          fontSize: 12,
          color: "#C0B199",
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        max: 50,
        min: 0,
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      series: [
        {
          type: "pictorialBar",
          barCategoryGap: "-130%",
          symbol:
            "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
          itemStyle: {
            color: "#C0B199",
            opacity: 0.5,
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
            },
          },
          data: maxData.map((item) => item[1]),
          z: 10,
        },
      ],
    };

    const minOption = {
      title: {
        text: "皮脂成分最小值",
      },
      grid: {
        top: 100,
      },
      xAxis: {
        type: "category",
        data: lipidTypes,
        axisLabel: {
          rotate: 30,
          fontSize: 12,
          color: "#6F6459",
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        max: 50,
        min: 0,
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      series: [
        {
          type: "pictorialBar",
          barCategoryGap: "-130%",
          symbol:
            "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
          itemStyle: {
            color: "#6F6459",
            opacity: 0.5,
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
            },
          },
          data: minData.map((item) => item[0]),
          z: 10,
        },
      ],
    };

    onMounted(() => {
      const maxChart = echarts.init(document.getElementById("max-chart"));
      maxChart.setOption(maxOption);

      const minChart = echarts.init(document.getElementById("min-chart"));
      minChart.setOption(minOption);
    });

    return {};
  },
});
</script>

<style scoped>
#max-chart, #min-chart {
  display: inline-block;
  width: 50%;
  height: 600px;
}
</style>