<script setup lang="ts">
import { isNumberInput } from '@/helpers/validation';
import { computed } from 'vue';

defineProps<{
  placeholder: string;
}>();

const model = defineModel<number>({ required: true });

const isValidInput = computed(() => isNumberInput(model.value.toString()));
</script>

<template>
  <div class="stat-input">
    <label :for="placeholder">{{ placeholder }}</label>
    <input
      v-model.trim.number="model"
      :aria-invalid="!isValidInput || undefined"
      :id="placeholder"
      :placeholder
      type="text"
    />
  </div>
</template>

<style scoped>
.stat-input {
  grid-column: 1 / 3;
  display: grid;
  grid-template-columns: subgrid;

  label {
    place-content: center;
  }

  & > * {
    margin: 0;
  }
}
</style>
