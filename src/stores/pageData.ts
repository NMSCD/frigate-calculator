import { defineStore } from 'pinia';

interface PageData {
  selectedLanguage: string;
}

const defaultState: PageData = {
  selectedLanguage: '',
};

export const usePageDataStore = defineStore('pageData', {
  state: (): PageData => structuredClone(defaultState),
});
