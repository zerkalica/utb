// @flow

import {action, mem} from 'lom_atom'
import TodoService from './TodoService'
interface ITodoHeaderProps {
    addTodo(title: string): void;
}

class TodoHeaderProps implements ITodoHeaderProps {
    addTodo: (title: string) => void;
}

const ENTER_KEY = 13

export class TodoHeaderService {
    @mem title: string = ''
    _todoService: TodoService

    constructor(todoService: TodoService) {
        this._todoService = todoService
    }

    @action
    onInput({target}: Event) {
        this.title = (target: any).value
    }

    onKeyDown = (e: Event) => {
        if (e.keyCode === ENTER_KEY && this.title) {
            e.preventDefault()
            const text = this.title.trim()
            if (text) {
                this._todoService.addTodo(text)
                this.title = ''
            }
        }
    }
}

export default function TodoHeaderView(
    {todoHeaderService}: {
        todoHeaderService: TodoHeaderService;
    }
) {
    return <header id="header">
        <h1>todos</h1>
        <input
            id="new-todo"
            placeholder="What needs to be done?"
            onInput={todoHeaderService.onInput}
            value={todoHeaderService.title}
            onKeyDown={todoHeaderService.onKeyDown}
            autoFocus={true}
        />
    </header>
}
