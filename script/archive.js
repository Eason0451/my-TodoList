import {archiveDateOption} from "./data/archive-date-option.js"
import { archiveList,deletTodoItem } from "./data/archiveList.js";
import {dateRangeSearch} from "./rangesearch/range.js"


const leaveBtn = document.querySelector(".archive-leave-btn");
const dateLeftBTN = document.querySelector(".archive-left");
const dateRightBtn = document.querySelector(".archive-right");
const name = document.querySelector(".archive-range-name");


// 離開按鈕
leaveBtn.addEventListener("click",()=>{
    name.dataset.num ="1";
    let index = name.dataset.num;
    closeSearch();
    const coverlay = document.querySelector(".overlay-hide");
    const archiveBlock = document.querySelector(".archive-block");
    coverlay.style.display = "none";
    archiveBlock.style.display = "none";
    dateLeftBTN.style.display="block";
    dateRightBtn.style.display="block";
    
    name.innerHTML=archiveDateOption[Number(index)].name;
})
// 左邊區間按鈕
dateLeftBTN.addEventListener("click",()=>{
    const index = Number(name.dataset.num);
    const newName = archiveDateOption[index-1].name
    name.innerHTML= newName;
    name.dataset.num=`${index-1}`;
    const days = archiveDateOption[index-1].day
    rangeName(name);
    renderTodoHtml(isDateHtml(days));
})
// 右邊區間按鈕
dateRightBtn.addEventListener("click",()=>{
    const index = Number(name.dataset.num)
    const newName = archiveDateOption[index+1].name
    name.innerHTML= newName;
    name.dataset.num=`${index+1}`;
    const days = archiveDateOption[index+1].day
    rangeName(name);
    renderTodoHtml(isDateHtml(days));
})
// 區間樣式
function rangeName(name){
    const index = name.dataset.num;
    if (index==="0"){
        dateLeftBTN.style.display="none";
        dateRightBtn.style.display="block";
        name.classList="archive-range-name";
        name.classList.add("left");
    }else if (index===String(archiveDateOption.length-2)){
        dateLeftBTN.style.display="block";
        dateRightBtn.style.display="none";
        name.classList="archive-range-name";
        name.classList.add("right");
    }else if (index===String(archiveDateOption.length-1)){
        dateLeftBTN.style.display="none";
        dateRightBtn.style.display="none";
        name.classList="archive-range-name";
        name.classList.add("search");
    }else{
        dateLeftBTN.style.display="block";
        dateRightBtn.style.display="block";
        name.classList="archive-range-name";
    }
}
// 日期搜尋
export function isDateHtml(days,start,end){
    let index = Number(name.dataset.num);
    if(typeof days==="number"){
        const today = new Date();
        today.setHours(0,0,0,0)
        const date = today.setDate(today.getDate()-days+1);
        const fliterItem = archiveList.filter(item=>new Date(item.setTime)>=date);
        console.log(archiveList);
        return fliterItem
    }else if(days="all"){
        return archiveList
    }
    else{
        const startStamp = new Date(start);
        const endtStamp = new Date(end);
        const fliterItem = archiveList.filter(item=> new Date(item.setTime)>=startStamp&&new Date(item.setTime)<=endtStamp);
        return fliterItem
    }

}
// 渲染事項
export function renderTodoHtml(array){
    let html="";
    const sortItem = array.sort((a,b)=> new Date(a.setTime)-new Date(b.setTime));
    sortItem.forEach((item)=>{
// <button class="archive-detail-delet finger" data-id=${item.id}>刪除</button>
        html+=`
            <div class="archive-detail item${item.id} finger">
                <input class="archive-detail-delet finger" data-id=${item.id} type="checkbox">
                <span class="archive-detail-todo">${item.name}</span>
                <span class="archive-detail-date">${item.setTime}</span>
            </div>
        `
    })
    document.querySelector(".archive-todo-block").innerHTML=html;
}

