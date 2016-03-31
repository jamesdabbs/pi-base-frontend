export const pipelineReducers = (reducers, initialState) => {
    return (state, action) => {
        return reducers.reduce((s, reducer) => {
            return reducer(s, action)
        }, state || initialState)
    }
}

export const preview = (latex) => {
    // FIXME: go by word, don't break LaTeX delimiters, add ... when truncated
    return latex && latex.slice(0, 100)
}

export const getFragment = (str) => {
    if (!str) { return '' }
    const parts = str.split(/[~+&|\(\)]/)
    return parts[parts.length - 1].trim()
}

export const replaceFragment = (string, property) => {
    const fragment = getFragment(string)
    return string.reverse().replace(fragment.reverse(), property.name.reverse()).reverse()
}
