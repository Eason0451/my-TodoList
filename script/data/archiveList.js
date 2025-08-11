export let archiveList = JSON.parse(localStorage.getItem("archiveList"))||[];

function saveList(){
    localStorage.setItem("archiveList",JSON.stringify(archiveList));
}

// 刪除封存事項

export function deletTodoItem(id){
    archiveList.splice(id,1);
}
        
export function archiveItem(array,id){
    const archiveItem = array.todo.filter(item=>item.id===id);
    const archiveTodo = archiveItem[0];
    archiveList.push({
        name : archiveTodo.name,
        done : archiveTodo.done,
        finishDate : archiveTodo.date ? archiveTodo.date:null,
        id : id,
        setTime : archiveTodo.setTime
    })
    saveList();
}