// @flow

import {Component} from 'stubs/react'

import {connect} from 'stubs/redux'
import {bindActionCreators} from 'redux'
import {deleteTodo, completeTodo} from './actions'

import {ESCAPE_KEY, ENTER_KEY} from '../../../common/interfaces'
import TodoItemViewOrig from '../../../common/TodoItemView'
import type {Todo} from './interfaces'

type ITodoItemProps = {
    todo: Todo;
    deleteTodo: (id: string) => void;
    completeTodo: (id: string) => void;
}

class TodoItemView extends Component<ITodoItemProps, {editingId: ?string, editText: string}> {
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

    destroy = () => {
        this.props.deleteTodo(this.props.todo.id)
    }

    toggle = () => {
        this.props.completeTodo(this.props.todo.id)
    }

    render() {
        const {state} = this

        return TodoItemViewOrig({
            editingId: state.editingId,
            beginEdit: this.beginEdit,
            editText: state.editText,
            submit: this.submit,
            setEditText: this.setEditText,
            setFocus: this.setFocus,
            onKey: this.onKey,
            todo: this.props.todo,
            destroy: this.destroy,
            toggle: this.toggle
        })
    }
}

function dispatchToProps(dispatch) {
    return bindActionCreators({
        deleteTodo,
        completeTodo
    }, dispatch)
}

export default connect(null, dispatchToProps)(TodoItemView)
