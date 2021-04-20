import { createModel } from '@rematch/core'
import { RootModel } from '../models'

export const count = createModel<RootModel>()({
    state: 0,
    reducers: {
        increment(state, payload: number) {
            return state + payload
        },
    },
    effects: (dispatch) => ({
        incrementAsync(payload: number, state) {
            dispatch.count.increment(payload)
        },
    }),
});