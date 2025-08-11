import { todoList,addTodoList,deletTodoItem,finishTodoItem,addCategoryName,deleCategory,editCategoryName} from "./data/todo-lsit.js";
import { archiveList,archiveItem } from "./data/archiveList.js"
import {renderTodoHtml,isDateHtml} from "./archive.js"
// 全部渲染
addCategory();
document.querySelector(".second-row").innerHTML="";
document.querySelector(".show-hide-block").innerHTML="";
todoList.forEach((item,index)=>{
    showHide(item,index);
    const position = document.querySelector(".second-row");
    insertHtml(position,"beforeend",item);
})

// first-row 渲染
function showHide(item,index){
    const showHideBlock = document.querySelector(".show-hide-block");
    let html;
    html=`
        <div class="show-block show-${item.category}">       
            <input class="show-hide-checkbox show-hide-checkbox-${item.category} finger" type="checkbox" ${item.show? "checked":""}>
            <span>${item.category}</span>
        </div>
    `
    showHideBlock.insertAdjacentHTML("beforeend",html);


    // 顯示/隱藏 功能
    const checkbox=document.querySelector(`.show-hide-checkbox-${item.category}`);
    checkbox.addEventListener("change",()=>{
        const isShow = item.show===true;
        if(!isShow){
            for(let i=index-1;i>=-1;i--){
                const lastOne = todoList[i];
                if(i===-1){
                    const dom = document.querySelector(`.second-row`);
                    item.show=true;
                    insertHtml(dom,"afterbegin",item);
                    return;
                }else if(lastOne.show){
                    const dom = document.querySelector(`.title-block-${lastOne.category}`);
                    item.show=true;
                    insertHtml(dom,"afterend",item);
                    return;
                }
            }
        }else if(isShow){
            item.show=false;
            const dom = document.querySelector(`.title-block-${item.category}`);
            dom.remove();
        }
    })
    
    
    
}


// second-row 渲染
function insertHtml(position,inserType,categoryItem){
    const categoryName = categoryItem.category;
    if(categoryItem.show){
        position.insertAdjacentHTML(`${inserType}`,titleHtml(categoryName));
        todoHtml(categoryItem);
        setButton(`.title-block-${categoryName}`)
        addTodo(categoryName);
    }else{
        return;
    }
    
}


// 生成類別html
function titleHtml(category){
    const array = todoList.find(item=>item.category===category);
    if(array.default){
        return `
            <div class="title-block title-block-${array.category}">
                <span class="category-name">${array.category}</span>
                <button class="setting-btn finger">...</button>
                <ul class="set-select hidden">
                    <li class="category-Edit finger li-onlyone"  data-category="${array.category}">編輯</li>
                </ul>
                <div class="todo-block todo-block-${array.category}">

                </div>
                <button class="add-todo-btn finger"> + 新增事項...</button>
            </div>
        `
    }else{
        return `
            <div class="title-block title-block-${array.category}">
                <span class="category-name">${array.category}</span>
                <button class="setting-btn finger">...</button>
                <ul class="set-select hidden">
                    <li class="category-Edit finger li-top"  data-category="${array.category}">編輯</li>
                    <li class="category-delete-btn finger li-bottom" data-category="${array.category}">刪除</li>
                </ul>
                <div class="todo-block todo-block-${array.category}">

                </div>
                <button class="add-todo-btn finger"> + 新增事項...</button>
            </div>
        `
    }
}

