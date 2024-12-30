<script setup lang="ts">
import { ref, watch } from 'vue';
import expeditionHelp from '@/assets/expeditions.webp';
import statsHelp from '@/assets/stats.webp';
import traitsHelp from '@/assets/traits.webp';
import { useActiveElement } from '@vueuse/core';
import { useI18n } from '@/hooks/useI18n';

const { t } = useI18n();

const props = defineProps<{
  input: 'expeditions' | 'stats' | 'traits';
}>();

const imageMapping = {
  expeditions: expeditionHelp,
  stats: statsHelp,
  traits: traitsHelp,
};

const activeElement = useActiveElement();

const dialog = ref<HTMLDialogElement | null>(null);
const isLoading = ref(true);
const openedOnce = ref(false); // this is here so we only load the images when the modal is opened

const showModal = () => {
  activeElement.value?.blur();
  dialog.value?.showModal();
  openedOnce.value = true;
};
const closeModal = () => dialog.value?.close();

const translatedInput = ref<string>('');

watch(
  () => props.input,
  (newValue) => {
    if (newValue === 'expeditions') {
      translatedInput.value = t('translation.expeditions');
    } else if (newValue === 'stats') {
      translatedInput.value = t('translation.stats');
    } else if (newValue === 'traits') {
      translatedInput.value = t('translation.traits');
    } else {
      translatedInput.value = 'Unknown value';
    }
  },
  { immediate: true }
);
</script>

<template>
  <button
    class="help-button"
    :data-tooltip="t('translation.help')"
    @click="showModal"
  >
    <img
      :alt="t('translation.help')"
      class="help-icon"
      loading="lazy"
      src="../assets/help.svg"
    />
  </button>
  <Teleport to=".container">
    <dialog
      ref="dialog"
      @click.self="closeModal"
    >
      <article>
        <header>
          <button
            :aria-label="t('translation.close')"
            class="close"
            @click="closeModal"
          ></button>
          <p class="text-bold">{{ t('translation.wheretofind') }} {{ translatedInput }}</p>
        </header>
        <div class="transition-container">
          <div
            class="spinner"
            aria-busy="true"
          ></div>
          <a
            :href="imageMapping[input]"
            target="_blank"
          >
            <Transition>
              <img
                v-if="openedOnce"
                :alt="t('translation.wheretofind') ` ${translatedInput}`"
                :src="imageMapping[input]"
                loading="lazy"
                @load="isLoading = false"
              />
            </Transition>
          </a>
        </div>
      </article>
    </dialog>
  </Teleport>
</template>

<style scoped>
html[data-theme='dark'] .help-icon {
  filter: invert(1);
}

.help-button {
  padding: 0;
  padding-inline-end: 0.15rem;
  background-color: transparent;
  border: none;
  box-shadow: none;

  &:focus-visible {
    outline: var(--pico-outline-width) solid var(--pico-primary-focus);
  }

  .help-icon {
    width: 1.25rem;
    vertical-align: sub;
  }
}

.transition-container {
  display: grid;

  & > * {
    grid-area: 1 / 1;
  }

  .spinner {
    place-self: center;
    font-size: 2rem;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
