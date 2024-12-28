<script setup lang="ts">
import { ref } from 'vue';
import expeditionHelp from '@/assets/expeditions.webp';
import statsHelp from '@/assets/stats.webp';
import traitsHelp from '@/assets/traits.webp';
import { useActiveElement } from '@vueuse/core';

defineProps<{
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
</script>

<template>
  <button
    class="help-button"
    data-tooltip="Help"
    @click="showModal"
  >
    <img
      alt="Help"
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
            aria-label="Close"
            class="close"
            @click="closeModal"
          ></button>
          <p class="text-bold">Where to find {{ input }}</p>
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
                :alt="`Where to find ${input}`"
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
