import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import * as P from '../reducers/properties'
import { searchByFormula } from '../reducers'
import { search } from '../actions'

import formulaParser from '../formula-parser.pegjs'

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
    let suggestions = []
    for(let name in pmap) {
        if (name.toLowerCase().includes(q)) {
            suggestions.push(name)
        }
    }
    return suggestions
}

const sepWith = (delimiter) => (componentArray) => {
    let result = []
    componentArray.map((comp,i) => {
        result.push(comp)
        result.push(<span key={'sepWith' + i}> {delimiter} </span>)
    })
    result.pop()
    return result
}

const FormulaDisplay = ({ formula, properties }) => {
    if (!formula) { return (<span/>) }

    if (formula.property) {
        var label = properties.get(parseInt(formula.property))
        if (formula.value === false) {
            label = "¬" + label
        }
        return (<Link to={"property/"+formula.property}>{label}</Link>)
    } else if (formula.and) {
        return (
            <span>({sepWith("∧")(formula.and.map((sf, i) =>
                <FormulaDisplay key={i} formula={sf} properties={properties}/>
            ))})</span>
        )
    } else if (formula.or) {
        return (
            <span>({sepWith("∨")(formula.or.map((sf, i) =>
                <FormulaDisplay key={i} formula={sf} properties={properties}/>
            ))})</span>
        )
    }
    return (<span/>)
}

class SearchInput extends Component {
    render () {
        return (
            <div>
                <input className="form-control" placeholder="Search" onChange={this.props.handleSearch}/>
                <pre>{JSON.stringify(this.props.formula)}</pre>
            </div>
        )
    }
}

const preview = (str) => {
    // FIXME: go by word, don't break LaTeX delimiters, add ... when truncated
    return str.slice(0, 100)
}

const SearchResults = ({results, formula, properties}) => (
    <div>
        <h2>
            {results.size} Spaces ∋ 
            <FormulaDisplay formula={formula} properties={properties}/>
        </h2>
        {results.valueSeq().map((space) => (
             <div key={space.id}>
                 <h4><Link to={"spaces/" + space.id}>{space.name}</Link></h4>
                 <p>{preview(space.description)}</p>
             </div>
        ))}
    </div>
)

class Search extends Component {
    render () {
        return (
            <div className="search row">
                <div className="col-md-4">
                    <SearchInput
                        q            = {this.props.q}
                        formula      = {this.props.formula}
                        handleSearch = {this.props.handleSearch}
                        properties   = {this.props.properties}
                    />
                </div>
                <div className="col-md-8">
                    {this.props.formula ? <SearchResults
                        formula    = {this.props.formula}
                        results    = {this.props.results}
                        properties = {this.props.properties}
                    /> : ""}
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
       q:          state.search.q,
       formula:    state.search.formula,
       properties: P.propertyNames(state),
       results:    searchByFormula(state, state.search.formula)
    }),
    (dispatch) => ({
        handleSearch: (e) => dispatch(search(e.target.value))
    })
)(Search)
