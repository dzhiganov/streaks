<script setup>
import { CalendarDate, CalendarMonth } from 'cally';

const selected = ref("")
function onChange(event) {
  selected.value = event.target.value
}

</script>

<template>
    <div>
        calendar
    </div>
</template>
