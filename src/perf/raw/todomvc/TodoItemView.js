// @flow

import {Component} from 'react-stubs'
import type {ITodo} from './TodoService'

const ESCAPE_KEY = 27
const ENTER_KEY = 13

export default class TodoItemView extends Component<{todo: ITodo}, {editingId: ?string, editText: string}> {
    state = {
        editingId: null,
        editText: ''
    }
    beginEdit = () => {
        this.setState({
            editText: this.props.todo.title,
            editingId: this.props.todo.id
        })
    }

    setFocus = (el: any) => {
        if (el) {
            setTimeout(() => el.focus(), 0)
        }
    }

    setEditText = (e: Event) => {
        this.setState({
            editText: (e.target: any).value
        })
    }

    cancel = () => {
        this.setState({
            // editText: '',
            editingId: null
        })
    }

    submit = () => {
        if (!this.state.editingId) {
            return
        }
        const editText = this.state.editText
        this.setState({
            // editText: '',
            editingId: null
        })
        this.props.todo.title = editText
    }

    onKey = (e: Event) => {
        if (e.which === ESCAPE_KEY) {
            e.preventDefault()
            this.cancel()
        } else if (e.which === ENTER_KEY) {
            e.preventDefault()
            this.submit()
        }
    }

    render() {
        const todo = this.props.todo
        const editing = this.state.editingId === todo.id
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
                <label onDblClick={this.beginEdit}>{todo.title}</label>
                <button className="destroy" onClick={todo.destroy} />
            </div>
            {editing
                ? <input
                    ref={this.setFocus}
                    className="edit"
                    value={(this.state.editingId && this.state.editText) || todo.title}
                    onBlur={this.submit}
                    onInput={this.setEditText}
                    onKeyDown={this.onKey}
                />
                : null
            }
        </li>
    }
}
