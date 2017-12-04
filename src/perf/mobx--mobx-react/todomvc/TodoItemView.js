// @flow

import {action, observable} from 'mobx'
import {observer} from 'mobx-stubs'
import type {ITodo} from './TodoService'

const ESCAPE_KEY = 27
const ENTER_KEY = 13

export class TodoItemService {
    @observable editingId: ?string = null
    @observable editText: string = ''

    _todo: ITodo

    beginEdit = (todo: ITodo) => {
        this._todo = todo
        this.editText = todo.title
        this.editingId = todo.id
    }

    setFocus = (el: any) => {
        if (el) {
            setTimeout(() => el.focus(), 0)
        }
    }

    setEditText = action((e: Event) => {
        this.editText = (e.target: any).value
    })

    cancel = action(() => {
        this.editText = ''
        this.editingId = null
    })

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

function TodoItemView(
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

export default observer(TodoItemView)
