// @flow

import TodoService from './TodoService'
import TodoHeaderView, {TodoHeaderService} from './TodoHeaderView'

import TodoFooterView from '../../../common/TodoFooterView'
import TodoItemView from './TodoItemView'
import TodoMainView from '../../../common/TodoMainView'

export default function TodoPerfView(
    {todoService, todoHeaderService}: {
        todoService: TodoService;
        todoHeaderService: TodoHeaderService;
    }
) {
    const todos = todoService.todos
    return <div>
        <TodoHeaderView todoHeaderService={todoHeaderService} />
        {todoService.todos.length
            ? <TodoMainView
                toggleAll={todoService.toggleAll}
                activeTodoCount={todoService.activeTodoCount}
                filteredTodos={todoService.filteredTodos}
                TodoItemView={TodoItemView}
            />
            : null
        }
        <TodoFooterView
            activeTodoCount={todoService.activeTodoCount}
            completedCount={todoService.completedCount}
            filter={todoService.filter}
            clearCompleted={todoService.clearCompleted}
        />
    </div>
}
