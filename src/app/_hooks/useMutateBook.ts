import {create} from "zustand";

const useMutateBook = create((set) => ({
    mutateBook : null,
    setMutateBook : (mutateFn) => set({mutateBook : mutateFn })
}))

export {useMutateBook};
