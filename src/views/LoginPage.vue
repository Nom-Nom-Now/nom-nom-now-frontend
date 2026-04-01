<template>
  <section class="login-page">
    <div class="login-card">
      <h1>{{ t('feature.login.headline') }}</h1>
      <p>{{ t('feature.login.description') }}</p>
      <button
        class="google-login-button"
        type="button"
        @click="redirectToGoogle"
      >
        {{ t('feature.login.button') }}
      </button>
      <div class="legal-links">
        <a :href="privacyUrl" class="legal-link">{{
          t('feature.login.privacy')
        }}</a>
        <a :href="imprintUrl" class="legal-link">{{
          t('feature.login.imprint')
        }}</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const backendUrl = (import.meta.env.VITE_BACKEND_URL ?? '').replace(/\/+$/, '');
const googleLoginUrl = `${backendUrl}/oauth2/authorization/google`;
const privacyUrl = `${backendUrl}/datenschutz`;
const imprintUrl = `${backendUrl}/impressum`;

const redirectToGoogle = () => {
  window.location.href = googleLoginUrl;
};
</script>

<style scoped>
.login-page {
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--md-sys-color-background);
  padding: 1.5rem;
}

.login-card {
  width: min(28rem, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  background-color: var(--md-sys-color-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 1rem;
  padding: 2rem;
}

h1 {
  margin: 0;
  color: var(--md-sys-color-on-surface);
  font-size: var(--md-sys-typescale-headline-small-size);
  line-height: var(--md-sys-typescale-headline-small-line-height);
}

p {
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: var(--md-sys-typescale-body-large-size);
  line-height: var(--md-sys-typescale-body-large-line-height);
}

.legal-links {
  width: 100%;
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.legal-link {
  color: var(--md-sys-color-on-surface-variant);
  text-decoration: none;
  font-size: var(--md-sys-typescale-body-small-size);
  line-height: var(--md-sys-typescale-body-small-line-height);
}

.legal-link:hover {
  text-decoration: underline;
}

.google-login-button {
  border: none;
  border-radius: 999px;
  padding: 0.625rem 1.5rem;
  cursor: pointer;
  color: var(--md-sys-color-on-primary);
  background-color: var(--md-sys-color-primary);
  font-size: var(--md-sys-typescale-label-large-size);
  line-height: var(--md-sys-typescale-label-large-line-height);
  font-weight: var(--md-sys-typescale-label-large-weight);
}

.google-login-button:hover {
  filter: brightness(0.96);
}
</style>
