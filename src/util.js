export const pipelineReducers = (reducers) => {
    return (state, action) => {
        return reducers.reduce((s, reducer) => { return reducer(s, action) }, state)
    }
}

export const preview = (latex) => {
    // FIXME: go by word, don't break LaTeX delimiters, add ... when truncated
    return latex.slice(0, 100)
}

export const getFragment = (str) => {
    if (!str) { return '' }
    const parts = str.split(/[~+&|\(\)]/)
    return parts[parts.length - 1].trim()
}

String.prototype.reverse = function() {
    return this.split('').reverse().join('')
}

export const replaceFragment = (string, property) => {
    const fragment = getFragment(string)
    return string.reverse().replace(fragment.reverse(), property.name.reverse()).reverse()
}
