import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState  = {
  pages: [
    {
      id: 1,
      title: "About Us",
      url: "/",
      description: "Company vision and mission",
      keywords: "vision, mission, company"
    },
    {
      id: 2,
      title: "Contact Page",
      url: "/",
      description: "Get in touch form",
      keywords: "email, phone, location"
    },
    {
      id: 3,
      title: "Careers",
      url: "/",
      description: "Job openings",
      keywords: "jobs, hiring, opportunities"
    },
    {
      id: 4,
      title: "About Us",
      url: "/",
      description: "Company vision and mission",
      keywords: "vision, mission, company"
    },
    {
      id: 5,
      title: "Contact Page",
      url: "/",
      description: "Get in touch form",
      keywords: "email, phone, location"
    },
    {
      id: 6,
      title: "Careers",
      url: "/",
      description: "Job openings",
      keywords: "jobs, hiring, opportunities"
    }
  ],
  active: { title: "", description: "", keywords: "", url: "" },
}

const seoSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    setActivePage: (state, action ) => {
      state.active = action.payload
    },
    resetActivePage: (state) => {
      state.active = { title: "", description: "", keywords: "", url: "" }
    },
    updateActivePageField: (
      state,
      action
    ) => {
      if (state.active) {
        state.active[action.payload.field] = action.payload.value
      }
    },
  },
})

export const { setActivePage, resetActivePage, updateActivePageField } = seoSlice.actions
export default seoSlice.reducer
