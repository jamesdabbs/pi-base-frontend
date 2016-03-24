import React, { Component }from 'react'
import { connect } from 'react-redux'

import * as Formula from '../formula'
import * as Search from '../reducers/search'
import { getFragment, replaceFragment } from '../util'

const TAB = 9, ENTER = 13, UP = 38, RIGHT = 39, DOWN = 40

// Some things to ponder:
// * Should this have a handler that _only_ fires when the
//   formula parses?
// * Is it okay to have e.g. the selection state in this component?
//   It seems like overkill to have to specfically mount those
//   selections in the application state.
const FormulaInput = React.createClass({
    propTypes: {
        // TODO: add the others ...
        suggestions:     React.PropTypes.array.isRequired,
        suggestionLimit: React.PropTypes.number.isRequired
    },
    getInitialState: function() {
        return { selected: 0, dropdownVisible: false }
    },
    changeSelection: function(diff) {
        this.setSelection(this.state.selected + diff)
    },
    setSelection: function(to) {
        const limit = this.props.suggestionLimit
        const next  = ((to % limit) + limit) % limit
        this.setState({ selected: next })
    },
    expandFragmentAt: function(index) {
        const selected = this.props.suggestions[index]
        this.setState({ selected: 0, dropdownVisible: false })
        return this.props.onChange(
            this.parse(replaceFragment(this.props.value.raw, selected))
        )
    },
    parse: function(raw) {
        return {
            raw:    raw,
            parsed: Formula.parse(raw)
        }
    },
    doKeyDown: function(e) {
        if ([ENTER, UP, DOWN].includes(e.which)) { e.preventDefault() }

        switch (e.which) {
        case UP:
            return this.changeSelection(-1)
        case DOWN:
            return this.changeSelection(1)
        case ENTER:
            return this.expandFragmentAt(this.state.selected)
        }
    },
    doChange: function(e) {
        this.props.onChange(this.parse(e.target.value))
        this.setState({ dropdownVisible: true })
    },
    doBlur: function(e) {
        this.props.onBlur(this.parse(e.target.value))
        this.setState({ dropdownVisible: false })
    },
    render: function() {
        return (
            <div>
                <input
                    type        = "text"
                    autoComplete= "off"
                    className   = "form-control"
                    {...this.props}
                    value     = {this.props.value && this.props.value.raw}
                    onKeyDown = {this.doKeyDown}
                    onChange  = {this.doChange}
                    onBlur    = {this.doBlur}
                />
                <PropertySuggestions
                    visible     = {this.state.dropdownVisible}
                    suggestions = {this.props.suggestions}
                    selected    = {this.state.selected}
                    onSelect    = {this.expandFragmentAt}
                />
            </div>
        )
    }
})

const PropertySuggestions = ({ suggestions, selected, visible, onSelect}) => {
    const divStyle = {
        display:   (visible ? 'block' : 'none'),
        position:  'absolute',
        width:     '100%', // FIXME
        marginTop: '5px'
    }

    return (
        <div className="list-group" style={divStyle}>
            {suggestions.map((p,i) =>
                <a className={"list-group-item " + (selected == i ? "active" : "")}
                   key={p.id}
                   onMouseDown={() => onSelect(i)}
                   href="#">
                    {p.name}
                </a>
            )}
        </div>
    )
}

export default connect(
    (state, ownProps) => {
        const suggestionLimit = ownProps.suggestionLimit || 10
        const raw = ownProps.value ? ownProps.value.raw : ""
        const fragment = getFragment(raw)

        return {
            suggestionLimit: suggestionLimit,
            suggestions:     Search.propertyNameSuggestions(state, fragment, suggestionLimit)
        }
    }
)(FormulaInput)
