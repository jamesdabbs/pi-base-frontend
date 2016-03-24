import React, { Component } from 'react'
import { Link } from 'react-router'
import { reduxForm } from 'redux-form'

import { search  } from '../actions'
import * as Search from '../reducers/search'
import { preview } from '../util'

import Formula from './Formula'
import FormulaInput from './FormulaInput'

const ExampleSearches = ({ doSearch }) => {
    return (
        <div>
            <p>Not sure where to start? Try one of these searches:</p>
            <ul>
                {Search.examples.map(q => (
                     <li key={q}>
                         <a href="#" onClick={() => doSearch(q)}>{q}</a>
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


const SearchForm = ({ fields: { query }, q, formula, results, doSearch }) => {
    if (!query.value) { query.value = q }

    // TODO: this should use the built-in parsing the the FormulaInput
    return (
        <form className="search row">
            <div className="col-md-4">
            <FormulaInput
                {...query}
                onKeyUp={(e) => doSearch(e.target.value)}
            />
            </div>
            <div className="col-md-8">
                {results.size > 0
                ? <SearchResults formula={formula} results={results}/>
                : <ExampleSearches doSearch={doSearch}/>}
            </div>
        </form>
    )
}

export default reduxForm(
    {
        form:    'search',
        fields: ['query']
    },
    (state) => ({
        q:       Search.query(state),
        results: Search.results(state),
        formula: Search.formulaWithProperties(state)
    }),
    (dispatch) => ({
        doSearch: (q) => dispatch(search(q))
    })
)(SearchForm)
