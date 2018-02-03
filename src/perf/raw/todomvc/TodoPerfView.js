// @flow
import {Component} from 'stubs/react'
import TodoRepository from './TodoRepository'

import TodoHeaderView from './TodoHeaderView'
import TodoItemView from './TodoItemView'

import TodoFooterView from '../../../common/TodoFooterView'
import TodoMainView from '../../../common/TodoMainView'

interface ITodoPerfProps {
    todoRepository: TodoRepository;
}

export default class TodoPerfView extends Component<ITodoPerfProps> {
    constructor(props: ITodoPerfProps, context: any) {
        super(props, context)
        props.todoRepository.notify = () => this.forceUpdate()
    }

    render() {
        const {todoRepository} = this.props
        return <div>
            <TodoHeaderView addTodo={todoRepository.addTodo}/>
            {todoRepository.todos.length
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
}
