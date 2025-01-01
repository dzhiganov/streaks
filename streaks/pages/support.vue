<script setup>
import { ArrowLeft } from '../assets/icons'

definePageMeta({
  auth: false
})

</script>
<template>
    <div class="container mx-auto max-w-2xl p-6">
      <NuxtLink to="/" class="btn mb-6">
        <ArrowLeft class="w-2"/>
        Back to the main page
      </NuxtLink>
      <h2 class="text-2xl font-bold mb-4">Support</h2>
      <p></p>
    </div>
  </template>
  