import React from 'react'
import { Link } from 'react-router'
import { reduxForm } from 'redux-form'

import * as Search from '../reducers/search'

import FormulaInput from './FormulaInput'

const Counterexamples = ({ counterexamples }) => (
    <div className="row alert alert-danger">
        <h3>Found {counterexamples.size} Counterexamples</h3>
        <ul>
            {counterexamples.valueSeq().map((space) => (
                 <li key={space.id}>
                     <Link to={"spaces/" + space.id}>{space.name}</Link>
                 </li>
            ))}
        </ul>
    </div>
)

const TheoremCreate = ({ fields: { antecedent, consequent }, counterexamples }) => {
    const counters = counterexamples(
        antecedent.value && antecedent.value.parsed,
        consequent.value && consequent.value.parsed
    )

    return (
        <form>
            <div className="row">
                <div className="col-md-5">
                    <FormulaInput
                        placeholder="Antecedent"
                        tabIndex="1"
                        {...antecedent}
                    />
                </div>
                <div className="col-md-5">
                    <FormulaInput
                        placeholder="Consequent"
                        tabIndex="2"
                        {...consequent}
                    />
                </div>
            </div>
            {counters.count() > 0
                ? <Counterexamples counterexamples={counters}/>
                : ''}
        </form>
    )
}

export default reduxForm(
    {
        form: 'theoremCreate',
        fields: ['antecedent', 'consequent']
    },
    (state, ownProps) => {
        return {
            initialValues: {
                antecedent: "Compact",
                consequent: "Connected"
            },
            counterexamples: (a,c) => Search.counterexamples(state, a, c)
        }
    }
)(TheoremCreate)
