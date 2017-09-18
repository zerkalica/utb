// @flow
import {mem} from 'lom_atom'
import {createReactWrapper, Injector} from 'reactive-di'
import {Component} from 'react-stubs'

import {BrowserLocationStore, AbstractLocationStore} from './todomvc/common-todomvc'

function ErrorableView({
    error
}: {
    error: Error
}) {
    return <div>
        {error instanceof mem.Wait
            ? <div>
                Loading...
            </div>
            : <div>
                <h3>Fatal error !</h3>
                <div>{error.message}</div>
                <pre>
                    {error.stack.toString()}
                </pre>
            </div>
        }
    </div>
}

export default createReactWrapper(
    Component,
    ErrorableView,
    new Injector([
        [AbstractLocationStore, new BrowserLocationStore(location, history)]
    ])
)
