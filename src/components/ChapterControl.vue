<template>
  <div class="chapter-control text-center my-5 h5">
    <router-link
      v-for="(item, key) in chapterControl"
      :key="key"
      :to="item.to()"
      class="mx-3"
      :class="{ disabled: item.disabled() }"
      >{{ item.name }}
    </router-link>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  props: ["chapterControl"],
};
</script>
<style>
.chapter-control a {
  color: var(--primary);
}
.chapter-control a.disabled {
  color: var(--secondary);
  pointer-events: none;
}
</style>