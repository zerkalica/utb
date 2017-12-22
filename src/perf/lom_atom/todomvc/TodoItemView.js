// @flow

import {action, mem} from 'lom_atom'
import {ESCAPE_KEY, ENTER_KEY} from '../../../common/interfaces'
import type {ITodo} from '../../../common/interfaces'
import TodoItemViewOrig from '../../../common/TodoItemView'
import {Todo} from './TodoService'

class TodoItemService {
    @mem editingId: ?string = null
    @mem editText: string = ''

    _todo: ITodo

    @action beginEditTodo(todo: ITodo) {
        this._todo = todo
        this.editText = todo.title
        this.editingId = todo.id
    }

    @action.defer setFocus(el: ?HTMLInputElement) {
        if (el) el.focus()
    }

    @action setEditText(e: Event) {
        this.editText = (e.target: any).value
    }

    @action cancel() {
        this.editText = ''
        this.editingId = null
    }

    @action submit() {
        if (!this.editingId) return
        this._todo.title = this.editText
        this.editText = ''
        this.editingId = null
    }

    @action onKey(e: KeyboardEvent) {
        if (e.which === ESCAPE_KEY) {
            this.cancel()
        } else if (e.which === ENTER_KEY) {
            this.submit()
        }
    }
}

const srv = new TodoItemService()
const editCache = Symbol('editCache')
export default function TodoItemView({todo}: {+todo: Todo}) {
    let beginEdit: ?() => void = (todo: Object)[editCache]
    if (!beginEdit) {
        ;(todo: Object)[editCache] = beginEdit = () => srv.beginEditTodo(todo)
    }
    const {onKey, submit, setEditText, setFocus, editingId, editText} = srv

    return TodoItemViewOrig({
        onKey, submit, setEditText, setFocus, editingId, editText,
        beginEdit,
        todo,
        destroy: todo.destroy,
        toggle: todo.toggle
    })
}
