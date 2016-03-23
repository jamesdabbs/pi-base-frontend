import React from 'react'

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

const TypeaheadSuggestions = ({ suggestions, selected }) => (
    <div className="list-group">
        {suggestions.map((p,i) =>
            <a className={"list-group-item " + (selected == i ? "active" : "")} key={p.id} href="#">{p.name}</a>
        )}
    </div>
)

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

export default SearchInput
