<template>
  <div
    class="w-screen h-screen fixed top-0 left-0 bg-black opacity-70 z-10 flex items-center justify-center"
    v-if="isSubmitted"
  >
    <span class="text-4xl text-white">Submitting...</span>
  </div>
  <div class="flex flex-col">
    <span class="text-3xl px-8 pt-5 font-bold text-stone-800 select-none"
      >Stuyk's Torso Matcher</span
    >
    <span class="font-medium text-stone-400 px-8 pt-2"
      >Select which torsos match, the torso body should only be in the main
      clothing body a little bit. Hands and arms should be just inside
      clothing.</span
    >

    <div
      class="flex flex-col items-center justify-center text-white gap-5 w-full p-8 md:flex-row"
    >
      <template
        v-if="getFemaleTops && getFemaleTorsos && getMaleTops && getMaleTorsos"
      >
        <PreviewImage
          :male="isMale"
          :top="isMale ? getMaleTops[topIndex] : getFemaleTops[topIndex]"
          :torso="
            isMale ? getMaleTorsos[torsoIndex] : getFemaleTorsos[torsoIndex]
          "
        />
      </template>

      <div class="flex flex-col h-full gap-5">
        <div class="grid grid-cols-4 gap-5 flex-grow">
          <div
            v-for="(img, index) in isMale ? getMaleTorsos : getFemaleTorsos"
            class="bg-stone-800 rounded-lg p-3 border-2 border-stone-700 hover:border-stone-400 cursor-pointer shadow-xl active:scale-95 relative"
            :class="
              isSelected(img)
                ? ['!border-green-500 hover:border-green-500 bg-green-950']
                : []
            "
            @mouseover="torsoIndex = index"
            @click="toggleTorso(img)"
          >
            <img :key="index" :src="img" class="w-64" />
            <IconsCheckIcon
              v-if="isSelected(img)"
              class="absolute right-2 top-2 size-6 text-green-500"
            />
          </div>
        </div>
        <div class="flex flex-row gap-5 w-full">
          <button
            class="bg-stone-800 w-full rounded-lg flex flex-col items-center justify-center p-4 shadow-lg hover:bg-stone-500 active:scale-95"
            @click="skip"
          >
            Skip
          </button>
          <button
            class="bg-stone-700 w-full rounded-lg flex flex-col items-center justify-center p-4 shadow-lg hover:bg-stone-500 active:scale-95"
            @click="submit"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    <span class="text-5xl font-bold px-8 text-stone-700 pb-8">Examples</span>
    <div class="flex flex-col w-full gap-5 px-8 md:flex-row mb-8">
      <div class="flex flex-col w-full gap-6">
        <span class="text-2xl text-white font-bold">Yes</span>
        <img
          src="~/public/examples/yes1.png"
          class="rounded-lg border-4 border-green-800"
        />
        <img
          src="~/public/examples/yes2.png"
          class="rounded-lg border-4 border-green-800"
        />
      </div>
      <div class="flex flex-col w-full gap-6">
        <span class="text-2xl text-white font-bold">No</span>
        <img
          src="~/public/examples/no1.png"
          class="rounded-lg border-4 border-red-800"
        />
        <img
          src="~/public/examples/no2.png"
          class="rounded-lg border-4 border-red-800"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { callWithNuxt } from "#app";

const isMale = ref(false);
const isSubmitted = ref(false);
const selectedTorsos = ref<string[]>([]);

let maleTops = await useFetch<string[]>("/api/getMaleTops", { server: true });
let femaleTops = await useFetch<string[]>("/api/getFemaleTops", {
  server: true,
});

const maleTorsos = await useFetch<string[]>("/api/getMaleTorsos", {
  server: true,
});
const femaleTorsos = await useFetch<string[]>("/api/getFemaleTorsos", {
  server: true,
});

const torsoIndex = ref(0);
const topIndex = ref(0);

async function skip() {
  const nuxtApp = useNuxtApp();
  const newMaleTops = await callWithNuxt(nuxtApp, useFetch, [
    `/api/getMaleTops`,
  ]);
  const newFemaleTops = await callWithNuxt(nuxtApp, useFetch, [
    `/api/getFemaleTops`,
  ]);

  if (newMaleTops) {
    maleTops.data = newMaleTops.data as Ref<string[]>;
  }

  if (newFemaleTops) {
    femaleTops.data = newFemaleTops.data as Ref<string[]>;
  }

  selectedTorsos.value = [];

  isMale.value = !isMale.value;
  let topsLength = isMale
    ? maleTops.data.value?.length
    : femaleTops.data.value?.length;

  if (!topsLength) {
    topsLength = 0;
  }

  topIndex.value = Math.floor(Math.random() * topsLength);
}

function toggleTorso(torso: string) {
  const index = selectedTorsos.value.findIndex((x) => x === torso);
  if (index <= -1) {
    selectedTorsos.value.push(torso);
    return;
  }

  selectedTorsos.value.splice(index, 1);
}

function isSelected(img: string) {
  return selectedTorsos.value.find((x) => x === img);
}

async function submit() {
  if (isSubmitted.value) {
    return;
  }

  isSubmitted.value = true;

  const data = isMale.value ? maleTops.data : femaleTops.data;
  if (!data.value) {
    console.error(`Error... with submit. I can't describe it.`);
    return;
  }

  await useFetch<boolean>("/api/vote", {
    body: { img: data.value[topIndex.value], torsos: selectedTorsos.value },
    method: "POST",
    server: true,
  });

  isSubmitted.value = false;
  skip();
}

const getMaleTorsos = computed(() => {
  return maleTorsos.data.value;
});

const getFemaleTorsos = computed(() => {
  return femaleTorsos.data.value;
});

const getFemaleTops = computed(() => {
  return femaleTops.data.value;
});

const getMaleTops = computed(() => {
  return maleTops.data.value;
});

skip();
</script>
