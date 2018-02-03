// @flow

import {action, mem} from 'lom_atom'
import {ESCAPE_KEY, ENTER_KEY} from '../../../common/interfaces'
import TodoItemViewOrig from '../../../common/TodoItemView'
import {Todo} from './TodoRepository'

export class TodoItemService {
    @mem editingId: ?string = null
    @mem editText: string = ''

    _todo: Todo

    @action beginEdit() {
        const todo = this._todo
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
        this._todo.update({title: this.editText})
        this.editText = ''
        this.editingId = null
    }

    @action toggle() {
        this._todo.update({completed: !this._todo.completed})
    }

    @action onKey(e: KeyboardEvent) {
        if (e.which === ESCAPE_KEY) {
            this.cancel()
        } else if (e.which === ENTER_KEY) {
            this.submit()
        }
    }
}

const editCache = Symbol('editCache')
export default function TodoItemView({todo}: {+todo: Todo}) {
    let srv: TodoItemService = (todo: Object)[editCache]
    if (!srv) {
        srv = new TodoItemService()
        srv._todo = todo
        ;(todo: Object)[editCache] = srv
    }

    const {beginEdit, onKey, submit, setEditText, setFocus, editingId, editText, toggle} = srv

    return TodoItemViewOrig({
        onKey, submit, setEditText, setFocus, editingId, editText,
        beginEdit,
        todo,
        destroy: todo.delete,
        toggle
    })
}
