import React from 'react'
import { reduxForm } from 'redux-form'

import FormulaInput from './FormulaInput'

const TheoremCreate = (args) => {
    console.log("theoremCreateForm got", args);
    const handleChange = (values, dispatch) => { console.log("form changing", values) }

    return (
        <form>
            <div className="row">
                <div className="col-md-5">
                    <FormulaInput
                        placeholder="Antecedent"
                        onParse={(f) => console.log("updating ant", f)}
                        {...args.fields.antecedent}
                    />
                </div>
                <div className="col-md-5">
                    <FormulaInput
                        placeholder="Consequent"
                        onParse={(f) => console.log("updating cons", f)}
                        {...args.fields.consequent}
                    />
                </div>
            </div>
        </form>
    )
}

export default reduxForm({
    form: 'theoremCreate',
    fields: ['antecedent', 'consequent']
})(TheoremCreate)
