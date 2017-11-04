// @flow

import atomize from '../atomize'

import TodoService from './TodoService'
import type {ITodo} from './TodoService'
import TodoFilterService from './TodoFilterService'

import TodoHeaderView from './TodoHeaderView'
import TodoFooterView from './TodoFooterView'
import TodoItemView from './TodoItemView'

function TodoPerfView(
    _: {},
    {todoService, todoFilterService}: {
        todoService: TodoService;
        todoFilterService: TodoFilterService;
    }
) {
    const todos = todoService.todos
    return <div>
        <TodoHeaderView addTodo={todoService.addTodo}/>
        {todos.length
            ? <section id="main">
                <input
                    id="toggle-all"
                    type="checkbox"
                    onChange={todoService.toggleAll}
                    checked={todoService.activeTodoCount === 0}
                />
                <ul id="todo-list">
                    {todoFilterService.filteredTodos.map((todo: ITodo) =>
                        <TodoItemView
                            key={todo.id}
                            todo={todo}
                        />
                    )}
                </ul>
            </section>
            : null
        }

        {todoService.activeTodoCount || todoService.completedCount
            ? <TodoFooterView
                count={todoService.activeTodoCount}
                completedCount={todoService.completedCount}
                nowShowing={todoFilterService.filter}
                onClearCompleted={todoService.clearCompleted}
            />
            : null
        }
    </div>
}
TodoPerfView.deps = [{
    todoService: TodoService,
    todoFilterService: TodoFilterService
}]
export default (TodoPerfView)
