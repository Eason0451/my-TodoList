export let todoList =[
    {
        category:"工作",
        default:true,
        show:true,
        todo:[]
    },
];
todoList=JSON.parse(localStorage.getItem("todoList"))||todoList;


let idCount =JSON.parse(localStorage.getItem("id"))|| 0;
export function addTodoList(input,dateValue,categoryItem){
    idCount++;
    localStorage.setItem("id",idCount);
    categoryItem.todo.push({
        name:input,
        done:false,
        date: dateValue? dateValue:null,
        id:idCount
    });
    categoryItem.show=true;
    save();
}
export function deletTodoItem(array,id){
    const index = array.todo.findIndex(item=>item.id===id)
    array.todo.splice(index,1);
    save();
}

export function finishTodoItem(index,checkboxValue,item){
    if(checkboxValue){
        item.done=true;
    }else{
        item.done=false;
    }
    save();
}

export function addCategoryName(categoryName){
    todoList.push({
        category:categoryName,
        default:false,
        show:true,
        todo:[]
    })
    save();
}

export function deleCategory(category){
    todoList=todoList.filter(item=>item.category!==category );
    save();
}


export function editCategoryName(newName,oldName){
    const array = todoList.find(item=>item.category===oldName);
    array.category=newName;
    save();
}

function save(){
    localStorage.setItem("todoList",JSON.stringify(todoList));
}