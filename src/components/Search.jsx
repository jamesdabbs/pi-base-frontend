import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import * as P from '../reducers/properties'
import * as S from '../reducers/search'
import { search, selectSuggestion } from '../actions'
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

const fragment = (str) => {
    const parts = str.split(/[~+&|\(\)]/)
    return parts[parts.length - 1]
}

const preview = (str) => {
    // FIXME: go by word, don't break LaTeX delimiters, add ... when truncated
    return str.slice(0, 100)
}

const TypeaheadSuggestions = ({ suggestions, selected }) => (
    <div className="list-group">
        {suggestions.map((p,i) =>
            <a className={"list-group-item " + (selected == i ? "active" : "")} key={p.id} href="#">{p.name}</a>
        )}
    </div>
)

const ExampleSearches = ({ handleSearch }) => {
    let examples = [
        "compact + connected",
        "first countable + separable + ~second countable"
    ]

    return (
        <div>
            <p>Not sure where to start? Try one of these searches:</p>
            <ul>
                {examples.map(q => (
                     <li key={q}>
                         <a onClick={() => handleSearch(q)}>{q}</a>
                     </li>
                ))}
            </ul>
        </div>
    )
}

const TAB = 9, ENTER = 13, UP = 38, DOWN = 40

const loop = (n, size) => {
    if (n >= size) { return n - size }
    if (n < 0)  { return n + size }
    return n
}

const expandFragment = (q, expanded) => {
    let f = fragment(q)
    // TODO: need to replace on the right
    return q.replace(f, expanded)
}

const SearchInput = ({q, formula, suggestions, selectSuggestion, selectedSuggestion, handleSearch}) => {
    let doChange  = (e) => handleSearch(e.target.value)
    let doKeyDown = (e) => {
        if ([TAB, ENTER, UP, DOWN].includes(e.which)) { e.preventDefault() }

        switch (e.which) {
        case UP:
            return selectSuggestion(loop(selectedSuggestion - 1, suggestions.length))
        case DOWN:
            return selectSuggestion(loop(selectedSuggestion + 1, suggestions.length))
        case TAB:
        case ENTER:
            let expanded = suggestions[selectedSuggestion]
            return handleSearch(expandFragment(q, expanded.name))
        }
    }

    return (
        <div className="search-input">
            <input className   = "form-control"
                   placeholder = "Search"
                   value       = {q}
                   onChange    = {doChange}
                   onKeyDown   = {doKeyDown}/>
            {suggestions.length > 0
                ? <TypeaheadSuggestions suggestions={suggestions} selected={selectedSuggestion}/> : ""}
        </div>
    )
}

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

const Search = ({q, formula, properties, suggestions, selectSuggestion, selectedSuggestion, results, handleSearch}) => (
    <div className="search row">
        <div className="col-md-4">
            <SearchInput
                q                  = {q}
                formula            = {formula}
                properties         = {properties}
                suggestions        = {suggestions}
                selectSuggestion   = {selectSuggestion}
                selectedSuggestion = {selectedSuggestion}
                handleSearch       = {handleSearch}
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
        q:                  state.search.q,
        formula:            S.propertyIdFormula(state),
        properties:         P.propertyNames(state),
        results:            S.byFormula(state),
        selectedSuggestion: S.selectedSuggestion(state),
        suggestions:        S.propertyNameSuggestions(state,
                                                      fragment(state.search.q), 10),
    }),
    (dispatch) => ({
        handleSearch:     (q) => dispatch(search(q)),
        selectSuggestion: (n) => dispatch(selectSuggestion(n))
    })
)(Search)
