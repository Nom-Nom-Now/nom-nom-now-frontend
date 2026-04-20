<script setup lang="ts">
import MdLabel from '../../../../../../components/MdLabel.vue';
import { useI18n } from 'vue-i18n';
import { useCreateRecipeStore } from '../../stores/useCreateRecipeStore';
import { storeToRefs } from 'pinia';
import { ref, watch, onBeforeUnmount } from 'vue';

const { t } = useI18n();
const store = useCreateRecipeStore();
const { recipeImage } = storeToRefs(store);
const fileInput = ref<HTMLInputElement | null>(null);
const cameraInput = ref<HTMLInputElement | null>(null);
const imagePreviewUrl = ref<string | null>(null);

function buildPreviewUrl(file: File | null) {
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
    imagePreviewUrl.value = null;
  }
  if (file) {
    imagePreviewUrl.value = URL.createObjectURL(file);
  }
}

// Sync preview with persisted store state (handles remount when switching steps)
buildPreviewUrl(recipeImage.value);
watch(recipeImage, (file) => buildPreviewUrl(file));

onBeforeUnmount(() => {
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }
});

function setRecipeImageFromInput(input: HTMLInputElement) {
  const file = input.files?.[0];
  if (!file) return;
  store.setRecipeImage(file);
  input.value = '';
}

function handleFileSelect(event: Event) {
  setRecipeImageFromInput(event.target as HTMLInputElement);
}

function handleCapture(event: Event) {
  setRecipeImageFromInput(event.target as HTMLInputElement);
}

function removeImage() {
  store.setRecipeImage(null);
  if (fileInput.value) fileInput.value.value = '';
  if (cameraInput.value) cameraInput.value.value = '';
}

function openGallery() {
  fileInput.value?.click();
}

function openCamera() {
  cameraInput.value?.click();
}

// Drag & Drop
const isDragging = ref(false);

function onDragOver(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function onDragLeave(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) {
    store.setRecipeImage(file);
  }
}
</script>

<template>
  <div class="frame">
    <md-tabs>
      <MdLabel size="large">
        {{ t('feature.recipes.createRecipe.image.heading') }}
      </MdLabel>
    </md-tabs>

    <!-- Image Preview -->
    <div v-if="imagePreviewUrl" class="preview-container">
      <img :src="imagePreviewUrl" :alt="t('feature.recipes.createRecipe.image.previewAlt')" class="preview-image" />
      <md-outlined-button @click="removeImage" class="remove-btn">
        <md-icon slot="icon">delete</md-icon>
        {{ t('feature.recipes.createRecipe.image.removeImage') }}
      </md-outlined-button>
    </div>

    <!-- Placeholder when no image (drop zone) -->
    <div
      v-else
      class="placeholder"
      :class="{ 'placeholder--dragging': isDragging }"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <md-icon class="placeholder-icon">image</md-icon>
      <MdLabel size="medium">
        {{ t('feature.recipes.createRecipe.image.noImage') }}
      </MdLabel>
      <MdLabel size="small" class="drop-hint">
        {{ t('feature.recipes.createRecipe.image.dropHint') }}
      </MdLabel>
    </div>

    <!-- Action Buttons -->
    <div class="actions">
      <md-filled-button @click="openCamera">
        <md-icon slot="icon">photo_camera</md-icon>
        {{ t('feature.recipes.createRecipe.image.takePhoto') }}
      </md-filled-button>

      <md-outlined-button @click="openGallery">
        <md-icon slot="icon">photo_library</md-icon>
        {{ t('feature.recipes.createRecipe.image.fromGallery') }}
      </md-outlined-button>
    </div>

    <!-- Hidden inputs -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden-input"
      @change="handleFileSelect"
    />
    <input
      ref="cameraInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden-input"
      @change="handleCapture"
    />
  </div>
</template>

<style scoped>
.frame {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-left: 2rem;
}

.preview-image {
  width: 100%;
  max-width: 400px;
  max-height: 300px;
  object-fit: cover;
  border-radius: 0.75rem;
  border: 1px solid var(--md-sys-color-outline-variant);
}



.remove-btn {
  margin-top: 0.5rem;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 10rem;
  height: 11.5rem;
  border: 2px dashed var(--md-sys-color-outline-variant);
  border-radius: 0.75rem;
  margin-left: 2rem;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.placeholder--dragging {
  border-color: var(--md-sys-color-primary);
  background-color: var(--md-sys-color-primary-container);
}

.placeholder-icon {
  font-size: 2.5rem;
  color: var(--md-sys-color-on-surface-variant);
}

.drop-hint {
  color: var(--md-sys-color-on-surface-variant);
}

.actions {
  display: flex;
  gap: 1rem;
  margin-left: 2rem;
}

.hidden-input {
  display: none;
}
</style>
