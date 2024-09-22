<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark({ attribute: 'data-theme' });
const toggleDark = useToggle(isDark);
</script>

<template>
  <button @click="toggleDark()">Switch Theme</button>
</template>
