import React, { Component }from 'react'
import { connect } from 'react-redux'

import * as Search from '../reducers/search'
import { getFragment, replaceFragment } from '../util'

const TAB = 9, ENTER = 13, UP = 38, DOWN = 40

// Some things to ponder:
// * Should this have a handler that _only_ fires when the
//   formula parses?
// * Is it okay to have e.g. the selection state in this component?
//   It seems like overkill to have to specfically mount those
//   selections in the application state.
const FormulaInput = React.createClass({
    propTypes: {
        // input fields:
        suggestions: React.PropTypes.array.isRequired,
        suggestionLimit: React.PropTypes.number.isRequired
    },
    getInitialState: function() {
        return { selected: 0 }
    },
    changeSelection: function(diff) {
        const curr  = this.state.selected
        const limit = this.props.suggestionLimit
        const next  = (((curr + diff) % limit) + limit) % limit // fix for negatives
        this.setState({ selected: next })
    },
    doKeyDown: function(e) {
        if ([TAB, ENTER, UP, DOWN].includes(e.which)) { e.preventDefault() }

        switch (e.which) {
        case UP:
            return this.changeSelection(-1)
        case DOWN:
            return this.changeSelection(1)
        case TAB:
        case ENTER:
            const selected = this.props.suggestions[this.state.selected]
            this.setState({ selected: 0 })
            return this.props.onChange(replaceFragment(this.props.value, selected))
        }
    },
    render: function() {
        return (
            <div>
                <input
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    onKeyDown={this.doKeyDown}
                    {...this.props}
                />
                {this.props.suggestions.length > 0
                  ? <PropertySuggestions suggestions={this.props.suggestions} selected={this.state.selected}/> : ''}
            </div>
        )
    }
})

const PropertySuggestions = ({ suggestions, selected }) => (
    <div className="list-group">
        {suggestions.map((p,i) =>
            <a className={"list-group-item " + (selected == i ? "active" : "")} key={p.id} href="#">{p.name}</a>
        )}
    </div>
)

export default connect(
    (state, ownProps) => {
        const suggestionLimit = ownProps.suggestionLimit || 10
        const fragment = getFragment(ownProps.value)

        return {
            suggestionLimit: suggestionLimit,
            suggestions:     Search.propertyNameSuggestions(state, fragment, suggestionLimit)
        }
    }
)(FormulaInput)
