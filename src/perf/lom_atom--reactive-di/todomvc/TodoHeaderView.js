// @flow
import {action, mem} from 'lom_atom'
import {ENTER_KEY} from '../../../common/interfaces'
import TodoService from './TodoService'
import TodoHeaderViewOrig from '../../../common/TodoHeaderView'

export class TodoHeaderService {
    @mem title: string = ''
    _todoService: TodoService

    static deps = [TodoService]

    constructor(todoService: TodoService) {
        this._todoService = todoService
    }

    @action onInput({target}: Event) {
        this.title = (target: any).value
    }

    @action onKeyDown(e: Event) {
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
    _: {},
    {todoHeaderService}: {
        todoHeaderService: TodoHeaderService;
    }
) {
    return TodoHeaderViewOrig(todoHeaderService)
}
TodoHeaderView.deps = [{
    todoHeaderService: TodoHeaderService
}]
