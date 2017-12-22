// @flow
import {props} from 'reactive-di'
import {observable, action} from 'mobx'
import {ESCAPE_KEY, ENTER_KEY} from '../../../common/interfaces'
import TodoItemViewOrig from '../../../common/TodoItemView'
import {Todo} from './TodoService'

interface ITodoItemProps {
    +todo: Todo;
}

export class TodoItemService {
    @observable editingId: ?string = null
    @observable editText: string = ''

    @props _props: ITodoItemProps

    beginEdit = () => {
        this.editText = this._props.todo.title
        this.editingId = this._props.todo.id
    }

    setFocus = (el: any) => {
        if (el) {
            setTimeout(() => el.focus(), 0)
        }
    }

    setEditText = action((e: Event) => {
        this.editText = (e.target: any).value
    })

    cancel() {
        // this.editText = ''
        this.editingId = null
    }

    submit = action(() => {
        if (!this.editingId) return
        this._props.todo.title = this.editText
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

export default function TodoItemView(
    {todo}: ITodoItemProps,
    {todoItemService: {beginEdit, onKey, submit, setEditText, setFocus, editingId, editText}}: {todoItemService: TodoItemService}
) {
    return TodoItemViewOrig({
        beginEdit, onKey, submit, setEditText, setFocus, beginEdit, editingId, editText,
        todo,
        destroy: todo.destroy,
        toggle: todo.toggle
    })
}
TodoItemView.deps = [{
    todoItemService: TodoItemService
}]
