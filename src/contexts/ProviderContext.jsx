import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ProviderContext = createContext();

export function useProvider() {
  return useContext(ProviderContext);
}

export function ProviderProfileProvider({ children }) {
  const { user } = useAuth();
  const [providerProfile, setProviderProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (user) {
      fetchProviderProfile();
    } else {
      setProviderProfile(null);
      setServices([]);
      setJobs([]);
      setReviews([]);
      setLoading(false);
    }
  }, [user]);
  
  const fetchProviderProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setProviderProfile(data || null);
      
      if (data) {
        // Fetch related data if provider profile exists
        await Promise.all([
          fetchServices(),
          fetchJobs(),
          fetchReviews()
        ]);
      }
    } catch (error) {
      console.error('Error fetching provider profile:', error);
      setError('Failed to load provider profile');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_services')
        .select('*')
        .eq('provider_id', providerProfile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  
  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          homeowner:homeowner_id (
            id,
            first_name,
            last_name,
            email
          ),
          property:property_id (
            id,
            address,
            city,
            state,
            zip_code
          )
        `)
        .eq('provider_id', providerProfile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };
  
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_reviews')
        .select(`
          *,
          homeowner:homeowner_id (
            id,
            first_name,
            last_name
          ),
          job:job_id (
            id,
            title
          )
        `)
        .eq('provider_id', providerProfile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
  
  // Create a new service
  const createService = async (serviceData) => {
    try {
      if (!providerProfile) {
        throw new Error('Provider profile not found');
      }
      
      const { data, error } = await supabase
        .from('provider_services')
        .insert({
          ...serviceData,
          provider_id: providerProfile.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setServices(prevServices => [data, ...prevServices]);
      return { data };
    } catch (error) {
      console.error('Error creating service:', error);
      return { error };
    }
  };
  
  // Update a service
  const updateService = async (serviceId, serviceData) => {
    try {
      const { data, error } = await supabase
        .from('provider_services')
        .update(serviceData)
        .eq('id', serviceId)
        .eq('provider_id', providerProfile.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setServices(prevServices => 
        prevServices.map(service => 
          service.id === serviceId ? data : service
        )
      );
      
      return { data };
    } catch (error) {
      console.error('Error updating service:', error);
      return { error };
    }
  };
  
  // Delete a service
  const deleteService = async (serviceId) => {
    try {
      const { error } = await supabase
        .from('provider_services')
        .delete()
        .eq('id', serviceId)
        .eq('provider_id', providerProfile.id);
      
      if (error) throw error;
      
      setServices(prevServices => 
        prevServices.filter(service => service.id !== serviceId)
      );
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting service:', error);
      return { error };
    }
  };
  
  // Update provider profile
  const updateProviderProfile = async (profileData) => {
    try {
      if (!providerProfile) {
        throw new Error('Provider profile not found');
      }
      
      const { data, error } = await supabase
        .from('provider_profiles')
        .update(profileData)
        .eq('id', providerProfile.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setProviderProfile(data);
      return { data };
    } catch (error) {
      console.error('Error updating provider profile:', error);
      return { error };
    }
  };
  
  // Accept a job
  const acceptJob = async (jobId) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({ status: 'accepted' })
        .eq('id', jobId)
        .eq('provider_id', providerProfile.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? data : job
        )
      );
      
      return { data };
    } catch (error) {
      console.error('Error accepting job:', error);
      return { error };
    }
  };
  
  // Decline a job
  const declineJob = async (jobId) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({ status: 'declined' })
        .eq('id', jobId)
        .eq('provider_id', providerProfile.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? data : job
        )
      );
      
      return { data };
    } catch (error) {
      console.error('Error declining job:', error);
      return { error };
    }
  };
  
  // Complete a job
  const completeJob = async (jobId) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({ status: 'completed' })
        .eq('id', jobId)
        .eq('provider_id', providerProfile.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? data : job
        )
      );
      
      return { data };
    } catch (error) {
      console.error('Error completing job:', error);
      return { error };
    }
  };
  
  // Get available jobs
  const getAvailableJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          homeowner:homeowner_id (
            id,
            first_name,
            last_name,
            email
          ),
          property:property_id (
            id,
            address,
            city,
            state,
            zip_code
          )
        `)
        .is('provider_id', null)
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { data };
    } catch (error) {
      console.error('Error fetching available jobs:', error);
      return { error };
    }
  };
  
  // Apply for a job
  const applyForJob = async (jobId) => {
    try {
      if (!providerProfile) {
        throw new Error('Provider profile not found');
      }
      
      // First check if the job is still available
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .is('provider_id', null)
        .eq('status', 'open')
        .single();
      
      if (jobError) throw jobError;
      
      if (!jobData) {
        throw new Error('Job is no longer available');
      }
      
      // Create a job application
      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          provider_id: providerProfile.id,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return { data };
    } catch (error) {
      console.error('Error applying for job:', error);
      return { error };
    }
  };
  
  // Get job applications
  const getJobApplications = async () => {
    try {
      if (!providerProfile) {
        throw new Error('Provider profile not found');
      }
      
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job:job_id (
            *,
            homeowner:homeowner_id (
              id,
              first_name,
              last_name,
              email
            ),
            property:property_id (
              id,
              address,
              city,
              state,
              zip_code
            )
          )
        `)
        .eq('provider_id', providerProfile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { data };
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return { error };
    }
  };
  
  const value = {
    providerProfile,
    services,
    jobs,
    reviews,
    loading,
    error,
    fetchProviderProfile,
    createService,
    updateService,
    deleteService,
    updateProviderProfile,
    acceptJob,
    declineJob,
    completeJob,
    getAvailableJobs,
    applyForJob,
    getJobApplications
  };
  
  return (
    <ProviderContext.Provider value={value}>
      {children}
    </ProviderContext.Provider>
  );
}
