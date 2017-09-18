// @flow
import {Component} from 'react-stubs'
import TodoService from './TodoService'

const ENTER_KEY = 13

interface ITodoHeaderProps {
    todoService: TodoService;
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
                this.props.todoService.addTodo(text)
                this.setState({title: ''})
            }
        }
    }

    render() {
        return <header id="header">
            <h1>todos</h1>
            <input
                id="new-todo"
                placeholder="What needs to be done?"
                onInput={this.onInput}
                value={this.state.title}
                onKeyDown={this.onKeyDown}
                autoFocus={true}
            />
        </header>
    }
}
