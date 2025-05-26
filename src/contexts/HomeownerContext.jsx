import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const HomeownerContext = createContext()

export function useHomeowner() {
  return useContext(HomeownerContext)
}

export function HomeownerProvider({ children }) {
  const { user } = useAuth()
  const [homeownerProfile, setHomeownerProfile] = useState(null)
  const [properties, setProperties] = useState([])
  const [visionBoards, setVisionBoards] = useState([])
  const [projectPlans, setProjectPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    if (user) {
      fetchHomeownerProfile()
    } else {
      setHomeownerProfile(null)
      setProperties([])
      setVisionBoards([])
      setProjectPlans([])
      setLoading(false)
    }
  }, [user])
  
  const fetchHomeownerProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('homeowners')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      setHomeownerProfile(data || null)
      
      if (data) {
        // Fetch related data if homeowner profile exists
        await Promise.all([
          fetchProperties(),
          fetchVisionBoards(),
          fetchProjectPlans()
        ])
      }
    } catch (error) {
      console.error('Error fetching homeowner profile:', error)
      setError('Failed to load homeowner profile')
    } finally {
      setLoading(false)
    }
  }
  
  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('homeowner_id', user.id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setProperties(data || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }
  
  const fetchVisionBoards = async () => {
    try {
      const { data, error } = await supabase
        .from('vision_boards')
        .select(`
          *,
          vision_board_items (*)
        `)
        .eq('homeowner_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setVisionBoards(data || [])
    } catch (error) {
      console.error('Error fetching vision boards:', error)
    }
  }
  
  const fetchProjectPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('project_plans')
        .select(`
          *,
          properties (name),
          vision_boards (title)
        `)
        .eq('homeowner_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setProjectPlans(data || [])
    } catch (error) {
      console.error('Error fetching project plans:', error)
    }
  }
  
  const createHomeownerProfile = async (profileData) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('homeowners')
        .insert([
          {
            id: user.id,
            ...profileData
          }
        ])
        .select()
      
      if (error) throw error
      
      setHomeownerProfile(data[0])
      return data[0]
    } catch (error) {
      console.error('Error creating homeowner profile:', error)
      setError('Failed to create homeowner profile')
      throw error
    } finally {
      setLoading(false)
    }
  }
  
  const updateHomeownerProfile = async (profileData) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('homeowners')
        .update(profileData)
        .eq('id', user.id)
        .select()
      
      if (error) throw error
      
      setHomeownerProfile(data[0])
      return data[0]
    } catch (error) {
      console.error('Error updating homeowner profile:', error)
      setError('Failed to update homeowner profile')
      throw error
    } finally {
      setLoading(false)
    }
  }
  
  const createProperty = async (propertyData) => {
    try {
      setError(null)
      
      // If this is the first property, set it as primary
      if (properties.length === 0) {
        propertyData.is_primary = true
      }
      
      const { data, error } = await supabase
        .from('properties')
        .insert([
          {
            homeowner_id: user.id,
            ...propertyData
          }
        ])
        .select()
      
      if (error) throw error
      
      setProperties([...properties, data[0]])
      return data[0]
    } catch (error) {
      console.error('Error creating property:', error)
      setError('Failed to create property')
      throw error
    }
  }
  
  const updateProperty = async (propertyId, propertyData) => {
    try {
      setError(null)
      
      const { data, error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', propertyId)
        .eq('homeowner_id', user.id)
        .select()
      
      if (error) throw error
      
      setProperties(properties.map(property => 
        property.id === propertyId ? data[0] : property
      ))
      return data[0]
    } catch (error) {
      console.error('Error updating property:', error)
      setError('Failed to update property')
      throw error
    }
  }
  
  const deleteProperty = async (propertyId) => {
    try {
      setError(null)
      
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
        .eq('homeowner_id', user.id)
      
      if (error) throw error
      
      setProperties(properties.filter(property => property.id !== propertyId))
      
      // If the deleted property was primary, set another one as primary
      const deletedProperty = properties.find(p => p.id === propertyId)
      if (deletedProperty?.is_primary && properties.length > 1) {
        const newPrimaryProperty = properties.find(p => p.id !== propertyId)
        if (newPrimaryProperty) {
          await updateProperty(newPrimaryProperty.id, { is_primary: true })
        }
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      setError('Failed to delete property')
      throw error
    }
  }
  
  const createVisionBoard = async (visionBoardData) => {
    try {
      setError(null)
      
      const { data, error } = await supabase
        .from('vision_boards')
        .insert([
          {
            homeowner_id: user.id,
            ...visionBoardData
          }
        ])
        .select()
      
      if (error) throw error
      
      // Add empty items array for consistency
      const newVisionBoard = { ...data[0], vision_board_items: [] }
      setVisionBoards([newVisionBoard, ...visionBoards])
      return newVisionBoard
    } catch (error) {
      console.error('Error creating vision board:', error)
      setError('Failed to create vision board')
      throw error
    }
  }
  
  const updateVisionBoard = async (boardId, boardData) => {
    try {
      setError(null)
      
      const { data, error } = await supabase
        .from('vision_boards')
        .update(boardData)
        .eq('id', boardId)
        .eq('homeowner_id', user.id)
        .select()
      
      if (error) throw error
      
      setVisionBoards(visionBoards.map(board => {
        if (board.id === boardId) {
          return { ...data[0], vision_board_items: board.vision_board_items }
        }
        return board
      }))
      return data[0]
    } catch (error) {
      console.error('Error updating vision board:', error)
      setError('Failed to update vision board')
      throw error
    }
  }
  
  const deleteVisionBoard = async (boardId) => {
    try {
      setError(null)
      
      const { error } = await supabase
        .from('vision_boards')
        .delete()
        .eq('id', boardId)
        .eq('homeowner_id', user.id)
      
      if (error) throw error
      
      setVisionBoards(visionBoards.filter(board => board.id !== boardId))
    } catch (error) {
      console.error('Error deleting vision board:', error)
      setError('Failed to delete vision board')
      throw error
    }
  }
  
  const addVisionBoardItem = async (boardId, itemData) => {
    try {
      setError(null)
      
      const { data, error } = await supabase
        .from('vision_board_items')
        .insert([
          {
            vision_board_id: boardId,
            ...itemData
          }
        ])
        .select()
      
      if (error) throw error
      
      setVisionBoards(visionBoards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            vision_board_items: [...(board.vision_board_items || []), data[0]]
          }
        }
        return board
      }))
      return data[0]
    } catch (error) {
      console.error('Error adding vision board item:', error)
      setError('Failed to add item to vision board')
      throw error
    }
  }
  
  const updateVisionBoardItem = async (itemId, boardId, itemData) => {
    try {
      setError(null)
      
      const { data, error } = await supabase
        .from('vision_board_items')
        .update(itemData)
        .eq('id', itemId)
        .eq('vision_board_id', boardId)
        .select()
      
      if (error) throw error
      
      setVisionBoards(visionBoards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            vision_board_items: board.vision_board_items.map(item => 
              item.id === itemId ? data[0] : item
            )
          }
        }
        return board
      }))
      return data[0]
    } catch (error) {
      console.error('Error updating vision board item:', error)
      setError('Failed to update vision board item')
      throw error
    }
  }
  
  const deleteVisionBoardItem = async (itemId, boardId) => {
    try {
      setError(null)
      
      const { error } = await supabase
        .from('vision_board_items')
        .delete()
        .eq('id', itemId)
        .eq('vision_board_id', boardId)
      
      if (error) throw error
      
      setVisionBoards(visionBoards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            vision_board_items: board.vision_board_items.filter(item => item.id !== itemId)
          }
        }
        return board
      }))
    } catch (error) {
      console.error('Error deleting vision board item:', error)
      setError('Failed to delete vision board item')
      throw error
    }
  }
  
  const createProjectPlan = async (planData) => {
    try {
      setError(null)
      
      const { data, error } = await supabase
        .from('project_plans')
        .insert([
          {
            homeowner_id: user.id,
            ...planData
          }
        ])
        .select(`
          *,
          properties (name),
          vision_boards (title)
        `)
      
      if (error) throw error
      
      setProjectPlans([data[0], ...projectPlans])
      return data[0]
    } catch (error) {
      console.error('Error creating project plan:', error)
      setError('Failed to create project plan')
      throw error
    }
  }
  
  const updateProjectPlan = async (planId, planData) => {
    try {
      setError(null)
      
      const { data, error } = await supabase
        .from('project_plans')
        .update(planData)
        .eq('id', planId)
        .eq('homeowner_id', user.id)
        .select(`
          *,
          properties (name),
          vision_boards (title)
        `)
      
      if (error) throw error
      
      setProjectPlans(projectPlans.map(plan => 
        plan.id === planId ? data[0] : plan
      ))
      return data[0]
    } catch (error) {
      console.error('Error updating project plan:', error)
      setError('Failed to update project plan')
      throw error
    }
  }
  
  const deleteProjectPlan = async (planId) => {
    try {
      setError(null)
      
      const { error } = await supabase
        .from('project_plans')
        .delete()
        .eq('id', planId)
        .eq('homeowner_id', user.id)
      
      if (error) throw error
      
      setProjectPlans(projectPlans.filter(plan => plan.id !== planId))
    } catch (error) {
      console.error('Error deleting project plan:', error)
      setError('Failed to delete project plan')
      throw error
    }
  }
  
  const createEstimateRequest = async (requestData) => {
    try {
      setError(null)
      
      const { data, error } = await supabase
        .from('estimate_requests')
        .insert([
          {
            homeowner_id: user.id,
            ...requestData
          }
        ])
        .select()
      
      if (error) throw error
      
      return data[0]
    } catch (error) {
      console.error('Error creating estimate request:', error)
      setError('Failed to create estimate request')
      throw error
    }
  }
  
  const value = {
    homeownerProfile,
    properties,
    visionBoards,
    projectPlans,
    loading,
    error,
    createHomeownerProfile,
    updateHomeownerProfile,
    createProperty,
    updateProperty,
    deleteProperty,
    createVisionBoard,
    updateVisionBoard,
    deleteVisionBoard,
    addVisionBoardItem,
    updateVisionBoardItem,
    deleteVisionBoardItem,
    createProjectPlan,
    updateProjectPlan,
    deleteProjectPlan,
    createEstimateRequest,
    refreshData: fetchHomeownerProfile
  }
  
  return (
    <HomeownerContext.Provider value={value}>
      {children}
    </HomeownerContext.Provider>
  )
}
