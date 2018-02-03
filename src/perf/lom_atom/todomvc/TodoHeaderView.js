// @flow

import {action, mem} from 'lom_atom'
import {ENTER_KEY} from '../../../common/interfaces'

import TodoRepository from './TodoRepository'
import TodoHeaderViewOrig from '../../../common/TodoHeaderView'

export class TodoHeaderService {
    @mem title: string = ''
    _todoRepository: TodoRepository

    constructor(todoRepository: TodoRepository) {
        this._todoRepository = todoRepository
    }

    @action onInput({target}: Event) {
        this.title = (target: any).value
    }

    @action onKeyDown(e: Event) {
        if (e.keyCode === ENTER_KEY && this.title) {
            e.preventDefault()
            const text = this.title.trim()
            if (text) {
                this._todoRepository.addTodo(text)
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
    return TodoHeaderViewOrig(todoHeaderService)
}
