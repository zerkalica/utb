// @flow
import atomize from '../atomize'
import {action, mem, props} from 'lom_atom'

interface ITodoHeaderProps {
    addTodo(title: string): void;
}

const ENTER_KEY = 13

class TodoToAdd {
    @mem title: string = ''
    @props _props: ITodoHeaderProps

    @action
    onInput({target}: Event) {
        this.title = (target: any).value
    }

    onKeyDown = (e: Event) => {
        if (e.keyCode === ENTER_KEY && this.title) {
            e.preventDefault()
            const text = this.title.trim()
            if (text) {
                this._props.addTodo(text)
                this.title = ''
            }
        }
    }
}

export default function TodoHeaderView(
    _: ITodoHeaderProps,
    {todoToAdd}: {
        todoToAdd: TodoToAdd;
    }
) {
    return <header id="header">
        <h1>todos</h1>
        <input
            id="new-todo"
            placeholder="What needs to be done?"
            onInput={todoToAdd.onInput}
            value={todoToAdd.title}
            onKeyDown={todoToAdd.onKeyDown}
            autoFocus={true}
        />
    </header>
}
TodoHeaderView.deps = [{todoToAdd: TodoToAdd}]
