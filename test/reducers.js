import reducer from '../src/reducers'
import { fetchComplete, FETCH_SPACE } from '../src/actions'
import * as S from '../src/reducers/spaces'

const init = reducer(undefined, {})

it('can load spaces', () => {
    const result = reducer(init, fetchComplete(FETCH_SPACE, [{
        proof_of_topology: null,
        name: "Finite Discrete Topology",
        id: 2,
        description: "What it says on the tin"
    }]))

    expect(
        result.spaces.get("entities").count()
    ).to.equal(1)
})