// 搜尋按鈕
const searchBtn = document.querySelector(".archive-search");
const searchInput = document.querySelector(".search-input");
const inputCancel = document.querySelector(".input-cancel");
const moreBtn = document.querySelector(".archive-more-btn");
searchBtn.addEventListener("click",()=>{
    const index = Number(name.dataset.num);
    if(index===archiveDateOption.length-1){
        name.classList="archive-range-name";
        name.classList.add("search");
        name.classList.add("close");
    }else{
        name.classList="archive-range-name";
    }
    dateLeftBTN.style.display="none";
    dateRightBtn.style.display="none";

    searchInput.style.display="block";
    void searchInput.offsetWidth;
    searchInput.classList.add("open");
    searchBtn.classList.remove("finger");
    setTimeout(()=>{
        inputCancel.style.display="block";
    },300);
    moreBtn.classList.add("search");
    searchInput.select();
})
// 離開搜尋按鈕

searchInput.style.display="none";
inputCancel.style.display="none";
function closeSearch(){
    const index = Number(name.dataset.num);
    const days = archiveDateOption[index].day;
    searchInput.value="";
    inputCancel.style.display="none";
    searchInput.classList.remove("open");
    searchInput.classList.add("close");
    setTimeout(()=>{
        searchInput.style.display="none";
        searchInput.classList.remove("close");
        rangeName(name);
        moreBtn.classList="archive-more-btn finger";
        searchBtn.classList.add("finger");
    },300);
    const start = archiveDateOption[archiveDateOption.length-1].start;
    const end = archiveDateOption[archiveDateOption.length-1].end;
    renderTodoHtml(isDateHtml(days,start,end));
}
inputCancel.addEventListener("click",()=>{
    closeSearch();
})

// 搜尋
searchInput.addEventListener("input",()=>{
    const inputValue = searchInput.value;
    const index = Number(name.dataset.num);
    const days = archiveDateOption[index].day;
    const start = archiveDateOption[archiveDateOption.length-1].start;
    const end = archiveDateOption[archiveDateOption.length-1].end;
    const filterItem = isDateHtml(days,start,end).filter(item=>item.name.includes(inputValue)||item.setTime.includes(inputValue));
    renderTodoHtml(filterItem);
})
// 區間搜尋
const RangeSearchBtn = document.querySelector(".archive-more-btn") ;
const rangeSearchCoverlay = document.querySelector(".overlay-hide-range");
const DateRangeSearchBlock = document.querySelector(".date-range-block");

RangeSearchBtn.addEventListener("click",()=>{
    closeSearch();
    rangeSearchCoverlay.style.display="block";
    DateRangeSearchBlock.style.display = "block";

    function dateSearchResult(result){
        if(result){
            name.dataset.num = String(archiveDateOption.length-1);
            let index = name.dataset.num;
            const start = result.start;
            const end = result.end;
            const days = archiveDateOption[Number(index)].day;
            dateLeftBTN.style.display="none";
            dateRightBtn.style.display="none";
            name.innerHTML=`
                ${start} ~${end}
            `
            name.classList.add("search");
            renderTodoHtml(isDateHtml(days,start,end));
            archiveDateOption[archiveDateOption.length-1].start = start;
            archiveDateOption[archiveDateOption.length-1].end = end;
        }
    }
    dateRangeSearch().then(dateSearchResult);
})


// 刪除按鈕
// function setDeletBtn(){
//     const deletBtn = document.querySelectorAll(".archive-detail-delet");
//     deletBtn.forEach((btn)=>{
//         btn.addEventListener("click",(e)=>{
//             const id = btn.dataset.id;
//             const todoBlcok = document.querySelector(".archive-todo-block");
//             const todo = btn.parentElement;
//             todo.remove();
//             const deletTodoItemId = archiveList.findIndex(item=>item.id===Number(id));
//             deletTodoItem(deletTodoItemId);
//         })
//     })
// }
