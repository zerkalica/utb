// @flow

import {Component} from 'stubs/react'
import {ESCAPE_KEY, ENTER_KEY} from '../../../common/interfaces'
import TodoItemViewOrig from '../../../common/TodoItemView'
import {Todo} from './TodoRepository'

export default class TodoItemView extends Component<{todo: Todo}, {editingId: ?string, editText: string}> {
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
        const {todo} = this.props
        const state = this.state

        return TodoItemViewOrig({
            editingId: state.editingId,
            beginEdit: this.beginEdit,
            editText: state.editText,
            submit: this.submit,
            setEditText: this.setEditText,
            setFocus: this.setFocus,
            onKey: this.onKey,
            todo: todo,
            destroy: todo.destroy,
            toggle: todo.toggle
        })
    }
}
