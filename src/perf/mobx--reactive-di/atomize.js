// @flow
import {createReactWrapper, createMobxDetached, Injector} from 'reactive-di'
import {Component} from 'react-stubs'
import {Reaction} from 'mobx'
import {AtomWait, BrowserLocationStore, AbstractLocationStore} from './todomvc/common-todomvc'

function ErrorableView({
    error
}: {
    error: Error
}) {
    return <div>
        {error instanceof AtomWait
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
    createMobxDetached(Reaction),
    new Injector([
        [AbstractLocationStore, new BrowserLocationStore(location, history)]
    ])
)
