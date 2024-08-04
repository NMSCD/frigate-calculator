<script setup lang="ts">
import { isNumberInput } from '@/helpers/validation';
import { computed } from 'vue';

defineProps<{
  totalTraits: number;
}>();

const emit = defineEmits(['remove']);

const model = defineModel<number>({ required: true });

const isValidInput = computed(() => isNumberInput(model.value.toString()));
</script>

<template>
  <div class="input-group">
    <input
      v-model.trim.number="model"
      :aria-invalid="!isValidInput || undefined"
      placeholder="Trait Value"
      type="text"
    />
    <button
      :disabled="totalTraits === 1"
      class="remove-button"
      @click="emit('remove')"
    >
      ✖
    </button>
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  gap: 1rem;

  .remove-button {
    --remove-background-color: rgb(from var(--pico-background-color) b r r);
    --remove-border-color: rgb(from var(--pico-border-color) b r r);
    --remove-background-color-brighter: hsl(from var(--remove-background-color) h calc(s - 20) calc(l + 10));
    --remove-border-color-brighter: hsl(from var(--remove-border-color) h calc(s - 20) calc(l + 10));
    background-color: var(--remove-background-color-brighter);
    border-color: var(--remove-border-color-brighter);
    /* color cannot be changed with default pico font family */
    font-family: sans-serif;
    color: white;
  }

  input {
    margin: 0;
  }
}
</style>
