import React from 'react'

const AutoloadMixin = {
    // TODO: it'd be nice if this handled binding `load` to dispatch
    componentDidMount() {
        this._autoload(this.props.params)
    },
    componentWillReceiveProps({ params }) {
        if (this.props.params !== params) {
            this._autoload(params)
        }
    },
    _autoload(params) {
        if (this.props.load) {
            this.props.load(params)
        } else {
            throw Error('AutoloadMixin required you to implement a `load` method')
        }
    }
}

export default AutoloadMixin
