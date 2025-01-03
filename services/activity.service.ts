import { onMounted, ref } from "vue";

type Payload = {
    activity: number;
    time_hours: number;
    date: string;
}

type ActivityType = {
    title: string;
    description: string;
}

type Activity = {
    title: string;
    description: string;
    type: string;
    icon: string;
    color: string;
    active: boolean;
    week_time_goal_hours: number;
    day_time_goal_hours: number;
    month_time_goal_hours: number;
}

export const useActivityService = () => {

    const activities = ref([]);
    const activity_types = ref([]);
    const history = ref([]);

    const logActivity = async (payload: Payload) => {
        try {
            console.log('payload', payload)
            const res = await $fetch(`/api/activity/log`, {
              method: 'POST',
              body: JSON.stringify({
                activity: payload.activity,
                time_min: payload.time_hours * 60,
                date: new Date(),
              })
            })

            return res
          } catch (err) {
            console.error(err)
          }
    }

    const addNewActivity = async (payload: Activity) => {
        try {
            const res = await $fetch(`/api/activity/addNewActivity`, {
              method: 'POST',
              body: JSON.stringify({
                ...payload,
                week_time_goal_min: payload.week_time_goal_hours * 60,
                day_time_goal_min: payload.day_time_goal_hours * 60,
                month_time_goal_min: payload.month_time_goal_hours * 60,
              })
            })

            return res
        } catch (err) {
            console.error(err)
        }
    }

    const addNewType = async (payload: ActivityType) => {
        try {
            const res = await $fetch(`/api/activity/addNewType`, {
              method: 'POST',
              body: JSON.stringify(payload)
            })

            return res
        } catch (err) {
            console.error(err)
        }
    }

    const getActivities = async () => {
        try {
            const res = await $fetch(`/api/activity/getActivities`)

            activities.value = res.activities
        } catch (err) {
            console.error(err)
        }
    }

    
    const getActivityTypes = async () => {
        try {
            const res = await $fetch(`/api/activity/getActivityTypes`)

            activity_types.value = res.activity_types
        } catch (err) {
            console.error(err)
        }
    }

    
    const getHistory = async () => {
        try {
            const res = await $fetch(`/api/activity/getHistory`)

            history.value = res.history
        } catch (err) {
            console.error(err)
        }
    }

    const getHistoryByDate = async (date: string) => {
        try {
            const res = await $fetch(`/api/activity/getHistoryByDate`, {
                params: {
                    date,
                }
            })

            return res
        } catch (err) {
            console.error(err)
        }
    }

    onMounted(() => {
        getActivities()
        getActivityTypes()
        getHistory()
    })
  
    return { logActivity, addNewType, activities, activity_types, history, addNewActivity, getHistoryByDate }
  }
  