// @flow

import type {ITodo} from './interfaces'

export default function TodoItemView(
    {todo, editingId, toggle, destroy, beginEdit, setFocus, editText, setEditText, submit, onKey}: {
        +todo: ITodo;
        +editingId: ?string;
        +toggle: () => void;
        +destroy: () => void;
        +beginEdit: () => void;
        +editText: string;
        +submit: () => void;
        +setEditText: (e: Event) => void;
        +onKey: (e: KeyboardEvent) => void;
        +setFocus: (el: ?HTMLInputElement) => void;
    }
) {
    const editing = editingId === todo.id
    return <li
        className={`${todo.completed ? 'completed ' : ' '}${editing ? 'editing' : ''}`}
    >
        <div className="view">
            <input
                className="toggle"
                type="checkbox"
                checked={todo.completed || 0}
                onClick={toggle}
            />
            <label onDoubleClick={beginEdit} onDblClick={beginEdit}>{todo.title}</label>
            <button className="destroy" onClick={destroy} />
        </div>
        {editing
            ? <input
                ref={setFocus}
                className="edit"
                value={editingId && editText || todo.title}
                onBlur={submit}
                onInput={setEditText}
                onKeyDown={onKey}
            />
            : null
        }
    </li>
}
