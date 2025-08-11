import { archiveList } from "../data/archiveList.js";

const rangeSearchCoverlay = document.querySelector(".overlay-hide-range");
const DateRangeSearchBlock = document.querySelector(".date-range-block");
const cancelBtn = document.querySelector(".date-range-cancelbtn");
const inputStart = DateRangeSearchBlock.querySelector(".date-start");
const inputEnd = DateRangeSearchBlock.querySelector(".date-end");
const searchBtn = DateRangeSearchBlock.querySelector(".date-range-okbtn");

// 開始區間
inputStart.addEventListener("focus",()=>{
    inputStart.type = "date";
    inputStart.showPicker();
})
inputStart.addEventListener("blur",()=>{
    if (!inputStart.value){
        inputStart.type = "text";
    }
})
// 結束區間
inputEnd.addEventListener("focus",()=>{
    inputEnd.type = "date";
    inputEnd.showPicker();
})
inputEnd.addEventListener("blur",()=>{
    if (!inputEnd.value){
        inputEnd.type = "text";
    }
})

export function dateRangeSearch(searchResult){
    return new Promise((resolve)=>{

         // 取消按鈕
        cancelBtn.onclick = ()=>{
            DateRangeSearchBlock.style.display = "none";
            rangeSearchCoverlay.style.display = "none";
            inputStart.type = "text";
            inputStart.value = "";
            inputEnd.type = "text";
            inputEnd.value = "";
            resolve(null) ;  
        }
        // 搜尋按鈕
        searchBtn.onclick = ()=>{
            const today = new Date();
            today.setHours(0,0,0,0);
            const tomorrow = today.setDate(today.getDate()+1); //stamp
            const Start = new Date(inputStart.value);
            const StartStamp = Start.getTime(); //stamp
            const endStamp = new Date(inputEnd.value).getTime(); //stamp
            const twoYear = Start.setFullYear(Start.getFullYear()+2);//stamp
            if (!inputEnd.value||!inputStart.value){
                alert("請輸入日期!!")
            }
            else if (StartStamp>=tomorrow||endStamp>=tomorrow){
                alert("無法查詢今天以後的日期!!")
            }
            else if (StartStamp>endStamp){
                alert("日期錯誤!!")
            }
            else if (endStamp>twoYear){
                alert("搜尋區間超過2年!!")
            }else{
                function itemStamp(item){
                    return new Date(item.setTime).getTime();
                }
                // let filterItem = archiveList.filter(item=>StartStamp<=itemStamp(item) && itemStamp(item)<=endStamp);
                // filterItem.sort((a,b)=>new Date(a.setTime)-new Date(b.setTime));
                
                resolve({
                    // todoItem : filterItem,
                    start : inputStart.value,
                    end : inputEnd.value
                }) ;  
                DateRangeSearchBlock.style.display = "none";
                rangeSearchCoverlay.style.display = "none";
                inputStart.type = "text";
                inputStart.value = "";
                inputEnd.type = "text";
                inputEnd.value = ""; 
   
            }
        }


    })
   
}