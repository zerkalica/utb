// @flow

import {action, mem} from 'lom_atom'
import type {ITodo} from './TodoService'

const ESCAPE_KEY = 27
const ENTER_KEY = 13

export class TodoItemService {
    @mem editingId: ?string = null
    @mem editText: string = ''

    _todo: ITodo

    beginEdit = (todo: ITodo) => {
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

const todoItemService = new TodoItemService()

export default function TodoItemView(
    {todo}: {
        todo: ITodo;
    }
) {
    const editing = todoItemService.editingId === todo.id
    return <li
        className={`${todo.completed ? 'completed ' : ' '}${editing ? 'editing' : ''}`}
    >
        <div className="view">
            <input
                className="toggle"
                type="checkbox"
                checked={todo.completed || 0}
                onClick={todo.toggle}
            />
            <label onDblClick={() => todoItemService.beginEdit(todo)}>{todo.title}</label>
            <button className="destroy" onClick={todo.destroy} />
        </div>
        {editing
            ? <input
                ref={todoItemService.setFocus}
                className="edit"
                value={todoItemService.editingId && todoItemService.editText || todo.title}
                onBlur={todoItemService.submit}
                onInput={todoItemService.setEditText}
                onKeyDown={todoItemService.onKey}
            />
            : null
        }
    </li>
}
