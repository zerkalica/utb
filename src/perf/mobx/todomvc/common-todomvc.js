// @flow
export function uuid(): string {
    let uuid = ''

    for (let i = 0; i < 32; i++) {
        let random = Math.random() * 16 | 0
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += '-'
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16)
    }

    return uuid
}

export function pluralize(count: number, word: string): string {
    return count === 1 ? word : word + 's'
}

export class AbstractLocationStore {
    location(key: string, value?: string, force?: boolean): string {
        throw new Error('implement')
    }
}

export class BrowserLocationStore extends AbstractLocationStore {
    _location: Location
    _history: History
    _ns: string = 'mobx_app'

    constructor(location: Location, history: History) {
        super()
        this._location = location
        this._history = history
    }

    _params(): URLSearchParams {
        return new URLSearchParams(this._location.search)
    }

    location(key: string, value?: string, force?: boolean): string {
        const params = this._params()
        if (value === undefined) return params.get(key)

        params.set(key, value)
        this._history.pushState(null, this._ns, `?${params.toString()}`)

        return value
    }
}
