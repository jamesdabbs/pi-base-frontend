export function propertyNames(state) {
    return state.properties.get(`entities`).map(p => p.name)
}

export function find(state, id) {
    const found = state.properties.getIn([`entities`, Number(id)])
    return found && found.toJS()
}
