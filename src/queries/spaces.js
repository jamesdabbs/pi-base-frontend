export function find(state, id) {
    const found = state.spaces.getIn(['entities', Number(id)])
    return found && found.toJS()
}
