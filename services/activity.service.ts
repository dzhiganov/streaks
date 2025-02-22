import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';

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
    queryKey: computed(() => ['history', from, to]),
    queryFn: () => apiFetch(`/api/activity/getHistoryByRange?from=${from.value}&to=${to.value}`),
  });

const useGetHistory = (
  { page = '1', pageSize = '10' }: { page: string; pageSize: string } = {
    page: '1',
    pageSize: '10',
  },
) =>
  useQuery({
    queryKey: ['history', page, pageSize],
    queryFn: () => apiFetch(`/api/activity/getHistory?page=${page}&pageSize=${pageSize}`),
  });

const useGetHistoryByDate = (date: Ref<string>) =>
  useQuery({
    queryKey: ['history', { date }],
    queryFn: () => apiFetch(`/api/activity/getHistoryByDate?date=${date.value}`),
    staleTime: 1000 * 60 * 5,
  });

const useGetGroupedHistory = ({
  date,
  range,
  limit,
}: {
  date: Ref<string>;
  range: Ref<{ from: string; to: string }>;
  limit?: Ref<number>;
}) => {
  return useQuery({
    queryKey: ['history', date, range],
    queryFn: () => {
      let query;

      if (range.value) {
        query = new URLSearchParams({
          from: range.value.from,
          to: range.value.to,
        });
      } else {
        query = new URLSearchParams({
          date: date.value,
        });
      }
      if (limit?.value !== undefined) {
        query.set('limit', limit.value.toString());
      }

      return apiFetch(`/api/activity/getGroupedHistory?${query.toString()}`);
    },
  });
};

const useLogActivity = (onSuccessFn: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activity: { activity: string; time_min: number; date: string }) =>
      apiFetch('/api/activity/log', {
        method: 'POST',
        body: JSON.stringify({
          date: activity.date,
          activity: activity.activity,
          time_min: activity.time_min,
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

const useUpdateLogActivity = (onSuccessFn: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activity: { activity: string; time_min: number; date: string; id: string }) =>
      apiFetch(`/api/activity/updateLog`, {
        method: 'POST',
        body: JSON.stringify({
          ...activity,
          time_min: activity.time_min,
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
    mutationFn: (activity: any) => {
      const updatedObject = {
        ...activity,
      };

      const convertToMinutes = (hours: number) => hours * 60;

      if (activity.day_time_goal_hours) {
        updatedObject.day_time_goal_min = convertToMinutes(activity.day_time_goal_hours);
      }
      if (activity.week_time_goal_hours) {
        updatedObject.week_time_goal_min = convertToMinutes(activity.week_time_goal_hours);
      }
      if (activity.month_time_goal_hours) {
        updatedObject.month_time_goal_min = convertToMinutes(activity.month_time_goal_hours);
      }

      return apiFetch('/api/activity/addNewActivity', {
        method: 'POST',
        body: JSON.stringify(updatedObject),
      });
    },
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
    mutationFn: (activity: any) => {
      const updatedObject = {
        ...activity,
      };

      const convertToMinutes = (hours: number) => hours * 60;

      if (activity.day_time_goal_hours) {
        updatedObject.day_time_goal_min = convertToMinutes(activity.day_time_goal_hours);
      }
      if (activity.week_time_goal_hours) {
        updatedObject.week_time_goal_min = convertToMinutes(activity.week_time_goal_hours);
      }
      if (activity.month_time_goal_hours) {
        updatedObject.month_time_goal_min = convertToMinutes(activity.month_time_goal_hours);
      }

      return apiFetch(`/api/activity/updateActivity`, {
        method: 'POST',
        body: JSON.stringify(updatedObject),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });

      if (onSuccessFn) {
        onSuccessFn();
      }
    },
  });
};

const useDeleteLogActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityId: string) =>
      apiFetch(`/api/activity/deleteLog?activityId=${activityId}`, {
        method: 'PATCH',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
};

const useGetReport = (params: { from: Ref<string>; to: Ref<string>; enabled: Ref<boolean> }) => {
  return useQuery({
    queryKey: ['report'],
    queryFn: () =>
      apiFetch(`/api/activity/getReport?from=${params.from.value}&to=${params.to.value}`),
    enabled: computed(() => params.enabled.value),
  });
};

const useGetAggregatedHistory = (params: {
  from: Ref<string>;
  to: Ref<string>;
  range: Ref<string>;
}) => {
  return useQuery({
    queryKey: ['aggregatedHistory'],
    queryFn: () =>
      apiFetch(
        `/api/activity/getAggregatedHistory?from=${params.from.value}&to=${params.to.value}&range=${params.range.value}`,
      ),
  });
};

const useGenerateReport = (params: {
  from: Ref<string>;
  to: Ref<string>;
  enabled: Ref<boolean>;
}) => {
  return useQuery({
    queryKey: ['report'],
    queryFn: () =>
      apiFetch(`/api/activity/generateReport?from=${params.from.value}&to=${params.to.value}`),
    enabled: computed(() => params.enabled.value),
  });
};

export {
  useAddActivity,
  useAddActivityType,
  useDeleteLogActivity,
  useGenerateReport,
  useGetActivities,
  useGetActivity,
  useGetActivityTypes,
  useGetAggregatedHistory,
  useGetGroupedHistory,
  useGetHistory,
  useGetHistoryByDate,
  useGetHistoryByRange,
  useGetReport,
  useLogActivity,
  useUpdateActivity,
  useUpdateLogActivity,
};
