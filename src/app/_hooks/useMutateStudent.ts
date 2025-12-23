import {create} from "zustand";

const useMutateStudent = create((set) => ({
    mutateStudent : null,
    setMutateStudent : (mutateFn) => set({mutateStudent : mutateFn })
}))

export {useMutateStudent};
