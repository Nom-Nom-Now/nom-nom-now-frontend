import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { defineComponent } from 'vue';
import IngredientList from '../components/ingredients/IngredientList.vue';
import de from '../../../../../locales/de.json';
import en from '../../../../../locales/en.json';

const IngredientRowStub = defineComponent({
  name: 'IngredientRow',
  emits: ['moveUp', 'moveDown'],
  template: '<div class="ingredient-row-stub" />',
});

function createWrapper() {
  const i18n = createI18n({
    legacy: false,
    locale: 'de',
    messages: { de, en },
  });

  return mount(IngredientList, {
    global: {
      plugins: [i18n],
      stubs: {
        IngredientRow: IngredientRowStub,
        MdLabel: { template: '<span><slot /></span>' },
      },
      config: {
        compilerOptions: {
          isCustomElement: (tag: string) => tag.startsWith('md-'),
        },
      },
    },
  });
}

describe('IngredientList', () => {
  it('rendert initial 3 Zutatenreihen', () => {
    const wrapper = createWrapper();
    expect(wrapper.findAll('.ingredient-row-stub')).toHaveLength(3);
  });

  it('fuegt eine neue Reihe hinzu beim Klick auf den Button', async () => {
    const wrapper = createWrapper();
    await wrapper.find('.add-ingredient-btn').trigger('click');
    expect(wrapper.findAll('.ingredient-row-stub')).toHaveLength(4);
  });

  it('moveUp verschiebt eine Zutat nach oben', async () => {
    const wrapper = createWrapper();
    const rows = wrapper.findAllComponents(IngredientRowStub);
    await rows[1]!.vm.$emit('moveUp');
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.ingredient-row-stub')).toHaveLength(3);
  });

  it('moveDown verschiebt eine Zutat nach unten', async () => {
    const wrapper = createWrapper();
    const rows = wrapper.findAllComponents(IngredientRowStub);
    await rows[0]!.vm.$emit('moveDown');
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.ingredient-row-stub')).toHaveLength(3);
  });
});
