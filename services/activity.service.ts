import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

export type Payload = {
  activity: number;
  time_hours: number;
  date: string;
};

export type ActivityType = {
  title: string;
  description: string;
};

export type Activity = {
  title: string;
  description: string;
  type: string;
  icon: string;
  color: string;
  active: boolean;
  week_time_goal_hours: number;
  day_time_goal_hours: number;
  month_time_goal_hours: number;
};

// 🛠️ Base API Fetch Wrapper
const apiFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return await response.json();
};

// ✅ 1. Fetch History by Date Range
const useGetHistoryByRange = (from: string, to: string) =>
  useQuery({
    queryKey: ['history', { from, to }],
    queryFn: () => apiFetch(`/api/activity/getHistoryByRange?from=${from}&to=${to}`),
    staleTime: 1000 * 60 * 5, // Cache valid for 5 minutes
  });

const useGetHistoryByDate = (date: Ref<string>) =>
  useQuery({
    queryKey: ['history', { date }],
    queryFn: () => apiFetch(`/api/activity/getHistoryByDate?date=${date.value}`),
    staleTime: 1000 * 60 * 5, // Cache valid for 5 minutes
  });

// ✅ 2. Log an Activity
const useLogActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activity: { activity: string; time_hours: number; date: string }) =>
      apiFetch('/api/activity/log', {
        method: 'POST',
        body: JSON.stringify({
          activity: activity.activity,
          time_min: activity.time_hours * 60,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] }); // Refetch history after a log
    },
  });
};

const useAddActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityType: { title: string; description: string }) =>
      apiFetch('/api/activity/addActivity', {
        method: 'POST',
        body: JSON.stringify(activityType),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};

// ✅ 3. Add a New Activity Type
const useAddActivityType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityType: { title: string; description: string }) =>
      apiFetch('/api/activity/addNewType', {
        method: 'POST',
        body: JSON.stringify(activityType),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityTypes'] });
    },
  });
};

// ✅ 4. Get All Activity Types
const useGetActivityTypes = () =>
  useQuery({
    queryKey: ['activityTypes'],
    queryFn: () => apiFetch('/api/activity/getActivityTypes'),
    staleTime: 1000 * 60 * 5,
  });

// ✅ 5. Fetch All Activities
const useGetActivities = () =>
  useQuery({
    queryKey: ['activities'],
    queryFn: () => apiFetch('/api/activity/getActivities'),
    staleTime: 1000 * 60 * 5,
  });

// ✅ 6. Fetch Single Activity by ID
const useGetActivity = (activityId: string) =>
  useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => apiFetch(`/api/activity/get/${activityId}`),
    staleTime: 1000 * 60 * 5,
  });

// ✅ Export all methods at the end
export {
  useAddActivity,
  useAddActivityType,
  useGetActivities,
  useGetActivity,
  useGetActivityTypes,
  useGetHistoryByDate,
  useGetHistoryByRange,
  useLogActivity,
};
