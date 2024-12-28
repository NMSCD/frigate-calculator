<script setup lang="ts">
import { computed, ref } from 'vue';
import NavBar from './components/NavBar.vue';
import TraitInput from './components/TraitInput.vue';
import StatInput from './components/StatInput.vue';
import { isNumberInput } from './helpers/validation';
import HelpPopup from './components/HelpPopup.vue';

const levelUps = [4, 8, 15, 25, 30, 35, 40, 45, 50, 55]; // NoSonar these are given by the game

const bestFrigateBaseStat = 14;
const worstFrigateBaseStat = -5;

const maxAmountOfTraits = 5;

const traitValues = ref<number[]>([0]);

const addTrait = () => traitValues.value.push(0);
const removeTrait = (index: number) => (traitValues.value = traitValues.value.filter((_, idx) => idx !== index));

const stats = ['Combat', 'Exploration', 'Industrial', 'Trade'];
const statValues = ref<number[]>(Array.from({ length: stats.length }, () => 0));

const expeditionCount = ref(0);
const isExpeditionCountValid = computed(() => isNumberInput(expeditionCount.value.toString()));

const calculatedExpeditionLevel = computed(() => levelUps.findLastIndex((exp) => expeditionCount.value > exp) + 1); // using greater than instead of greater than or equal to catch the bug that frigates which have an expedition count that exactly corresponds to a rank up level

const combinedStats = computed(() => statValues.value.reduce((acc, cur) => acc + (cur || 0), 0));
const combinedTraits = computed(() => traitValues.value.reduce((acc, cur) => acc + (cur || 0), 0));

const baseStat = computed(() => combinedStats.value - combinedTraits.value - 6 * calculatedExpeditionLevel.value); // NoSonar I have no idea why this has to be here. Reddit says so.
const calculatedBaseStat = computed(() =>
  Math.max(worstFrigateBaseStat, Math.min(bestFrigateBaseStat, baseStat.value))
);

const nonNegativeBaseStat = computed(() => calculatedBaseStat.value - worstFrigateBaseStat); // for easy math
const progressValue = computed(
  () => Math.round((nonNegativeBaseStat.value * (100 - 10)) / (bestFrigateBaseStat - worstFrigateBaseStat)) + 10
);

const progressClassName = computed(() => {
  const classNameMapping = [
    {
      value: 5,
      className: 'bg-danger',
    },
    {
      value: 10,
      className: 'bg-warning',
    },
    {
      value: 15,
      className: 'bg-info',
    },
  ];

  return classNameMapping.find((item) => nonNegativeBaseStat.value < item.value)?.className ?? 'bg-success';
});
</script>

<template>
  <header>
    <NavBar />
    <h1 class="text-center">Frigate Calculator</h1>
  </header>

  <main>
    <form @submit.prevent>
      <fieldset>
        <legend>
          <span>Raw Frigate Stats</span>
          <HelpPopup input="stats" />
        </legend>

        <div class="stat-list">
          <StatInput
            v-for="(stat, index) in stats"
            v-model="statValues[index]"
            :placeholder="stat"
          />
        </div>
        <p>Total Base Stats: {{ combinedStats }}</p>
      </fieldset>

      <fieldset>
        <legend>
          <span>Traits (except Fuel & Duration)</span>
          <HelpPopup input="traits" />
        </legend>
        <div class="trait-list">
          <TraitInput
            v-for="(_, index) in traitValues"
            v-model="traitValues[index]"
            @remove="removeTrait(index)"
          />
        </div>
        <button
          :disabled="traitValues.length >= maxAmountOfTraits"
          class="add-trait-button"
          @click="addTrait"
        >
          Add Trait
        </button>
        <p>Total Bonus Points: {{ combinedTraits }}</p>
      </fieldset>

      <fieldset>
        <legend>
          <span>Amount of Expeditions</span>
          <HelpPopup input="expeditions" />
        </legend>
        <input
          v-model.trim.number="expeditionCount"
          :aria-invalid="!isExpeditionCountValid || undefined"
          type="text"
          placeholder="Expeditions"
        />
        <p>Total Rank-Ups: {{ calculatedExpeditionLevel }}</p>
      </fieldset>
    </form>

    <p>
      Frigate score (-5 – 14): <output class="text-bold">{{ calculatedBaseStat }}</output>
    </p>

    <progress
      :aria-valuenow="progressValue"
      :class="progressClassName"
      :value="progressValue"
      class="progress"
      max="100"
      role="meter"
    ></progress>
  </main>

  <footer>
    <div class="credits text-center">
      Forked from nms-frigate-calc by
      <a
        href="https://github.com/gander/"
        target="_blank"
        >gander</a
      >
      <br />
      (<a
        href="https://nms.gander.tools/"
        target="_blank"
        >Website</a
      >
      |
      <a
        href="https://github.com/gander/nms-frigate-calc"
        target="_blank"
        >GitHub</a
      >)
    </div>

    <div class="sources">
      <p>Formula sources:</p>
      <ul>
        <li>
          <a
            href="https://steamcommunity.com/sharedfiles/filedetails/?id=1505175794"
            target="_blank"
            >Frigate Buyer's Guide - How to Pick the Best Ships (and avoid "Lemons")</a
          >
        </li>
        <li>
          <a
            href="https://www.reddit.com/r/NoMansSkyTheGame/comments/knjokc/a_guide_to_evaluating_frigate_stats/"
            target="_blank"
            >A Guide to Evaluating Frigate Stats</a
          >
        </li>
      </ul>
    </div>
  </footer>
</template>

<style scoped lang="scss">
h1 {
  margin-block: 1rem 2rem;
}

.trait-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-list {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
}

fieldset {
  border: 1px solid var(--pico-primary-border);
  border-radius: var(--pico-border-radius);
  padding: 1rem;
  padding-block-start: 0;

  input {
    margin: 0;
  }

  legend {
    display: flex;
    gap: 0.25rem;
  }

  p {
    margin-block: 1rem 0;
  }
}

.add-trait-button {
  margin-block-start: 1rem;
}

$colors: (
  bg-danger: red,
  bg-warning: yellow,
  bg-success: green,
);

@mixin progress-bar($color) {
  &::-moz-progress-bar,
  &::-webkit-progress-value {
    background-color: $color;
  }
}

.progress {
  @each $name, $color in $colors {
    &.#{$name} {
      @include progress-bar($color);
    }
  }
}

footer {
  margin-block-start: 3rem;
  background-color: var(--pico-card-sectioning-background-color);
  padding: 1rem 2rem;

  .credits {
    margin-block-end: 1.5rem;
  }

  .sources {
    p {
      margin: 0;
    }
  }
}
</style>
