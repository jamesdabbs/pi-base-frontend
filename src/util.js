export function pipelineReducers(reducers) {
    return (state, action) => {
        return reducers.reduce((s, reducer) => { return reducer(s, action) }, state)
    }
}
