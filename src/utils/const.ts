// 越改越丑
// const benefitColorMap = {
//     'Ingredient': '#BFC4C4',
//     'Hydration': '#3B4EE2',
//     'Soothing': '#91cc75',
//     'AntiAging': '#FAC858',
//     'EvensSkinTone': '#FFA07A',
//     'DarkSpotFading': '#9C0BA9',
//     'AntiAcne': '#E0231D', //FF6347
//     'OilControl': '#43EB8F',
//     'SmoothsBumpySkin': '#FF57C6',
//     'BlackheadReducing': '#8B008B',
//     'PoreMinimizer': '#00BFFF'
// };

const benefitColorMap = {
    "Ingredient": "#BFC4C4",
    "Hydration": "#3B4EE2",
    "AntiAging": "#fac858",
    "Soothing": "#91cc75",

    "EvensSkinTone": "#E3A1AB",
    "DarkSpotFading": "#73c0de",
  
    "AntiAcne": "#EF3405",
    "OilControl": "#43EB8F",
    "SmoothsBumpySkin": "#ea7ccc",
    "BlackheadReducing": "#FF8103",
    "PoreMinimizer": "#b6a2de"
  };

// 阴暗孟菲斯
// const benefitColorMap = {
//     "Ingredient": "#BFC4C4",
//     "Hydration": "#1A2F65",
//     "AntiAging": "#8D74AF",
//     "Soothing": "#6DAA6A",
//     "EvensSkinTone": "#9B754B",
//     "DarkSpotFading": "#73c0de",
  
//     "AntiAcne": "#BC4456",
//     "OilControl": "#F4B837",
//     "SmoothsBumpySkin": "#5A3F80",
//     "BlackheadReducing": "#FF8103",
//     "PoreMinimizer": "#b6a2de"
//   };

// 孟菲斯
// const benefitColorMap = {
//     "Ingredient": "#ccc",
//     "Hydration": "#99AECC", //
//     "AntiAging": "#EEE9C3", //
//     "Soothing": "#B8E0CD", // 

//     "DarkSpotFading": "#67596A", 
//     "EvensSkinTone": "#E3A1AB", 
  
//     "AntiAcne": "#BF577A", 
//     "OilControl": "#CAB919", 

//     "PoreMinimizer": "#4E91A0", 
//     "SmoothsBumpySkin": "#BC33C4",
//     "BlackheadReducing": "#AE8B91",
//   };

// const benefitColorMap = {
//     "Ingredient": "#C4C4C4",
//     "Hydration": "#6D8299",
//     "Soothing": "#A2B48C",
//     "AntiAging": "#CFBB9E",
//     "EvensSkinTone": "#9B9382",
//     "DarkSpotFading": "#87A3B1",
  
//     "AntiAcne": "#B35C53",
//     "OilControl": "#7D9A7F", 
//     "SmoothsBumpySkin": "#C8AEBC",
//     "BlackheadReducing": "#C5A183",
//     "PoreMinimizer": "#AEA1B8"
//   };

// const benefitColorMap = {
//     "Ingredient": "#F0F0F0",
//     "Hydration": "#91C4F2",
//     "Soothing": "#B6EADA",
//     "AntiAging": "#FFC97E",
//     "EvensSkinTone": "#CDB4DB",
//     "DarkSpotFading": "#B8E8FC",
  
//     "AntiAcne": "#FF8BA0",
//     "OilControl": "#ABDEE6",
//     "SmoothsBumpySkin": "#FFCBCB",
//     "BlackheadReducing": "#FFF1D0",
//     "PoreMinimizer": "#D8C3A5"
//   };

// const benefitColorMap = {
//     "Ingredient": "#ECECEC",
//     "Hydration": "#94B0DA",
//     "Soothing": "#BAD1C6",
//     "AntiAging": "#EFAF9F",
//     "EvensSkinTone": "#D8B5A6",
//     "DarkSpotFading": "#A6B1E1",
  
//     "AntiAcne": "#ED6A5A",
//     "OilControl": "#7AB8A7", 
//     "SmoothsBumpySkin": "#FAAC9F",
//     "BlackheadReducing": "#F7D716",
//     "PoreMinimizer": "#B4A9C2"
//   };

  export const benefitColors = {
    ...benefitColorMap
  };
  
  export const benefitColorsFlower: Record<string, string> = {
    'Hydration': benefitColorMap['Hydration'],
    'Soothing': benefitColorMap['Soothing'],
    'Anti-Aging': benefitColorMap['AntiAging'],
    'Evens Skin Tone': benefitColorMap['EvensSkinTone'],
    'Dark Spot Fading': benefitColorMap['DarkSpotFading'],
    'Anti-Acne': benefitColorMap['AntiAcne'],
    'Oil Control': benefitColorMap['OilControl'],
    'Smooths Bumpy Skin': benefitColorMap['SmoothsBumpySkin'],
    'Blackhead Reducing': benefitColorMap['BlackheadReducing'],
    'Pore Minimizer': benefitColorMap['PoreMinimizer']
  };