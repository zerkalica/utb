// @flow

import {action, observable} from 'mobx'
import {observer} from 'stubs/mobx'

import {ESCAPE_KEY, ENTER_KEY} from '../../../common/interfaces'
import type {ITodo} from '../../../common/interfaces'
import TodoItemViewOrig from '../../../common/TodoItemView'
import {Todo} from './TodoService'

export class TodoItemService {
    @observable editingId: ?string = null
    @observable editText: string = ''

    _todo: ITodo

    @action beginEditTodo(todo: ITodo) {
        this._todo = todo
        this.editText = todo.title
        this.editingId = todo.id
    }

    setFocus = action((el: any) => {
        if (el) {
            setTimeout(() => el.focus(), 0)
        }
    })

    setEditText = action((e: Event) => {
        this.editText = (e.target: any).value
    })

    @action cancel() {
        this.editText = ''
        this.editingId = null
    }

    submit = action(() => {
        if (!this.editingId) return
        this._todo.title = this.editText
        this.editText = ''
        this.editingId = null
    })

    onKey = action((e: Event) => {
        if (e.which === ESCAPE_KEY) {
            this.cancel()
        } else if (e.which === ENTER_KEY) {
            this.submit()
        }
    })
}

const todoItemService = new TodoItemService()
const editCache = Symbol('editCache')
function TodoItemView(
    {todo}: {todo: Todo}
) {
    let beginEdit: ?() => void = (todo: Object)[editCache]
    if (!beginEdit) {
        ;(todo: Object)[editCache] = beginEdit = () => todoItemService.beginEditTodo(todo)
    }
    const {onKey, submit, setEditText, setFocus, editingId, editText} = todoItemService
    return TodoItemViewOrig({
        onKey, submit, setEditText, setFocus, editingId, editText,
        beginEdit,
        todo,
        destroy: todo.destroy,
        toggle: todo.toggle
    })
}

export default observer(TodoItemView)
