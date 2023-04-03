
// 水量类型数据
export const waterData = [{"stcd":"0721141130","stnm":"闸室","sttp":"RR"},{"stcd":"0721141131","stnm":"新泉站","sttp":"RR"},{"stcd":"0721141132","stnm":"厂房站","sttp":"RR"}]
// 雨量类型数据
export const rainData = [{"stcd":"0062336500","stnm":"王狗冲","drp":0.0},{"stcd":"0062336540","stnm":"老庵里","drp":0.0},{"stcd":"0062336560","stnm":"新泉站","drp":0.0},{"stcd":"0062336600","stnm":"西江口","drp":0.0},{"stcd":"0062336640","stnm":"张佳坊","drp":0.0} ]
// ,{"stcd":"0721141130","stnm":"闸室  ","drp":0.0},{"stcd":"0721141131","stnm":"新泉站","drp":0.5},{"stcd":"0721141132","stnm":"厂房  ","drp":0.0}]

// 定时变化的时长
export const refreshDelay = 5 * 60 * 1000
// 图表色彩字体
export const colorChartArr = {
    c1: "rgb(226, 79, 53)", // 红
    c2: "rgb(231, 201, 26)", // 绿 
    c3: "rgb(26, 98, 231)",// 绿
    c4: "rgb(240, 10, 28)",// 粉 
    c5: "rgb(168, 130, 133)", // 棕
    c6: "rgb(146, 53, 53)", // 浅棕
} 
// 形状和字体颜色
export const shapeChartArr = {
    s1: {
        color:"rgba(226, 79, 53,1)", // 红
        symbol:"triangle"  // 三角形
    },
    s2: {
        color:"rgba(231, 201, 26,1)",// 绿 
        symbol:"circle"
    }, 
    s3: {
        color:"rgba(26, 98, 231,1)",// 绿
        symbol:"rect"
    },
    s4: {
        color:"rgba(240, 20, 20,1)",// 粉   
        symbol:"roundRect"
    },
    s5:{
        color: "rgba(168, 160, 180,1)",// 棕
        symbol:"diamond"
    }, 
    s6: {
        color:"rgba(146, 153, 153,1)", // 浅棕
        symbol:"triangle"
    }, 
    s7: {
        color:"rgba(255, 153, 153,1)", // 浅棕1
        symbol:"circle"
    }, 
    s8: {
        color:"rgba(116, 133, 103,1)", // 浅棕2
        symbol:"roundRect"
    }, 
    // 圆形、矩形、圆角矩形、三角形、菱形、大头针形、箭头形
    // 'circle'、'rect'、'roundRect'、'triangle'、'diamond'、'pin'、'arrow'。
} 
// 顶部跳转的链接
export const dumpWebPages = {
    bigPage:'http://117.40.228.164:8888/BigDisplay'
}
// 默认的项目接口域名
export const defaultDomain = {
    domain:'http://117.40.228.164:8889'
}
   
// 默认的云平台域名 （当前域名）
export const currentDomain = {
    domain:'http://117.40.228.164:8891'
} 

export default {
    projectName :"水雨情自动测报系统__",
    waterData,
    rainData,
    refreshDelay,
    colorChartArr,shapeChartArr,
    dumpWebPages,
    defaultDomain, 
    currentDomain
} 