<template>
  <section class="login-page">
    <section class="brand-panel">
      <div class="brand-top">
        <span class="brand-logo">
          <img src="../assets/Logo.png" alt="" />
        </span>
        <span class="brand-wordmark">Nom Nom Now</span>
      </div>

      <div class="brand-center">
        <span class="brand-eyebrow">
          <md-icon>restaurant_menu</md-icon>
          {{ t('feature.login.brandEyebrow') }}
        </span>
        <h2 class="brand-headline">
          {{ t('feature.login.brandHeadline') }}<br />
          <span>{{ t('feature.login.brandHeadlineAccent') }}</span>
        </h2>
        <p class="brand-sub">{{ t('feature.login.brandDescription') }}</p>

        <div class="brand-features">
          <div class="brand-feature">
            <span class="feature-icon"><md-icon>calendar_month</md-icon></span>
            {{ t('feature.login.featurePlan') }}
          </div>
          <div class="brand-feature">
            <span class="feature-icon"><md-icon>menu_book</md-icon></span>
            {{ t('feature.login.featureRecipes') }}
          </div>
          <div class="brand-feature">
            <span class="feature-icon"><md-icon>shopping_cart</md-icon></span>
            {{ t('feature.login.featureShopping') }}
          </div>
        </div>
      </div>

      <div class="brand-footer">© 2026 Nom Nom Now</div>
    </section>

    <section class="form-panel">
      <div class="login-card">
        <h1>{{ t('feature.login.headline') }}</h1>
        <p class="lead">{{ t('feature.login.description') }}</p>

        <div v-if="sessionExpired" class="session-expired-message">
          <md-icon>info</md-icon>
          <span>{{ t('feature.login.sessionExpired') }}</span>
        </div>

        <button
          class="google-login-button"
          type="button"
          @click="redirectToGoogle"
        >
          <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          {{ t('feature.login.button') }}
        </button>

        <div class="divider">{{ t('feature.login.divider') }}</div>

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
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

const backendUrl = (import.meta.env.VITE_BACKEND_URL ?? '').replace(/\/+$/, '');
const googleLoginUrl = `${backendUrl}/oauth2/authorization/google`;
const privacyUrl = `${backendUrl}/datenschutz`;
const imprintUrl = `${backendUrl}/impressum`;
const sessionExpired = computed(() => route.query.sessionExpired === '1');

const redirectToGoogle = () => {
  window.location.href = googleLoginUrl;
};
</script>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  min-height: 100dvh;
  background-color: var(--md-sys-color-background);
}

.brand-panel {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3.5rem;
  color: var(--md-sys-color-on-primary);
  background:
    radial-gradient(120% 90% at 100% 0%, #3a805e 0%, rgba(58, 128, 94, 0) 55%),
    radial-gradient(110% 80% at 0% 100%, #214d39 0%, rgba(33, 77, 57, 0) 60%),
    linear-gradient(150deg, #2f6b4f 0%, #245540 100%);
}

.brand-panel::after {
  content: '';
  position: absolute;
  right: -8rem;
  bottom: -8rem;
  width: 26rem;
  height: 26rem;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 223, 156, 0.18) 0%,
    rgba(255, 223, 156, 0) 70%
  );
  pointer-events: none;
}

.brand-top {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-logo {
  width: 4rem;
  height: 4rem;
  display: grid;
  place-items: center;
  border-radius: var(--nnn-radius-md);
  background: var(--md-sys-color-surface-container-lowest);
  box-shadow: var(--nnn-elevation-2);
}

.brand-logo img {
  width: 3rem;
  height: 3rem;
}

.brand-wordmark {
  font-size: 1.5rem;
  font-weight: 700;
}

.brand-center {
  position: relative;
  z-index: 1;
  max-width: 30rem;
}

.brand-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.4rem 0.85rem;
  border-radius: var(--nnn-radius-pill);
  background: rgba(255, 255, 255, 0.14);
  color: #eafff1;
  font-size: 0.8rem;
  font-weight: 600;
}

.brand-eyebrow md-icon {
  --md-icon-size: 18px;
  color: var(--md-sys-color-tertiary-container);
}

.brand-headline {
  margin: 0 0 1rem;
  font-size: 2.75rem;
  font-weight: 700;
  line-height: 1.08;
}

.brand-headline span {
  color: var(--md-sys-color-tertiary-container);
}

.brand-sub {
  max-width: 26rem;
  margin: 0 0 2.5rem;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.0625rem;
  line-height: 1.55;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.brand-feature {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-size: 1rem;
  font-weight: 500;
}

.feature-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  border-radius: var(--nnn-radius-sm);
  background: rgba(255, 255, 255, 0.14);
  color: var(--md-sys-color-tertiary-container);
}

.feature-icon md-icon {
  --md-icon-size: 22px;
}

.brand-footer {
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: min(26rem, 100%);
  display: flex;
  flex-direction: column;
}

.login-card h1 {
  margin: 0 0 0.5rem;
  color: var(--md-sys-color-on-surface);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}

.lead {
  margin: 0 0 2rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 1.0625rem;
  line-height: 1.5;
}

.session-expired-message {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
  padding: 0.85rem 1rem;
  border-radius: var(--nnn-radius-sm);
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  font-size: 0.9rem;
  line-height: 1.4;
}

.session-expired-message md-icon {
  --md-icon-size: 20px;
  margin-top: 1px;
}

.google-login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  height: 3.25rem;
  padding: 0 1.5rem;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: var(--nnn-radius-pill);
  background-color: var(--md-sys-color-surface-container-lowest);
  color: var(--md-sys-color-on-surface);
  font: inherit;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    box-shadow 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease;
}

.google-login-button:hover {
  border-color: var(--md-sys-color-outline);
  background-color: var(--md-sys-color-surface-container-low);
  box-shadow: var(--nnn-elevation-1);
}

.google-login-button svg {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.75rem 0 1.5rem;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.8rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--md-sys-color-outline-variant);
}

.legal-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.75rem;
}

.legal-link {
  color: var(--md-sys-color-on-surface-variant);
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
}

.legal-link:hover {
  color: var(--md-sys-color-primary);
  text-decoration: underline;
}

@media (max-width: 860px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .brand-panel {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
    padding: 2.25rem;
  }

  .brand-center,
  .brand-features,
  .brand-footer {
    display: none;
  }

  .form-panel {
    align-items: flex-start;
    padding: 2.5rem 1.5rem;
  }
}
</style>
