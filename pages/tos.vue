<script setup>
import { ArrowLeft } from '../assets/icons'

definePageMeta({
  auth: false
})

</script>
<template>
    <div class="container mx-auto max-w-2xl p-6">
      <NuxtLink to="/" class="btn mb-6">
        <ArrowLeft />
        Back to the main page
      </NuxtLink>
      <h2 class="text-2xl font-bold mb-4">Terms and Conditions</h2>
      <div class="text-gray-500 mb-4">Last updated: DATE</div>
      <p></p>
    </div>
  </template>
  