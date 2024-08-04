<script setup lang="ts">
import { computed, ref } from 'vue';
import NavBar from './components/NavBar.vue';
import TraitInput from './components/TraitInput.vue';
import StatInput from './components/StatInput.vue';
import { isNumberInput } from './helpers/validation';
import HelpPopup from './components/HelpPopup.vue';

// const levelUps = [4, 8, 15, 25, 30, 35, 40, 45, 50, 55];

// const traitsInput = ref('');
// const statsInput = ref('');
// const baseStat = ref(0);
// const validStat = ref(0);
// const expeditions: Ref<number | null> = ref(null);

// const stats = ref(0);
// const bonuses = ref(0);
// const levelUp = ref(0);

// const scoreClass = ref('');
// const scoreStyle = reactive({ width: '10%' });

// const reset = () => {
//   traitsInput.value = '';
//   statsInput.value = '';
//   baseStat.value = 0;
//   validStat.value = 0;
//   expeditions.value = null;
//   stats.value = 0;
//   bonuses.value = 0;
//   levelUp.value = 0;
//   scoreClass.value = 'bg-warning';
// };

// onMounted(reset);

// const extractTraits = (str: string): number[] => {
//   const matches: number[] = [];

//   let m;
//   while ((m = regex.exec(str))) {
//     if (m.index === regex.lastIndex) {
//       regex.lastIndex++;
//     }

//     matches.push(parseInt(m[0]));
//   }

//   return matches.filter((value) => value !== 0).slice(0, 5);
// };

// const calcExpeditions = (expeditions: number): number => {
//   let result = 0;

//   for (const [lvl, exp] of levelUps.entries()) {
//     if (exp > expeditions) {
//       break;
//     }

//     result = lvl;
//   }

//   return result;
// };

// watchEffect(() => {
//   stats.value = extractTraits(statsInput.value).reduce((sum, cur) => cur + sum, 0);
//   bonuses.value = extractTraits(traitsInput.value).reduce((sum, cur) => cur + sum, 0);
//   levelUp.value = calcExpeditions(expeditions.value ?? 0);
//   baseStat.value = stats.value - bonuses.value - 6 * levelUp.value;
//   validStat.value = Math.max(-5, Math.min(14, baseStat.value));
// });

// watchEffect(() => {
//   const value = validStat.value + 5; // for easy math

//   if (value < 5) {
//     scoreClass.value = 'bg-danger';
//   } else if (value < 10) {
//     scoreClass.value = 'bg-warning';
//   } else if (value < 15) {
//     scoreClass.value = 'bg-info';
//   } else {
//     scoreClass.value = 'bg-success';
//   }

//   scoreStyle.width = `${Math.round((value * (100 - 10)) / (14 - -5)) + 10}%`;
// });

const traitValues = ref<number[]>([0]);

const addTrait = () => traitValues.value.push(0);
const removeTrait = (index: number) => (traitValues.value = traitValues.value.filter((_, idx) => idx !== index));

const stats = ['Combat', 'Exploration', 'Industrial', 'Trade'];
const statValues = ref<number[]>(Array.from({ length: stats.length }, () => 0));

const expeditionCount = ref(0);
const isExpeditionCountValid = computed(() => isNumberInput(expeditionCount.value.toString()));
</script>

<template>
  <header>
    <NavBar />
    <h1 class="text-center">NMS Frigate Calculator</h1>
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
            :total-traits="traitValues.length"
            @remove="removeTrait(index)"
          />
        </div>
        <button
          :disabled="traitValues.length >= 5"
          class="add-trait-button"
          @click="addTrait"
        >
          Add Trait
        </button>
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
      </fieldset>
    </form>
    <!--
    <div class="col-sm-7 col-md-5 col-lg-4 col-xl-3">
      <div class="mt-3 input-group">
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="stats"
            v-model.trim="statsInput"
            inputmode="numeric"
          />
          <label
            for="stats"
            class="form-label"
            >Stats</label
          >
        </div>
        <span
          class="input-group-text"
          title="Sum of Stats points"
          >{{ stats }}</span
        >
      </div>

      <div class="mt-3 input-group">
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="traits"
            v-model.trim="traitsInput"
            inputmode="numeric"
          />
          <label
            for="traits"
            class="form-label"
            >Traits</label
          >
        </div>
        <span
          class="input-group-text"
          title="Sum of Bonuses points"
          >{{ bonuses }}</span
        >
      </div>
      <div class="form-text text-muted text-center">Without fuel and time modifiers</div>

      <div class="mt-3 input-group">
        <div class="form-floating">
          <input
            type="number"
            class="form-control"
            min="0"
            id="expeditions"
            v-model="expeditions"
          />
          <label
            for="expeditions"
            class="form-label"
            >Expeditions:</label
          >
        </div>
        <span
          class="input-group-text"
          title="Number of levels up"
          >{{ levelUp }}</span
        >
      </div>

      <div class="my-3 text-center fw-bold">
        <div
          class="progress"
          style="height: 2rem"
        >
          <div
            class="progress-bar"
            role="progressbar"
            :class="scoreClass"
            :style="scoreStyle"
            aria-label="Score"
            :aria-valuenow="baseStat"
            aria-valuemin="-5"
            aria-valuemax="14"
          >
            {{ validStat }}
          </div>
        </div>
      </div>

      <div class="mb-3 text-center d-grid">
        <button
          @click="reset"
          class="btn btn-warning"
        >
          Reset
        </button>
      </div>

      <div
        class="alert alert-primary text-center"
        role="alert"
      >
        Provide
        <mark>stats</mark>
        and
        <mark>traits</mark>
        as positive or negative integers. Any other chars will be ignored. eg:
        <span class="font-monospace">"1,2.3 -4"</span>
      </div>
    </div>
    <div class="row">
      <div class="col mt-3 d-flex flex-column align-items-center">
        <div class="lead">Formula sources</div>
        <a
          href="https://steamcommunity.com/sharedfiles/filedetails/?id=1505175794"
          target="_blank"
          >Frigate Buyer's Guide - How to Pick the Best Ships (and avoid "Lemons")</a
        >
        <a
          href="https://www.reddit.com/r/NoMansSkyTheGame/comments/knjokc/a_guide_to_evaluating_frigate_stats/"
          target="_blank"
          >A Guide to Evaluating Frigate Stats</a
        >
      </div>
    </div> -->
  </main>

  <footer></footer>
</template>

<style scoped>
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
}

.add-trait-button {
  margin-block-start: 1rem;
}
</style>
