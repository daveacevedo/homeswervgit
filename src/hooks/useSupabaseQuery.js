import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook for handling Supabase queries with loading, error, and data states
 * @param {Function} queryFn - Function that returns a Supabase query
 * @param {Array} dependencies - Dependencies array for useEffect
 * @returns {Object} { data, loading, error, refetch }
 */
export function useSupabaseQuery(queryFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const query = queryFn();
      const { data: result, error: queryError } = await query;
      
      if (queryError) {
        throw queryError;
      }
      
      setData(result);
    } catch (err) {
      console.error('Query error:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  }, [queryFn, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

/**
 * Custom hook for handling Supabase mutations with loading and error states
 * @returns {Object} { mutate, loading, error }
 */
export function useSupabaseMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (mutationFn) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: mutationError } = await mutationFn();
      
      if (mutationError) {
        throw mutationError;
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Mutation error:', err);
      setError(err.message || 'An error occurred during the operation');
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}
