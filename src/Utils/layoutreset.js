
// （5.重新设置表头，使表头和表格数据统一的宽度
export const resetTableTitleWidth = ()=>{

    let tableTitle1 = document.querySelector('.ant-table.ant-table-ping-left.ant-table-has-fix-left')
    let tableTitle2 = document.querySelector('.ant-table-header.ant-table-sticky-holder')
    let tableTitle3 = document.querySelector('table thead.ant-table-thead')
    let tableBody = document.querySelector('.ant-table-body table')
    let tableScroll = document.querySelector('.ant-table-container .ant-table-sticky-scroll')
    if( tableTitle1)  tableTitle1.style.width = tableBody.clientWidth + 'px'; 
    // if( tableTitle2)  tableTitle2.style.width = tableBody.clientWidth + 'px';  
    if( tableTitle3)  tableTitle3.style.width = tableBody.clientWidth + 'px';  
    if( tableScroll)  tableScroll.style.display = 'none';  

    // 兼容5分钟水雨情 
    let tableTitle4 = document.querySelector('.ant-spin-container>.ant-table ')
    if( tableTitle4)  tableTitle4.style.width = tableBody.clientWidth + 'px'; 

    // 盒子的宽度
    let tableContainer = document.querySelector('.ant-spin-container .ant-table');
    if( tableContainer)  tableContainer.style.width = '100%';
}
export default { 
    resetTableTitleWidth, 
}
