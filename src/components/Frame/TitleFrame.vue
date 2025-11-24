<template>
  <div>
    <md-tabs>
      <md-primary-tab>
        <span class="tab-title">Create Recipe</span>
      </md-primary-tab>
    </md-tabs>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
div {
  height: 4.5rem;
  background-color: var(--md-sys-color-surface);
  padding-left: 2rem;

  display: flex;
  align-items: center;
}

.tab-title {
  /* Wir nutzen die System-Variablen aus deiner Doku für "Title Large" */

  font-size: var(--md-sys-typescale-title-large-size);
  line-height: var(--md-sys-typescale-title-large-line-height);

  /* "Emphasized" bedeutet in Material meistens ein höheres Font-Weight.
     Der Standard Title-Large ist oft 400. Wir setzen ihn manuell hoch. */

  /* WICHTIG: Damit die Farbe weiterhin vom Tab gesteuert wird (aktiv/inaktiv) */
  color: var(--md-sys-color-on-surface-variant);
}
</style>
