import React from 'react'
import { Link } from 'react-router'

const sepWith = (delimiter) => (componentArray) => {
    let result = []
    componentArray.map((comp,i) => {
        result.push(comp)
        result.push(<span key={'sepWith' + i}> {delimiter} </span>)
    })
    result.pop()
    return result
}

// TODO: use Formula.map (or something similar)
const Formula = ({ formula, properties }) => {
    if (!formula) { return (<span/>) }

    // TODO: check formula type and make sure that we have attached ids
    if (formula.property) {
        var label = formula.property.name
        if (formula.value === false) {
            label = "¬" + label
        }
        return (<Link to={"property/"+formula.property.id}>{label}</Link>)
    } else if (formula.and) {
        return (
            <span>({sepWith("∧")(formula.and.map((sf, i) =>
                <Formula key={i} formula={sf} properties={properties}/>
            ))})</span>
        )
    } else if (formula.or) {
        return (
            <span>({sepWith("∨")(formula.or.map((sf, i) =>
                <Formula key={i} formula={sf} properties={properties}/>
            ))})</span>
        )
    }
    return (<span/>)
}

export default Formula
