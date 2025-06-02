import { todoList,addTodoList,deletTodoItem,finishTodoItem,addCategoryName,deleCategory,resetID} from "./data/todo-lsit.js";
resetID();
selectOption();
titleHtml();
finishTodoHtml();
resetBtn();
deletTodoHtml();

todoList.forEach((item)=>{
    todoHtml(item.category);
})
addCategory();
// 分類清單
function selectOption(){
    let newArray = [
        ...todoList.filter(item=>item.show===true),
        ...todoList.filter(item=>item.show===false)
    ]
    let html ="";
    newArray.forEach((item)=>{
        html+=`
            <option>${item.category}</option>
        `
    })
    document.querySelector(".selectCategory").innerHTML=html;
}

// 日期按鈕
const btnDate = document.querySelector(".dateBtn");
btnDate.addEventListener("click",()=>{
dateBtnOption();
})
// 判斷日期是否展開
function dateBtnOption(){
    if(btnDate.checked){
        document.querySelector(".date").innerHTML=`
            <input class="dateInput first-row pointerEffect" type="date">
        `
    }else{
        document.querySelector(".date").innerHTML=``
    }
}

// 新增按鈕
const btnAdd=document.querySelector(".addBtn");
const date =document.querySelector(".dateBtn")
btnAdd.addEventListener("click",()=>{
    const input =document.querySelector(".input");
    const originalDate =document.querySelector(".dateInput");
    if(input.value===""){
        alert("請輸入代辦事項!!");
        return;
    }else if(date.checked&&originalDate.value===""){
        alert("請選擇完成日期或取消打勾 !!");
        return;
    }else{//新增代辦事項
        const selectName = document.querySelector(".selectCategory").value;
        const category = todoList.find(item=>item.category===selectName);
        if (!category.show){
            document.querySelector(`.eye-${selectName}`).src=" img/show.png";
        }
        addTodoList(input,selectName,originalDate,category);
        todoHtml(selectName);
        document.querySelector(".input").value="";
        document.querySelector(".dateBtn").checked=false;
    }
    dateBtnOption();
})

// 生成類別html
function titleHtml(){
    let html="";
    let defaultHtml="";
    todoList.forEach((item,index)=>{
        if(!item.default){
            html+=`
                <div class="category-block title-${item.category}">
                    <div class="category-title">
                        <div class="category-center">
                            <span class="categoryName">${item.category}</span>
                        </div>   
                         <div class="area">
                            <button data-category="${item.category}" class="categoryDeleteBtn pointerEffect">X</button>
                        </div> 
                        <img  class="eye-${item.category} show-eye pointerEffect" src="img/${item.show?"show":"hide"}.png">
                    </div>
                    <div class="todo name${item.category}">
                    </div>
                </div>
            `;
        }else {
            defaultHtml+=`
                <div class="category-block title-${item.category}">
                    <div class="category-title">
                        <div class="category-center">
                            <span class="categoryName">${item.category}</span>
                        </div>    
                        <img  class="eye-${item.category} show-eye pointerEffect" src="img/${item.show?"show":"hide"}.png">
                    </div>
                    <div class="todo name${item.category}">
                    </div>
                </div>
            `;
        }
    })
    document.querySelector(".category-default").innerHTML=defaultHtml;
    document.querySelector(".category-add").innerHTML=html;
    showOrHide();
    deletTitle();
    save();
}
// 渲染代辦事項Html
function todoHtml(optionCategory){
    // 日期文字處理 
    function dateString(todoItem){
        if(!todoItem.date){
            return "";
        }else{
            let year,mon,day;
            let dateName;
            [year,mon,day]=todoItem.date.split("-");
            dateName=`${mon}/${day}`
            return dateName;
        }
    }
    // 排序--完成在下,未完成在上
    const array = todoList.find(item=>item.category===optionCategory);
    const optionObject ={...array}
    let todoHtml="";
    if(optionObject.show){
        const todoItem =[
            ...optionObject.todo.filter(todo=>todo.done===false),
            ...optionObject.todo.filter(todo=>todo.done===true)
        ] 
        todoItem.forEach((todo)=>{
            todoHtml+=`
                <div class="item">
                    <input 
                        ${todo.done? "checked":""}
                        data-category="${optionCategory}"
                        data-id="${todo.id}"
                        class="pointerEffect finish-btn" 
                        name="finish" 
                        type="checkbox"
                    > 

                    <${todo.done? "del":"span"} class="item-name">${todo.name}</${todo.done? "del":"span"}> 
                    <span class="dateName item-name ${dateColor(todo)}">${todo.done? "<del>"+dateString(todo)+"</del>":dateString(todo)}</span> 
                    <button 
                    data-category="${optionCategory}"
                    data-id="${todo.id}"
                    class="pointerEffect item-delet-btn">
                    刪除</button>
                </div>            
            `;
             
        })
    }
    document.querySelector(`.name${optionCategory}`).innerHTML=todoHtml;
    save();
}

