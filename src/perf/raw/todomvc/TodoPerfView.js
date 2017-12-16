// @flow
import {Component} from 'stubs/react'
import TodoService from './TodoService'

import TodoHeaderView from './TodoHeaderView'
import TodoItemView from './TodoItemView'

import TodoFooterView from '../../../common/TodoFooterView'
import TodoMainView from '../../../common/TodoMainView'

interface ITodoPerfProps {
    todoService: TodoService;
}

export default class TodoPerfView extends Component<ITodoPerfProps> {
    constructor(props: ITodoPerfProps, context: any) {
        super(props, context)
        props.todoService.notify = () => this.forceUpdate()
    }

    render() {
        const {todoService} = this.props
        return <div>
            <TodoHeaderView addTodo={todoService.addTodo}/>
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
}
