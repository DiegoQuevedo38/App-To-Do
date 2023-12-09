let todoItems = []
const todoInput = document.querySelector(".todo-input")
const completedTodosDiv = document.querySelector(".completed-todos")
const uncompletedTodosDiv = document.querySelector(".uncompleted-todos")


window.onload = () => {
    let storageTodoItems = localStorage.getItem("todoItems")
    if(storageTodoItems !== null) {
        todoItems = JSON.parse(storageTodoItems)
    }
    render()
}

todoInput.onkeyup = ((e) => {
    let value = e.target.value.replace(/^\s+/, "")
    if(value && e.keyCode === 13) {
        addTodo(value)

        todoInput.value = ""
        todoInput.focus()
    }
})

function addTodo(todoText){
    const newTodo = ({
        id: todoItems.length + 1,
        text: todoText,
        completed: false,
    })

    todoItems.push(newTodo)
    saveAndRender()
}


function removeTodo(id){
    todoItems = todoItems.filter(todo => todo.id !== Number(id))
    saveAndRender()
}

function markCompleted(id){
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = true
        }

        return todo
    })

    saveAndRender()
}


function markUncompleted(id){
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = false
        }

        return todo
    })
    saveAndRender()
}

function save(){
    localStorage.setItem("todoItems", JSON.stringify(todoItems))
}

function render(){
    let uncompletedTodos = todoItems.filter(item => !item.completed)
    let completedTodos = todoItems.filter(item => item.completed)

    completedTodosDiv.innerHTML = ''
    uncompletedTodosDiv.innerHTML = ''

    if(uncompletedTodos.length > 0){
        uncompletedTodos.forEach(todo => {
            uncompletedTodosDiv.append(createTodoItem(todo))
        })
    } else {
        uncompletedTodosDiv.innerHTML = `<div class='empty'>No hay To-Dos pendientes</div>`
    }

    if(completedTodos.length > 0){
    completedTodosDiv.innerHTML = `<div class='completed-title'>Completadas (${completedTodos.length} / ${todoItems.length}) </div>`
    completedTodos.forEach(todo => {
        completedTodosDiv.append(createTodoItem(todo))
    })
    }
}


function createTodoItem(todo){
    const todoDiv = document.createElement('div')
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = 'todo-item'

    const todoTextSpan = document.createElement('span')
    todoTextSpan.innerHTML = todo.text

    const todoInputCheckbox = document.createElement('input')
    todoInputCheckbox.type = 'checkbox'
    todoInputCheckbox.checked = todo.completed
    todoInputCheckbox.onchange = (e) => {
        let id = e.target.closest('.todo-item').dataset.id;
        e.target.checked ? markCompleted(id) : markUncompleted(id)
    }
    const todoRemoveButton = document.createElement('a')
    todoRemoveButton.href = '#'
    todoRemoveButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
    </svg>`

    todoRemoveButton.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id;
        removeTodo(id)
    }

    todoTextSpan.prepend(todoInputCheckbox)
    todoDiv.appendChild(todoTextSpan)
    todoDiv.appendChild(todoRemoveButton)

    return todoDiv

}


function saveAndRender(){
    save()
    render()
}