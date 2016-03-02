import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import * as P from '../reducers/properties'
import * as S from '../reducers/search'
import { search } from '../actions'
import Formula from './formula'

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
        if (c === '(') {
            stack.push(')')
        } else if (c === ')') {
            stack.pop()
        }
    });
    while (el = stack.pop()) { str += el }
    return str
}

const fragment = (str) => {
    let fragment, sep = str.regexLastIndexOf(/[~+&|\(\)]/)
    if (sep == -1) {
      return str.trim()
    } else {
      return str.slice(sep + 1, str.length).trim()
    }
}

const preview = (str) => {
    // FIXME: go by word, don't break LaTeX delimiters, add ... when truncated
    return str.slice(0, 100)
}

const TAB = 9, ENTER = 13, UP = 38, DOWN = 40

const handleKeyDown = (e) => {
    if ([TAB, ENTER, UP, DOWN].includes(e.which)) {
        e.preventDefault()
    }
}

const TypeaheadSuggestions = ({ suggestions }) => (
    <div className="list-group">
        {suggestions.map(p =>
            <a className="list-group-item" key={p.id} href="#">{p.name}</a>
        )}
    </div>
)

const ExampleSearches = ({ handleSearch }) => {
    let doSearch = (term) => () => handleSearch(term)
    let search = (term) => {
        return (<li key={term}><a onClick={doSearch(term)}>{term}</a></li>)
    }

    return (
        <div>
            <p>Not sure where to start? Try one of these searches:</p>
            <ul>
                {search("compact + connected")}
                {search("first countable + separable + ~second countable")}
            </ul>
        </div>
    )
}

const SearchInput = ({q, formula, suggestions, handleSearch}) => (
    <div className="search-input">
        <input className   = "form-control"
               placeholder = "Search"
               value       = {q}
               onChange    = {(e) => handleSearch(e.target.value)}
               onKeyDown   = {handleKeyDown}/>
        {suggestions.length > 0
            ? <TypeaheadSuggestions suggestions={suggestions}/> : ""}
    </div>
)

const SearchResults = ({results, formula, properties}) => (
    <div>
        <h3>
            {results.size} Spaces ∋ {" "}
            <Formula formula={formula} properties={properties}/>
        </h3>
        {results.valueSeq().map((space) => (
             <div key={space.id}>
                 <h4><Link to={"spaces/" + space.id}>{space.name}</Link></h4>
                 <p>{preview(space.description)}</p>
             </div>
        ))}
    </div>
)

const Search = ({q, formula, properties, suggestions, results, handleSearch}) => (
    <div className="search row">
        <div className="col-md-4">
            <SearchInput
                q            = {q}
                formula      = {formula}
                properties   = {properties}
                suggestions  = {suggestions}
                handleSearch = {handleSearch}
            />
        </div>
        <div className="col-md-8">
            {formula ? <SearchResults
                formula    = {formula}
                results    = {results}
                properties = {properties}
            /> : <ExampleSearches handleSearch={handleSearch}/>}
        </div>
    </div>
)

export default connect(
    (state) => ({
       q:           state.search.q,
       formula:     S.propertyIdFormula(state),
       properties:  P.propertyNames(state),
       suggestions: S.propertyNameSuggestions(state, fragment(state.search.q), 10),
       results:     S.byFormula(state)
    }),
    (dispatch) => ({
        handleSearch: (q) => dispatch(search(q))
    })
)(Search)
