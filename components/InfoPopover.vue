<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  trigger: { type: String, default: null },
  title: { type: String, required: true },
  width: { type: String, default: "400px" },
  x: { type: String, default: "2rem" },
  y: { type: String, default: "2rem" },
});

const open = ref(false);
const root = ref(null);

function onClickOutside(e) {
  if (open.value && root.value && !root.value.contains(e.target))
    open.value = false;
}

onMounted(() => document.addEventListener("pointerdown", onClickOutside));
onUnmounted(() => document.removeEventListener("pointerdown", onClickOutside));
</script>

<template>
  <div class="ip-root" ref="root" :style="{ top: y, right: x }">
    <button
      class="ip-btn"
      :class="{ 'ip-btn--active': open }"
      :aria-label="title"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span v-if="trigger">{{ trigger }}</span
      ><span v-else class="i-lucide-lightbulb" />
    </button>

    <Transition name="ip-pop">
      <div v-if="open" class="ip-popover" :style="{ width }">
        <div class="ip-title">{{ title }}</div>
        <div class="ip-body">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ip-root {
  position: absolute;
  z-index: 10;
}

.ip-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.5px solid #93c5fd;
  background: var(--cj-defense-bg);
  color: var(--cj-defense);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition:
    background 150ms,
    border-color 150ms;
}
.ip-btn:hover,
.ip-btn--active {
  background: var(--cj-defense-bg);
  border-color: var(--cj-defense);
}

.ip-popover {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 1.5px solid var(--cj-defense-border);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.12);
  padding: 14px 16px;
  z-index: 20;
}

.ip-title {
  font-size: 1.2em;
  font-weight: 600;
  color: var(--cj-defense-text);
  margin-bottom: 8px;
}

.ip-body {
  font-size: 1em;
  color: var(--cj-text);
  line-height: 1.5;
}

.ip-pop-enter-active,
.ip-pop-leave-active {
  transition:
    opacity 160ms,
    transform 160ms;
}
.ip-pop-enter-from,
.ip-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
