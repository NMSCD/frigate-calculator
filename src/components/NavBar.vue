<script setup lang="ts">
import { watch, ref } from 'vue';
import ThemeSwitch from './ThemeSwitch.vue';
import { useI18n } from '@/hooks/useI18n';
import { usePageDataStore } from '@/stores/pageData';
import { storeToRefs } from 'pinia';

const { t, locale, availableLocales } = useI18n();

const selectedLocale = ref(locale.value);

watch(selectedLocale, (newVal) => {
  locale.value = newVal;
  localStorage.setItem('lang', newVal);
  selectedLanguage.value = newVal;
});

const pageData = usePageDataStore();
const { selectedLanguage } = storeToRefs(pageData);
</script>

<template>
  <nav>
    <ul>
      <li>
        <a
          href=".."
          :title="t('translation.viewother')"
        >
          ← {{ t('translation.viewother') }}
        </a>
      </li>
    </ul>
    <ul>
      <li>
        <select v-model="selectedLocale">
          <option
            v-for="loc in availableLocales"
            :key="`locale-${loc}`"
            :value="loc"
          >
            {{ loc }}
          </option>
        </select>
      </li>
      <li>
        <ThemeSwitch />
      </li>
    </ul>
  </nav>
</template>