// 群組編輯按鈕
function setButton(titleBlock){
    const title = document.querySelector(titleBlock);
    const setBtn = title.querySelector(".setting-btn");
    const select = title.querySelector(".set-select");
    setBtn.addEventListener("click",(e)=>{
        e.stopPropagation(); //停止往上冒泡
        const open = setBtn.classList.contains("active");
        document.querySelectorAll(".setting-btn").forEach(b=>{
            b.classList.remove("active");
        });
        document.querySelectorAll(".set-select").forEach(menu=>{
            menu.classList.add("hidden");
        })
        if(open){
            setBtn.classList.remove("active");
        }else{
            setBtn.classList.add("active");
            select.classList.remove("hidden");
        }
    })

    // 編輯
    const editBtn = title.querySelector(".category-Edit");
    editBtn.addEventListener("click",(e)=>{
        document.querySelector('.overlay-hide').style.display="block";
        const categorySpan = title.querySelector(".category-name");
        const categoryName = categorySpan.textContent
        categorySpan.insertAdjacentHTML("afterend",`
                <div class=edit-block>
                    <input class=edit-input maxlength="10"  value="${categoryName}">              
                    <div class="edit-btn-block">
                        <button class="categoryedit-okbtn pointerEffect finger">確定</button>
                        <button class="categoryedit-cancelbtn pointerEffect finger">取消</button>
                    </div>
                </div>
            `)
        const input = title.querySelector(".edit-input")
        input.select();
        input.style.width = categorySpan.offsetWidth+10 +"px"
        input.addEventListener("input",()=>{
            const inputValue= input.value;
            categorySpan.innerHTML = inputValue
            const widthSize = categorySpan.offsetWidth;
            if(widthSize>198){    
                alert("名稱長度超出限制");
                setTimeout(() => {
                    const maxInput = inputValue.substring(0,9);
                    input.value = maxInput;
                    categorySpan.innerHTML=maxInput;
                    console.log(inputValue.substring(0,9));
                    input.style.width = widthSize+15 +"px";
                }, 50);
                input.value="123";
            }else{
                input.style.width = widthSize+15 +"px";
            }
        })        
        // 編輯->取消
        const cancelBnt = title.querySelector(".categoryedit-cancelbtn");
        cancelBnt.addEventListener("click",(e)=>{
            document.querySelector(".overlay-hide").style.display="none";
            title.querySelector(".edit-block").remove();
            categorySpan.innerHTML=categoryName;
        })
        // 編輯->確定
        const okBtn = title.querySelector(".categoryedit-okbtn"); 
        okBtn.addEventListener("click",(e)=>{
            const newName = categorySpan.innerHTML;
            const oldName = categoryName;
            const repeatCheck = todoList.every(item=>item.category!==newName);
            if (repeatCheck){
                document.querySelector(".overlay-hide").style.display="none";
                title.querySelector(".edit-block").remove();
                editCategoryName(newName,oldName);
                const oldDom = title;
                const newItem = todoList.find(item => item.category===newName);
                insertHtml(oldDom,"afterend",newItem);
                oldDom.remove();
            }else if(!repeatCheck){
                alert("種類名稱重複了!!");
                categorySpan.innerHTML=oldName;
                input.select();
            }
            
        })
    })
    // 刪除
    const deletBtn = title.querySelector(".category-delete-btn");
    const name = title.querySelector(".category-name");
    const array = todoList.find(item=>item.category===name.textContent);
    if(!array.default){
        deletBtn.addEventListener("click",(e)=>{
            const catgoryName = title.querySelector(".category-name").textContent;
            if(confirm(`確定要刪除 "${catgoryName}" 類別嗎`)){
                const deletDom = document.querySelector(`.show-${catgoryName}`)
                deleCategory(catgoryName);
                title.remove();
                deletDom.remove();
            }
        })
    }

}
// 點擊空白處關閉清單顯示
document.addEventListener("click",()=>{
    document.querySelectorAll(".setting-btn").forEach(b=>{
        b.classList.remove("active");
    });
    document.querySelectorAll(".set-select").forEach(menu=>{
        menu.classList.add("hidden");
    })
})

