// @flow

export default function TodoHeaderView(
    {onInput, title, onKeyDown}: {
        +onInput: (e: Event) => void;
        +title: string;
        +onKeyDown: (e: Event) => void;
    }
) {
    return <header id="header">
        <h1>todos</h1>
        <input
            id="new-todo"
            placeholder="What needs to be done?"
            onInput={onInput}
            value={title}
            onKeyDown={onKeyDown}
            autoFocus={true}
        />
    </header>
}
