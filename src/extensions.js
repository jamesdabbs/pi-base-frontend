Array.prototype.sortBy = function(comparator) {
    return this.sort((a,b) => {
        return comparator(a) < comparator(b) ? -1 : 1
    })
}
