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

const useGetHistoryByRange = (from: Ref<string>, to: Ref<string>) =>
  useQuery({
    queryKey: ['history', { from: from.value, to: to.value }],
    queryFn: () => apiFetch(`/api/activity/getHistoryByRange?from=${from.value}&to=${to.value}`),
  });

const useGetHistoryByDate = (date: Ref<string>) =>
  useQuery({
    queryKey: ['history', { date }],
    queryFn: () => apiFetch(`/api/activity/getHistoryByDate?date=${date.value}`),
    staleTime: 1000 * 60 * 5,
  });

const useLogActivity = (onSuccessFn: () => void) => {
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
      queryClient.invalidateQueries({ queryKey: ['history'] });

      if (onSuccessFn) {
        onSuccessFn();
      }
    },
  });
};

const useAddActivity = (onSuccessFn: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityType: { title: string; description: string }) =>
      apiFetch('/api/activity/addNewActivity', {
        method: 'POST',
        body: JSON.stringify(activityType),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });

      if (onSuccessFn) {
        onSuccessFn();
      }
    },
  });
};

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

const useGetActivityTypes = () =>
  useQuery({
    queryKey: ['activityTypes'],
    queryFn: () => apiFetch('/api/activity/getActivityTypes'),
    staleTime: 1000 * 60 * 5,
  });

const useGetActivities = (
  { onlyActive = false }: { onlyActive: boolean } = { onlyActive: false },
) =>
  useQuery({
    queryKey: ['history'],
    queryFn: () => apiFetch(`/api/activity/getActivities?onlyActive=${onlyActive}`),
    staleTime: 1000 * 60 * 5,
  });

const useGetActivity = (activityId: string) =>
  useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => apiFetch(`/api/activity/get/${activityId}`),
    staleTime: 1000 * 60 * 5,
  });

const useUpdateActivity = (onSuccessFn: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activity: { id: string; data: any }) =>
      apiFetch(`/api/activity/updateActivity`, {
        method: 'POST',
        body: JSON.stringify(activity),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });

      if (onSuccessFn) {
        onSuccessFn();
      }
    },
  });
};

export {
  useAddActivity,
  useAddActivityType,
  useGetActivities,
  useGetActivity,
  useGetActivityTypes,
  useGetHistoryByDate,
  useGetHistoryByRange,
  useLogActivity,
  useUpdateActivity,
};
