export let todoList =[
    {
        category:"工作",
        default:true,
        show:true,
        todo:[]
    }
];
todoList=JSON.parse(localStorage.getItem("todoList"))||todoList;


let idCount =JSON.parse(localStorage.getItem("id"))|| 0;
export function addTodoList(input,selectName,originalDate,category){
    
    idCount++;
    localStorage.setItem("id",idCount);
    category.todo.push({
        name:input.value,
        done:false,
        date: originalDate? originalDate.value:null,
        id:idCount
    });
    category.show=true;
}
export function deletTodoItem(id,itemCategory){
    const array = todoList.find(item=>item.category===itemCategory);
    let newArray = array.todo;
    const index = newArray.findIndex(item=>item.id===Number(id));
    newArray.splice(index,1);
}

export function finishTodoItem(index,checkboxValue){
    const id= Number(index);
    const item = todoList.flatMap(category=>category.todo).find(todos=>todos.id===id);
    if(checkboxValue){
        item.done=true;
    }else{
        item.done=false;
    }

}

export function addCategoryName(categoryName){
    todoList.push({
        category:categoryName,
        default:false,
        show:true,
        todo:[]
    })
}

export function deleCategory(category){
    todoList=todoList.filter(item=>item.category!==category );
}

export function reset(){
    const array = todoList.filter(item=>item.default===true);
    array.forEach((item)=>{
        item.todo=[];
    })
    todoList=array;
    idCount=0;
    localStorage.setItem("id",idCount);
}

