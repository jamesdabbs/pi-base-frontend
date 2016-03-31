import React from 'react'

const TraitList = ({ traits, ItemComponent, title }) => {
    return <section>
        <h2>{title || `Traits`}</h2>
        <ul>
            {traits.map(trait =>
                <li key={`${trait.space.id}${trait.property.id}`}>
                    <ItemComponent trait={trait}/>
                </li>
            )}
        </ul>
    </section>
}

TraitList.propTypes = {
    title: React.PropTypes.string,
    traits: React.PropTypes.array.isRequired,
    ItemComponent: React.PropTypes.func.isRequired
}

export default TraitList
