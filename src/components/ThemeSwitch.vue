<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { useI18n } from '@/hooks/useI18n';

const { t } = useI18n();

const isDark = useDark({ attribute: 'data-theme' });
const toggleDark = useToggle(isDark);
</script>

<template>
  <button @click="toggleDark()">{{ t('translation.switchtheme') }}</button>
</template>
