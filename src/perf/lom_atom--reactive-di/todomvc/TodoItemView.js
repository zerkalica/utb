// @flow

import {props} from 'reactive-di'
import {action, mem} from 'lom_atom'
import {ESCAPE_KEY, ENTER_KEY} from '../../../common/interfaces'
import TodoItemViewOrig from '../../../common/TodoItemView'
import {Todo} from './TodoService'

interface ITodoItemProps {
    +todo: Todo;
}

class TodoItemService {
    @mem editingId: ?string = null
    @mem editText: string = ''

    @props props: ITodoItemProps

    @action beginEdit() {
        const {todo} = this.props
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
        const {todo} = this.props
        todo.title = this.editText
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

export default function TodoItemView(
    {todo}: ITodoItemProps,
    {todoItemService}: {todoItemService: TodoItemService}
) {
    return TodoItemViewOrig({
        ...todoItemService,
        todo,
        destroy: todo.destroy,
        toggle: todo.toggle
    })
}
TodoItemView.deps = [{
    todoItemService: TodoItemService
}]