// 渲染代辦事項Html
function todoHtml(array){
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
    const optionObject ={...array}
    
    let todoHtml="";
    if(optionObject.show){
        const todoItem =[
            ...optionObject.todo.filter(todo=>todo.done===false),
            ...optionObject.todo.filter(todo=>todo.done===true)
        ] 

        todoItem.forEach((todo)=>{
            todoHtml+=`
                <div class="todo-item-block">
                    <input 
                        ${todo.done? "checked":""}
                        data-category="${array.category}"
                        data-id="${todo.id}"
                        class="finger finish-btn" 
                        name="finish" 
                        type="checkbox"
                    > 
                    <${todo.done? "del":"span"} class="todo-name">
                        ${todo.name}
                        ${todo.date? `<span class="dateName item-name ${dateColor(todo)}">${dateString(todo)}</span>`:"" }
                    </${todo.done? "del":"span"}> 
                   
                    <div class="todo-hide-block " style="display:none">
                        <img 
                            src="img/垃圾桶.png" 
                            class="todo-delet-btn finger"
                            data-category="${array.Category}"
                            data-id="${todo.id}"                        
                        >
                        <img 
                            src="img/打包.png" 
                            class="todo-archive-btn finger"
                            data-category="${array.Category}"
                            data-id="${todo.id}"                        
                        >
                    </div>
                </div>         
            `;
            
                    // <button 
                    //     data-category="${array.Category}"
                    //     data-id="${todo.id}"
                    //     class="finger todo-delet-btn">
                    //     刪除
                    // </button>
        })
    }
    document.querySelector(`.todo-block-${array.category}`).innerHTML=todoHtml;
    finishTodoBtn(array);
    showTodoHideBlock();
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

// 浮現刪除/封存按鈕區塊
function showTodoHideBlock(){
    const allBlock = document.querySelectorAll(".todo-item-block");

    allBlock.forEach((block)=>{
        block.addEventListener("mouseover",()=>{
            const showBlock = block.querySelector(".todo-hide-block");
            showBlock.style.display="block";
        })
        block.addEventListener("mouseout",()=>{
            const showBlock = block.querySelector(".todo-hide-block");
            showBlock.style.display="none";
        })
    })
    

}


// 完成/刪除 代辦事項
function finishTodoBtn(array){
    // 完成
    const categoryName = array.category;
    const titleDom = document.querySelector(`.title-block-${categoryName}`)
    const finishBtn = titleDom.querySelectorAll(".finish-btn")
    finishBtn.forEach((btn)=>{
        btn.addEventListener("click",()=>{
            const id = Number(btn.dataset.id);
            const todoItem = array.todo.find(item => item.id===id);
            const boxIsActive = btn.checked;
            finishTodoItem(id,boxIsActive,todoItem);
            todoHtml(array);
        })
    })

    // 刪除
    const delteBtn = titleDom.querySelectorAll(".todo-delet-btn");
    delteBtn.forEach((btn)=>{
        btn.addEventListener("click",()=>{
            const id = Number(btn.dataset.id);
            deletTodoItem(array,id);
            todoHtml(array);
        })
    })

    // 封存
    const archiveBtn = titleDom.querySelectorAll(".todo-archive-btn");
    archiveBtn.forEach((btn)=>{
        btn.addEventListener("click",()=>{
            const id = Number(btn.dataset.id);
            archiveItem(array,id);
            console.log(archiveList);
            deletTodoItem(array,id);
            todoHtml(array);
        })
    })
}

// 新增代辦事項
function addTodo(categoryName){
    const title = document.querySelector(`.title-block-${categoryName}`);
    const todoBlock = title.querySelector(".todo-block")
    const addBtn = title.querySelector(".add-todo-btn");
    const coverlay = document.querySelector(`.overlay-hide`);
    addBtn.addEventListener("click",()=>{
        let html;
        html = `
            <div class="add-todo-wrapper" >
                <div class="add-todo-list">
                    <input class="add-todo-name" >
                    <div class="date-block">
                        <input class="date-checkbox finger" type="checkbox" >
                        <span class="date-span">選擇日期</span>
                    </div>
                </div>
                <div class = "add-btn-block">
                    <button class="add-todo-okbtn finger">新增</button>
                    <button class="add-todo-cancelbtn finger">取消</button>
                </div>
                
            </div> 
        `
        coverlay.style.display="block";
        todoBlock.insertAdjacentHTML("beforeend",html);
        const input = document.querySelector(`.add-todo-name`);
        input.select();
        dateBtnOption(title);
        addTodoBtn(title,categoryName,coverlay);
    })
}

// 判斷日期是否展開
function dateBtnOption(title){
    const dateBlock = title.querySelector(".date-block");
    const checkBox = dateBlock.querySelector(".date-checkbox");
    checkBox.addEventListener("click",()=>{
        let html ;
        if(checkBox.checked){
            const span = dateBlock.querySelector(".date-span");
            html = `
                <input class="date-input" type="date">
            `
            dateBlock.insertAdjacentHTML("beforeend",html);
            span.remove();
        }else{
            const input = dateBlock.querySelector(".date-input");
             html = `
                <span class="date-span">選擇日期</span> 
            `
            dateBlock.insertAdjacentHTML("beforeend",html);
            input.remove();
        }
    })
    
}

// 新增代辦事項->新增按鈕/取消按鈕

function addTodoBtn(title,categoryName,coverlay){
    // 新增
    const addBlock = title.querySelector(".add-todo-wrapper");
    const okBtn = addBlock.querySelector(".add-todo-okbtn");
    const input = title.querySelector(".add-todo-name");
    function addItem(){
        const input = addBlock.querySelector(".add-todo-name");
        const inputValue = input.value;
        const dateIsOpen = addBlock.querySelector(".date-checkbox").checked;
        const dateDom =  addBlock.querySelector(".date-input");
        const dateValue = dateDom? dateDom.value:null;
        const categoryItem = todoList.find(item=>item.category===categoryName);
        if(inputValue===""){
            alert("請輸入代辦事項!!");
            return;
        }else if(dateIsOpen&&!dateValue){
            alert("請選擇日期或取消打勾 !!");
            return;
        }else{//新增代辦事項
            addTodoList(inputValue,dateValue,categoryItem);
            input.value="";
            addBlock.remove();
            coverlay.style.display="none";
            todoHtml(categoryItem);
        }
    }
    okBtn.addEventListener("click",()=>{
        addItem();
    })
    addBlock.addEventListener("keydown",(e)=>{
        if(e.key==="Enter"){
            addItem();
        }
    })

    // 取消
    const cancelBtn = addBlock.querySelector(".add-todo-cancelbtn");
    cancelBtn.addEventListener("click",()=>{
        addBlock.remove();
        coverlay.style.display="none";
    })

}

// 新增類別
function addCategory(){
    const overlay =document.querySelector(".overlay-hide");
    const addBlock = document.querySelector(".add-category-block");
    const addBtn= document.querySelector(".add-category-btn");
    const input = addBlock.querySelector(".add-category-input");
    const canelBtn = addBlock.querySelector(".add-category-cancelbtn");
    const oklBtn = addBlock.querySelector(".add-category-okbtn");
    // 呼叫addCategoryBlock
    addBtn.addEventListener("click",()=>{
        overlay.style.display="block";
        addBlock.style.display="flex";
        input.select();
    })
    // 取消
    canelBtn.addEventListener("click",()=>{
        overlay.style.display="none";
        addBlock.style.display="none";
    })
    // 確定
    oklBtn.addEventListener("click",()=>{
        const originalInputValue = input.value;
        const inputValue = originalInputValue.substring(0,9);
        const isRepeat = todoList.some(item => item.category===originalInputValue);
        if(originalInputValue===""){
            alert("請輸入名稱!!");
        }else if ([...originalInputValue].length>9){
            alert("名稱不可超出9個字元!!");
            input.select();
        }else if (isRepeat){
            alert("已經建立過相同名稱")
        }else {
            const insertBlock = document.querySelector(".second-row");
            addCategoryName(inputValue);
            const categoryItem = todoList.find(item=>item.category===inputValue);
            showHide(categoryItem,todoList.length);  
            insertHtml(insertBlock,"beforeend",categoryItem);
            overlay.style.display="none";
            addBlock.style.display="none";
            
            input.value =""
        }
    })
}

// 封存區按鈕
const archiveBtn = document.querySelector(".archive-btn");
archiveBtn.addEventListener("click",()=>{
    const coverlay = document.querySelector(".overlay-hide");
    const archiveBlock = document.querySelector(".archive-block");
    coverlay.style.display = "block";
    archiveBlock.style.display = "block";
    renderTodoHtml(isDateHtml(7));
})
 