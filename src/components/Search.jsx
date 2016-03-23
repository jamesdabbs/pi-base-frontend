import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import * as P from '../reducers/properties'
import * as S from '../reducers/search'
import { search, selectSuggestion } from '../actions'

import Formula from './Formula'
import SearchInput from './SearchInput'

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

const ExampleSearches = ({ handleSearch }) => {
    return (
        <div>
            <p>Not sure where to start? Try one of these searches:</p>
            <ul>
                {S.examples.map(q => (
                     <li key={q}>
                         <a href="#" onClick={() => handleSearch(q)}>{q}</a>
                     </li>
                ))}
            </ul>
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
