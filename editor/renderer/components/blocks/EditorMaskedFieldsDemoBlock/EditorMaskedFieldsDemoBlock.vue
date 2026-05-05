<script setup lang="ts">
import type { MaskedFieldsDemoBlockData } from '~~/editor/shared'

defineProps<{
  data: MaskedFieldsDemoBlockData
}>()
</script>

<template>
  <section :class="$style.maskedFieldsDemo">
    <dl :class="$style.maskedFieldsDemoList">
      <div>
        <dt>Phone</dt>
        <dd>{{ data.phone || '-' }}</dd>
      </div>
      <div>
        <dt>Date</dt>
        <dd>{{ data.date || '-' }}</dd>
      </div>
      <div>
        <dt>Time</dt>
        <dd>{{ data.time || '-' }}</dd>
      </div>
      <div>
        <dt>Price</dt>
        <dd>{{ data.price || '-' }}</dd>
      </div>
      <div>
        <dt>Card</dt>
        <dd>{{ data.card || '-' }}</dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd>{{ data.email || '-' }}</dd>
      </div>
    </dl>
  </section>
</template>

<style module lang="scss" src="./EditorMaskedFieldsDemoBlock.module.scss" />
