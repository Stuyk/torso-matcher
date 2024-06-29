<template>
  <div
    class="grid h-full items-center justify-center w-full bg-stone-800 p-12 rounded-lg"
  >
    <img :src="props?.top" class="col-start-1 row-start-1 object-contain" />
    <img
      :src="props?.torso"
      class="col-start-1 row-start-1 object-contain opacity-70"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ top: string; torso: string }>();
</script>
