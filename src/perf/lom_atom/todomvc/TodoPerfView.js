// @flow

import TodoRepository from './TodoRepository'
import TodoHeaderView, {TodoHeaderService} from './TodoHeaderView'

import TodoFooterView from '../../../common/TodoFooterView'
import TodoItemView from './TodoItemView'
import TodoMainView from '../../../common/TodoMainView'

export default function TodoPerfView(
    {todoRepository, todoHeaderService}: {
        todoRepository: TodoRepository;
        todoHeaderService: TodoHeaderService;
    }
) {
    return <div>
        <TodoHeaderView todoHeaderService={todoHeaderService} />
        {todoRepository.todos.length > 0
            ? <TodoMainView
                toggleAll={todoRepository.toggleAll}
                activeTodoCount={todoRepository.activeTodoCount}
                filteredTodos={todoRepository.filteredTodos}
                TodoItemView={TodoItemView}
            />
            : null
        }
        <TodoFooterView
            activeTodoCount={todoRepository.activeTodoCount}
            completedCount={todoRepository.completedCount}
            filter={todoRepository.filter}
            clearCompleted={todoRepository.clearCompleted}
        />
    </div>
}
