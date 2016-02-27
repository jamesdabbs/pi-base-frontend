import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as P from '../reducers/properties'
import { search } from '../actions'

String.prototype.reverse = function() {
  return this.split('').reverse().join('');
}
String.prototype.regexIndexOf = function( pattern, startIndex ) {
  startIndex = startIndex || 0;
  var searchResult = this.substr( startIndex ).search( pattern );
  return ( -1 === searchResult ) ? -1 : searchResult + startIndex;
}
String.prototype.regexLastIndexOf = function( pattern, startIndex ) {
  startIndex = startIndex === undefined ? this.length : startIndex;
  var searchResult = this.substr( 0, startIndex ).reverse().regexIndexOf( pattern, 0 );
  return ( -1 === searchResult ) ? -1 : this.length - ++searchResult;
}

const closeParens = (str) => {
    var stack = [], str = ""+str, el;
    str.split("").map(function(c) {
        if (c === '{') {
            stack.push('}')
        } else if (c === '[') {
            stack.push(']')
        } else if (c === '}' || c === ']') {
            stack.pop()
        }
    });
    while (el = stack.pop()) { str += el }
    return str
}

const fragment = (str) => {
    var fragment, sep = str.regexLastIndexOf(/[,\[]/)
    if (sep == -1) {
      return str
    } else {
      return str.slice(sep + 1, str.length)
    }
}

const propertySuggestions = (pmap, q) => {
    return []
}

class Search extends Component {
    render () {
        return (
            <div className="search">
                <h1>Search</h1>
                <input onChange={this.props.handleSearch}/>
                <pre>Properties: {JSON.stringify(this.props.propertyNames)}</pre>
                <pre>Q: {this.props.q}</pre>
                <pre>Closed: {closeParens(this.props.q)}</pre>
                <pre>Fragment: {fragment(this.props.q)}</pre>
                <pre>Suggestions: {propertySuggestions(this.props.propertyNames, this.props.q)}</pre>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        propertyNames: P.propertyNames(state),
        q:             state.search || ""
    }),
    (dispatch) => ({
        handleSearch: (e) => dispatch(search(e.target.value))
    })
)(Search)
