// @flow
import {Component} from 'stubs/react'
import {ENTER_KEY} from '../../../common/interfaces'
import type {ITodo} from '../../../common/interfaces'
import TodoHeaderViewOrig from '../../../common/TodoHeaderView'

interface ITodoHeaderProps {
    addTodo: (title: string) => void;
}

export default class TodoHeaderView extends Component<ITodoHeaderProps, {title: string}> {
    state = {title: ''}

    onInput = ({target}: Event) => {
        this.setState({title: (target: any).value})
    }

    onKeyDown = (e: Event) => {
        const title = this.state.title
        if (e.keyCode === ENTER_KEY && title) {
            e.preventDefault()
            const text = title.trim()
            if (text) {
                this.props.addTodo(text)
                this.setState({title: ''})
            }
        }
    }

    render() {
        return TodoHeaderViewOrig({
            onInput: this.onInput,
            title: this.state.title,
            onKeyDown: this.onKeyDown
        })
    }
}
