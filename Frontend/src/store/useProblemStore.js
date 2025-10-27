import {create} from 'zustand'
import {axiosInstance} from '../lib/axios'
import { toast } from 'react-hot-toast'

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemLoading: false,
  isProblemFetching: false,

  getAllProblems: async () => {
    try {
      set({isProblemFetching: true})

      const res = await axiosInstance.get('/problems/get-all-problems')
      set({problems: res.data.problems})
      
    } catch (error) {
      console.log("Error fetching problems", error)
      toast.error("Error fetching problems")
    } finally {
      set({isProblemFetching: false})
    }
  },

  getProblemById: async (id) => {
    try {
      set({isProblemLoading: true})

      const res = await axiosInstance.get(`/problems/get-problem/${id}`)
      set({problem: res.data.problem})
      
    } catch (error) {
      console.log("Error fetching problem", error)
      toast.error("Error fetching problem")
    } finally {
      set({isProblemLoading: false})
    }
  },

  getAllProblemsSolvedByUser: async () => {
    try {
      set({isProblemFetching: true})

      const res = await axiosInstance.get('/problems/get-solved-problems-user')
      set({solvedProblems: res.data.solvedProblems})
      
    } catch (error) {
      console.log("Error fetching problem", error)
      toast.error("Error fetching problem")
    } finally {
      set({isProblemFetching: false})
    }
  }

}))