//日期文字顏色
function dateColor(todo){
    if(todo.date){
        const item =new Date(todo.date);
        item.setHours(0,0,0,0);
        const itemTimestamp = item.getTime()
        const today =new Date();
        const todayOnly = new Date(today.getFullYear(),today.getMonth(),today.getDate());
        const todayTimestamp = todayOnly.getTime()
        if(todo.done){
            return "date-finish-expired"
        }else if(todayTimestamp<itemTimestamp){
            return "date-not-expired" //還沒過期
        }else if(todayTimestamp===itemTimestamp){
            return "date-todoay-expired" //當天
        }else if(todayTimestamp>itemTimestamp){
            return "date-expired" //過期
        }
    }else{
        return;
    }
}

// 隱藏顯示
function showOrHide(){
    const eyeImg=document.querySelectorAll(".show-eye");
    eyeImg.forEach((item,index)=>{
        const todoItem= todoList[index];
        item.addEventListener("click",(e)=>{
            if(todoItem.show===true){
                todoItem.show=false;
                item.src="img/hide.png"
            }else if(todoItem.show===false){
                todoItem.show=true;
                item.src="img/show.png"
            }
            todoHtml(todoItem.category);
            selectOption();
        })
    })
}
// 刪除代辦事項
function deletTodoHtml(){
    document.querySelector(".second-row").addEventListener("click",(e)=>{
        
        if(e.target.matches(".item-delet-btn")){
            const itemId=e.target.dataset.id;
            const itemCategory = e.target.dataset.category;
            deletTodoItem(itemId,itemCategory);
            todoHtml(itemCategory);
        }
    })

}
// 完成代辦事項

function finishTodoHtml(){
    document.querySelector(".second-row").addEventListener("click",(e)=>{
        if(e.target.matches(".finish-btn")){
            const category=e.target.dataset.category;
            const index =e.target.dataset.id;
            const checkboxValue=e.target.checked;
            finishTodoItem(index,checkboxValue);
            todoHtml(category);
        }
    })
}
// 新增類別
function addCategory(){
    const addBtn=document.querySelector(".category-add-btn");
    const overlayInput =document.querySelector(".category-title-add");
    const overlay=document.querySelector(".overlay");
    const input =document.querySelector(".add-category-input")
    const inputCanelBtn =document.querySelector(".add-category-deltebtn");
    const inputOklBtn = document.querySelector(".add-category-addbtn");
    addBtn.addEventListener("click",()=>{
        const rect = addBtn.getBoundingClientRect();
        overlayInput.style.left=`${rect.right-12}px`;
        overlayInput.style.top=`${rect.top}px`;
        addBtn.classList.add("show");
        overlay.style.display="flex";
        setTimeout(()=>input.focus(),100);
    })
    inputCanelBtn.addEventListener("click",()=>{
        addBtn.classList.remove("show");
        overlay.style.display="none";
    })
    inputOklBtn.addEventListener("click",()=>{
        
        if(input.value===""){
            alert("請輸入欲新增類別名稱或取消")
            setTimeout(()=>input.focus(),100);
            return;
        };
        
        const repeatCheck=todoList.every(item=> item.category!==input.value);
        if(!repeatCheck){
            alert("已建立過相同類別了!!")
        }else{
            addCategoryName(input.value);
            titleHtml();
            addBtn.classList.remove("show");
            overlay.style.display="none";
            selectOption();
            input.value="";
            todoList.forEach((item)=>{
                todoHtml(item.category);
            })
        }
        
    })
}

// 刪除按鈕

function deletTitle(){
    document.querySelectorAll(".categoryDeleteBtn").forEach((btn)=>{
        btn.addEventListener("click",()=>{
            const category=btn.dataset.category
            if(confirm(`確定要刪除 "${category}" 類別嗎`)){
                deleCategory(category);
                document.querySelector(`.title-${category}`).remove();
            }
            selectOption();
        })
    })
}

// 重置按鈕
function resetBtn(){
    document.querySelector(".reset").addEventListener("click",()=>{
        if(confirm("確定要全部重置嗎?")){
            reset();
            titleHtml();
            selectOption();
        }
    })
}

function save(){
    localStorage.setItem("todoList",JSON.stringify(todoList));
}
 