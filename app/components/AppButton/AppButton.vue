<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
  }>(),
  {
    disabled: false,
    type: 'button',
    variant: 'secondary',
  },
)
</script>

<template>
  <button
    :class="[$style.button, $style[`button_${variant}`]]"
    :disabled="disabled"
    :type="type"
  >
    <slot />
  </button>
</template>

<style module lang="scss" src="./AppButton.module.scss" />
