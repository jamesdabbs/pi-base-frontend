import React from 'react'
import { connect } from 'react-redux'

import * as P from '../../reducers/properties'

import Spinner from '../Spinner'
import TraitItem from './TraitItem'

const SpaceProperties = ({space, traits, lookupProperty}) => {
    return (
        <section>
            <h2>Properties</h2>
            {!traits
                ? <Spinner/>
                : <ul>
                    {traits.entrySeq().map(([propId, value]) =>
                        <TraitItem
                            key      = {propId}
                            space    = {space}
                            property = {lookupProperty(propId)}
                            value    = {value}
                        />
                    )}
                </ul>
            }
        </section>
    )
}

export default connect(
    (state) => {
        return {
            lookupProperty: (id) => P.find(state.properties, id)
        }
    }
)(SpaceProperties)
